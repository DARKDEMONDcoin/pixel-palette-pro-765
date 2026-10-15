// Server-only sequence engine: sends due messages through the right channel provider.
type Admin = (typeof import("@/integrations/supabase/client.server"))["supabaseAdmin"];

export async function integration(admin: Admin, ws: string, provider: string) {
  const { data: row } = await admin.from("integrations").select("id,status,config").eq("workspace_id", ws).eq("provider", provider).maybeSingle();
  if (!row || row.status !== "connected") return null;
  const { data: s } = await admin.from("integration_secrets").select("secret").eq("integration_id", row.id).maybeSingle();
  if (!s?.secret) return null;
  return { config: (row.config ?? {}) as Record<string, string>, secret: s.secret };
}

function localParts(tz: string, d: Date) {
  const f = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short", hour: "numeric", hour12: false });
  const parts = Object.fromEntries(f.formatToParts(d).map((p) => [p.type, p.value]));
  return { day: String(parts["weekday"]).toLowerCase().slice(0, 3), hour: Number(parts["hour"]) % 24 };
}

type Agent = { id: string; status: string; mailbox_status: string; daily_send_cap: number; send_days: string[]; send_start_hour: number; send_end_hour: number; send_timezone: string; warmup_enabled: boolean; warmup_start_cap: number; warmup_increment: number; created_at: string };

function capFor(a: Agent) {
  if (!a.warmup_enabled) return a.daily_send_cap;
  const days = Math.floor((Date.now() - new Date(a.created_at).getTime()) / 86400000);
  return Math.min(a.daily_send_cap, a.warmup_start_cap + days * a.warmup_increment);
}

export async function slackAlert(admin: Admin, ws: string, text: string) {
  const s = await integration(admin, ws, "slack");
  if (s) await fetch(s.secret, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) }).catch(() => null);
}

/** Processes due scheduled messages. Returns counts. */
export async function runDue(admin: Admin, limit = 50) {
  const now = new Date();
  const { data: due } = await admin.from("messages")
    .select("id,channel,subject,body,workspace_id,campaign_id,campaign_lead_id,campaign:campaigns(status,agent_id,language),cl:campaign_leads(status,lead:leads(email,linkedin_url,phone,first_name,last_name,company))")
    .eq("status", "scheduled").lte("scheduled_for", now.toISOString()).order("scheduled_for").limit(limit);
  const out = { sent: 0, waiting: 0, failed: 0, deferred: 0 };
  const agents = new Map<string, Agent | null>();
  const sentToday = new Map<string, number>();
  for (const m of due ?? []) {
    const c = m.campaign as unknown as { status: string; agent_id: string; language: string } | null;
    const cl = m.cl as unknown as { status: string; lead: Record<string, string | null> } | null;
    if (!c || !cl) continue;
    if (c.status !== "active") { out.deferred++; continue; }
    if (cl.status !== "active") { await admin.from("messages").update({ status: "skipped", error: `Lead ${cl.status}` }).eq("id", m.id); continue; }
    if (!agents.has(c.agent_id)) {
      const { data: a } = await admin.from("agents").select("*").eq("id", c.agent_id).maybeSingle();
      agents.set(c.agent_id, a as Agent | null);
      const start = new Date(now); start.setUTCHours(0, 0, 0, 0);
      const { data: campIds } = await admin.from("campaigns").select("id").eq("agent_id", c.agent_id);
      const { count } = await admin.from("messages").select("id", { count: "exact", head: true }).eq("status", "sent").gte("sent_at", start.toISOString()).in("campaign_id", (campIds ?? []).map((x) => x.id));
      sentToday.set(c.agent_id, count ?? 0);
    }
    const a = agents.get(c.agent_id);
    if (!a || a.status !== "active") { out.deferred++; continue; }
    const lp = localParts(a.send_timezone || "UTC", now);
    if (!a.send_days.includes(lp.day) || lp.hour < a.send_start_hour || lp.hour >= a.send_end_hour) { out.deferred++; continue; }
    if ((sentToday.get(c.agent_id) ?? 0) >= capFor(a)) { out.deferred++; continue; }
    const l = cl.lead;
    let error: string | null = null, waiting = false;
    try {
      if (m.channel === "email") {
        if (a.mailbox_status !== "connected") { waiting = true; error = "Agent mailbox not connected"; }
        else { waiting = true; error = "Mailbox sending not available yet"; }
      } else if (m.channel === "linkedin") {
        const p = await integration(admin, m.workspace_id, "phantombuster");
        if (!p) { waiting = true; error = "Phantombuster not connected"; }
        else if (!l["linkedin_url"]) error = "Lead has no LinkedIn URL";
        else {
          const r = await fetch("https://api.phantombuster.com/api/v2/agents/launch", { method: "POST", headers: { "X-Phantombuster-Key": p.secret, "Content-Type": "application/json" },
            body: JSON.stringify({ id: p.config["phantom_id"], argument: { profileUrl: l["linkedin_url"], message: m.body } }) });
          if (!r.ok) error = `Phantombuster [${r.status}]: ${(await r.text()).slice(0, 200)}`;
        }
      } else if (m.channel === "call") {
        const v = await integration(admin, m.workspace_id, "vapi");
        const assistant = v ? (c.language === "ar" ? v.config["assistant_ar"] : v.config["assistant_en"]) || v.config["assistant_en"] || v.config["assistant_ar"] : null;
        if (!v || !assistant || !v.config["phone_number_id"]) { waiting = true; error = "Vapi not connected (needs assistant and phone number)"; }
        else if (!l["phone"]) error = "Lead has no phone number";
        else {
          const r = await fetch("https://api.vapi.ai/call", { method: "POST", headers: { Authorization: `Bearer ${v.secret}`, "Content-Type": "application/json" },
            body: JSON.stringify({ assistantId: assistant, phoneNumberId: v.config["phone_number_id"], customer: { number: l["phone"] },
              assistantOverrides: { variableValues: { first_name: l["first_name"] ?? "", company: l["company"] ?? "", talking_points: m.body } } }) });
          if (!r.ok) error = `Vapi [${r.status}]: ${(await r.text()).slice(0, 200)}`;
        }
      }
    } catch (e) { error = e instanceof Error ? e.message : "Send failed"; }
    if (waiting) { await admin.from("messages").update({ status: "waiting", error }).eq("id", m.id); out.waiting++; }
    else if (error) { await admin.from("messages").update({ status: "failed", error }).eq("id", m.id); out.failed++; }
    else { await admin.from("messages").update({ status: "sent", sent_at: new Date().toISOString(), error: null }).eq("id", m.id); sentToday.set(c.agent_id, (sentToday.get(c.agent_id) ?? 0) + 1); out.sent++; }
  }
  return out;
}

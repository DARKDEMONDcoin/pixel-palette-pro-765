import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Database, Briefcase, MessageSquare, Mail, Linkedin, Phone, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/lib/workspace";
import { saveIntegration, disconnectIntegration, type Provider } from "@/lib/integrations.functions";

export const Route = createFileRoute("/_authenticated/integrations")({
  head: () => ({ meta: [{ title: "Integrations — Outreach AI" }, { name: "description", content: "Connect Apollo, mailboxes, LinkedIn, calls, CRM and Slack." }] }),
  component: IntegrationsPage,
});

const defs: { id: Provider; name: string; desc: string; icon: typeof Database; secretLabel: string; fields?: { key: string; label: string; placeholder: string }[] }[] = [
  { id: "apollo", name: "Apollo", desc: "Find leads and enrich contacts.", icon: Database, secretLabel: "API key" },
  { id: "freshsales", name: "Freshsales CRM", desc: "Push sales-qualified leads to your CRM.", icon: Briefcase, secretLabel: "API key",
    fields: [{ key: "domain", label: "Freshsales domain", placeholder: "yourcompany.myfreshworks.com" }] },
  { id: "slack", name: "Slack", desc: "Get alerts for replies and qualified leads.", icon: MessageSquare, secretLabel: "Incoming webhook URL" },
];

type Row = { provider: string; status: string; config: Record<string, string>; last_tested_at: string | null; last_error: string | null };

function IntegrationsPage() {
  const { current, isAdmin } = useWorkspace();
  const ws = current?.workspace_id;
  const q = useQuery({
    queryKey: ["integrations", ws],
    enabled: !!ws,
    queryFn: async () => {
      const { data, error } = await supabase.from("integrations").select("provider,status,config,last_tested_at,last_error").eq("workspace_id", ws!);
      if (error) throw error;
      return data as unknown as Row[];
    },
  });
  if (!ws) return null;
  return (
    <div>
      <PageHeader title="Integrations" description="Connect Apollo, mailboxes, LinkedIn, calls, CRM and Slack." />
      {!isAdmin && <p className="mb-4 text-sm text-muted-foreground">Only Super Admins can change integrations.</p>}
      <div className="grid gap-4 lg:grid-cols-2">
        {defs.map((d) => <IntegrationCard key={d.id} def={d} ws={ws} row={q.data?.find((r) => r.provider === d.id)} canEdit={isAdmin} />)}
        <StaticCard icon={Mail} name="Mailboxes (Gmail / Outlook)" desc="Each agent sends from its own mailbox.">
          Mailbox sign-in needs a Google / Microsoft app set up for your workspace first. <Link to="/agents" className="text-primary underline">Go to agents</Link>
        </StaticCard>
        <StaticCard icon={Linkedin} name="LinkedIn" desc="Connection requests and messages.">Not available yet — needs a LinkedIn automation provider.</StaticCard>
        <StaticCard icon={Phone} name="Calls" desc="Call tasks and dialing.">Not available yet — needs a calling provider.</StaticCard>
      </div>
    </div>
  );
}

function Status({ status }: { status?: string | undefined }) {
  const map: Record<string, [string, string]> = {
    connected: ["Connected", "bg-success/15 text-success"],
    error: ["Error", "bg-destructive/15 text-destructive"],
  };
  const [label, cls] = map[status ?? ""] ?? ["Not connected", "bg-muted text-muted-foreground"];
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{label}</span>;
}

function Shell({ icon: Icon, name, desc, status, children }: { icon: typeof Database; name: string; desc: string; status?: string | undefined; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-lavender text-primary"><Icon className="size-5" /></div>
        <div className="flex-1"><h3 className="font-semibold">{name}</h3><p className="text-sm text-muted-foreground">{desc}</p></div>
        <Status status={status} />
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function StaticCard(p: { icon: typeof Database; name: string; desc: string; children: React.ReactNode }) {
  return <Shell {...p}><p className="text-sm text-muted-foreground">{p.children}</p></Shell>;
}

function IntegrationCard({ def, ws, row, canEdit }: { def: (typeof defs)[number]; ws: string; row?: Row | undefined; canEdit: boolean }) {
  const qc = useQueryClient();
  const save = useServerFn(saveIntegration);
  const disconnect = useServerFn(disconnectIntegration);
  const [secret, setSecret] = useState("");
  const [config, setConfig] = useState<Record<string, string>>(row?.config ?? {});
  const [busy, setBusy] = useState(false);

  async function run(fn: () => Promise<unknown>) {
    setBusy(true);
    try { await fn(); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    setBusy(false);
    qc.invalidateQueries({ queryKey: ["integrations", ws] });
  }
  const test = () => run(async () => {
    const r = await save({ data: { workspaceId: ws, provider: def.id, secret: secret || undefined, config: { ...row?.config, ...config } } });
    r.ok ? toast.success(`${def.name} connected`) : toast.error(r.error ?? "Test failed");
    setSecret("");
  });

  return (
    <Shell icon={def.icon} name={def.name} desc={def.desc} status={row?.status}>
      {canEdit && (
        <div className="space-y-3">
          {def.fields?.map((f) => (
            <div key={f.key} className="space-y-1.5"><Label>{f.label}</Label>
              <Input value={config[f.key] ?? row?.config?.[f.key] ?? ""} placeholder={f.placeholder} onChange={(e) => setConfig({ ...config, [f.key]: e.target.value })} /></div>
          ))}
          <div className="space-y-1.5"><Label>{def.secretLabel}</Label>
            <Input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder={row ? "Saved — enter a new one to replace" : ""} /></div>
        </div>
      )}
      {row?.last_error && <p className="mt-3 break-words text-sm text-destructive">{row.last_error}</p>}
      {row?.last_tested_at && <p className="mt-2 text-xs text-muted-foreground">Last tested {new Date(row.last_tested_at).toLocaleString()}</p>}
      {canEdit && (
        <div className="mt-4 flex gap-2">
          <Button onClick={test} disabled={busy || (!secret && !row)}>{busy && <Loader2 className="size-4 animate-spin" />}{row ? "Save & test" : "Connect"}</Button>
          {row && <Button variant="ghost" disabled={busy} onClick={() => run(() => disconnect({ data: { workspaceId: ws, provider: def.id } }))}>Disconnect</Button>}
        </div>
      )}
    </Shell>
  );
}

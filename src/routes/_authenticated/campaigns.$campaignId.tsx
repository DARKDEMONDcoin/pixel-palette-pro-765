import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { BasicsForm, SourceStep, QualificationStep, ResearchStep, STEPS, type Campaign } from "@/components/campaign-wizard";
import { CampaignStatus } from "./campaigns.index";

export const Route = createFileRoute("/_authenticated/campaigns/$campaignId")({
  head: () => ({ meta: [{ title: "Campaign — Outreach AI" }, { name: "description", content: "Set up leads, qualification and research for this campaign." }] }),
  component: CampaignPage,
});

function CampaignPage() {
  const { campaignId } = Route.useParams();
  const q = useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: async () => {
      const { data, error } = await supabase.from("campaigns").select("*, agent:agents(name), organization:organizations(name)").eq("id", campaignId).maybeSingle();
      if (error) throw error;
      return data as unknown as (Campaign & { agent: { name: string } | null; organization: { name: string } | null }) | null;
    },
  });
  const [step, setStep] = useState<number | null>(null);
  if (q.isLoading) return <Skeleton className="h-64 rounded-2xl" />;
  if (!q.data) return <p className="text-muted-foreground">Campaign not found or you don't have access.</p>;
  const c = q.data;
  const active = step ?? Math.min(c.wizard_step, 4);
  return (
    <div>
      <Link to="/campaigns" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Campaigns</Link>
      <PageHeader title={c.name} description={`${c.agent?.name ?? "—"} for ${c.organization?.name ?? "—"}`} actions={<CampaignStatus status={c.status} />} />
      <ol className="mb-6 flex flex-wrap gap-2">
        {STEPS.map((s, i) => {
          const n = i + 1;
          const enabled = n <= 4;
          return (
            <li key={s}>
              <button disabled={!enabled} onClick={() => setStep(n)}
                className={`rounded-full px-3 py-1.5 text-sm transition ${n === active ? "bg-primary text-primary-foreground" : enabled ? "bg-card shadow-soft hover:bg-lavender" : "bg-muted text-muted-foreground"}`}>
                {n}. {s}{!enabled && " · Phase 6"}
              </button>
            </li>
          );
        })}
      </ol>
      {active === 1 && <BasicsForm campaign={c} onSaved={() => setStep(2)} />}
      {active === 2 && <SourceStep campaign={c} onNext={() => setStep(3)} />}
      {active === 3 && <QualificationStep campaign={c} onNext={() => setStep(4)} />}
      {active === 4 && <ResearchStep campaign={c} />}
    </div>
  );
}

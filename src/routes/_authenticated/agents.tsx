import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, PageHeader } from "@/components/app-shell";

export const Route = createFileRoute("/_authenticated/agents")({
  head: () => ({ meta: [{ title: "Agents — Outreach AI" }, { name: "description", content: "AI SDRs, each tied to a brand and trained on its documents." }] }),
  component: () => (
    <div>
      <PageHeader title="Agents" description="AI SDRs, each tied to a brand and trained on its documents." />
      <ComingSoon phase={3} title="Agents is coming next">Create agents with a persona, a brand, a connected mailbox and target markets.</ComingSoon>
    </div>
  ),
});

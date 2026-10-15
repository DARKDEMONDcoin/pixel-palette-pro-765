import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, PageHeader } from "@/components/app-shell";

export const Route = createFileRoute("/_authenticated/campaigns")({
  head: () => ({ meta: [{ title: "Campaigns — Outreach AI" }, { name: "description", content: "Multi-channel outreach sequences run by your agents." }] }),
  component: () => (
    <div>
      <PageHeader title="Campaigns" description="Multi-channel outreach sequences run by your agents." />
      <ComingSoon phase={5} title="Campaigns is coming next">The campaign wizard: lead sources, qualification, research, sequence and approval.</ComingSoon>
    </div>
  ),
});

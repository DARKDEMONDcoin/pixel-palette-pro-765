import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, PageHeader } from "@/components/app-shell";

export const Route = createFileRoute("/_authenticated/leads")({
  head: () => ({ meta: [{ title: "Leads — Outreach AI" }, { name: "description", content: "Your workspace-wide lead database." }] }),
  component: () => (
    <div>
      <PageHeader title="Leads" description="Your workspace-wide lead database." />
      <ComingSoon phase={7} title="Leads is coming next">Filters, bulk actions, per-campaign status and lead timelines.</ComingSoon>
    </div>
  ),
});

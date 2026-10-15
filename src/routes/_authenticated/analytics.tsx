import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, PageHeader } from "@/components/app-shell";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Outreach AI" }, { name: "description", content: "Which agents and campaigns perform best." }] }),
  component: () => (
    <div>
      <PageHeader title="Analytics" description="Which agents and campaigns perform best." />
      <ComingSoon phase={8} title="Analytics is coming next">Funnels, reply and interest rates, A/B results and cost per SQL.</ComingSoon>
    </div>
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, PageHeader } from "@/components/app-shell";

export const Route = createFileRoute("/_authenticated/organizations")({
  head: () => ({ meta: [{ title: "Organizations — Outreach AI" }, { name: "description", content: "Brands and the documents your agents learn from." }] }),
  component: () => (
    <div>
      <PageHeader title="Organizations" description="Brands and the documents your agents learn from." />
      <ComingSoon phase={2} title="Organizations is coming next">Upload company profiles, certifications and rate cards; review what the AI knows.</ComingSoon>
    </div>
  ),
});

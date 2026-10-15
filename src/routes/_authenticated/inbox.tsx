import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, PageHeader } from "@/components/app-shell";

export const Route = createFileRoute("/_authenticated/inbox")({
  head: () => ({ meta: [{ title: "Inbox — Outreach AI" }, { name: "description", content: "Every reply across all agents in one place." }] }),
  component: () => (
    <div>
      <PageHeader title="Inbox" description="Every reply across all agents in one place." />
      <ComingSoon phase={7} title="Inbox is coming next">Threaded replies with AI classification, quick reply and mark-as-SQL.</ComingSoon>
    </div>
  ),
});

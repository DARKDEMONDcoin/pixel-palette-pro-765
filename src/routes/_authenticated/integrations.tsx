import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, PageHeader } from "@/components/app-shell";

export const Route = createFileRoute("/_authenticated/integrations")({
  head: () => ({ meta: [{ title: "Integrations — Outreach AI" }, { name: "description", content: "Connect Apollo, mailboxes, LinkedIn, calls, CRM and Slack." }] }),
  component: () => (
    <div>
      <PageHeader title="Integrations" description="Connect Apollo, mailboxes, LinkedIn, calls, CRM and Slack." />
      <ComingSoon phase={4} title="Integrations is coming next">Connection cards with status and test buttons for every service.</ComingSoon>
    </div>
  ),
});

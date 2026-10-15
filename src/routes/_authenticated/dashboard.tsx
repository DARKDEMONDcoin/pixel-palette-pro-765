import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Building2, CheckCircle2, Circle, FileUp, Mail, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Outreach AI" }, { name: "description", content: "Your outbound overview." }] }),
  component: Dashboard,
});

const kpis = [
  { label: "Emails sent", tone: "bg-lavender text-primary" },
  { label: "Reply rate", tone: "bg-sky text-info" },
  { label: "Interested", tone: "bg-success/15 text-success" },
  { label: "SQLs", tone: "bg-warning/20 text-warning" },
];

const steps = [
  { label: "Create an organization", icon: Building2, to: "/organizations" },
  { label: "Upload brand documents", icon: FileUp, to: "/organizations" },
  { label: "Create an agent", icon: Bot, to: "/agents" },
  { label: "Connect a mailbox", icon: Mail, to: "/agents" },
  { label: "Launch a campaign", icon: Megaphone, to: "/campaigns" },
] as const;

function Dashboard() {
  const { user, current } = useWorkspace();
  const name = (user.user_metadata?.["full_name"] as string | undefined)?.split(" ")[0];
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome${name ? `, ${name}` : ""}`}
        description={current ? `Workspace: ${current.workspace.name}` : ""}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link to="/agents">New agent</Link></Button>
            <Button asChild><Link to="/campaigns">New campaign</Link></Button>
          </div>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl bg-card p-5 shadow-soft">
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${k.tone}`}>{k.label}</span>
            <div className="mt-3 font-display text-3xl font-semibold">—</div>
            <p className="mt-1 text-xs text-muted-foreground">No campaigns yet</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-card p-6 shadow-soft">
        <h2 className="text-lg font-semibold">Get started</h2>
        <p className="text-sm text-muted-foreground">Five steps to your first AI-run campaign.</p>
        <ul className="mt-4 divide-y">
          {steps.map((s, i) => (
            <li key={s.label} className="flex items-center gap-3 py-3">
              {i === -1 ? <CheckCircle2 className="size-5 text-success" /> : <Circle className="size-5 text-muted-foreground" />}
              <s.icon className="size-4 text-primary" />
              <span className="flex-1">{s.label}</span>
              <Button variant="ghost" size="sm" asChild><Link to={s.to}>Open</Link></Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

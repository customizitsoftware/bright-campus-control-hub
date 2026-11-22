import { createFileRoute, Link } from "@tanstack/react-router";
import { Circle, CircleCheck, Users, Wallet, CalendarCheck, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { useSchool } from "@/components/layout/school-context";
import { profileComplete } from "@/lib/console-state";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_console/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · SchoolOS" },
      { name: "description", content: "Your school's overview and onboarding checklist in SchoolOS." },
      { property: "og:title", content: "Dashboard · SchoolOS" },
      { property: "og:description", content: "Your school's overview and onboarding checklist in SchoolOS." },
    ],
  }),
  component: Dashboard,
});

const CHECKLIST: { title: string; description: string; to: string }[] = [
  { title: "Create your school profile", description: "Name, type, location, session and branding.", to: "/setup" },
  { title: "Set up classes & subjects", description: "Arms, levels and subject allocation.", to: "/academics" },
  { title: "Invite staff", description: "Teachers, bursar and administrators.", to: "/staff" },
  { title: "Enrol students", description: "Import or add students with guardians.", to: "/students" },
  { title: "Configure fees", description: "Fee items, terms and payment channels.", to: "/finance" },
  { title: "Connect parents", description: "Give guardians access to the parent portal.", to: "/parent-portal" },
];

function Dashboard() {
  const school = useSchool();
  const complete = profileComplete(school.selected?.schools);
  return (
    <div className="space-y-8">
      <PageHeader title="Welcome to SchoolOS" description="Get your school ready in a few steps. Figures appear here only once real records exist." />

      <section aria-labelledby="onboarding" className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="bg-brand-gradient px-6 py-6 text-primary-foreground">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-80">Getting started</p>
          <h2 id="onboarding" className="mt-1 text-xl font-semibold">Onboarding checklist</h2>
          <p className="mt-1 text-sm opacity-80">{complete ? 1 : 0} of {CHECKLIST.length} steps complete</p>
        </div>
        <ol className="divide-y divide-border">
          {CHECKLIST.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-start gap-3">
                {i === 0 && complete ? <CircleCheck className="mt-0.5 size-5 text-success" aria-label="Complete" /> : <Circle className="mt-0.5 size-5 text-muted-foreground" aria-hidden />}
                <div>
                  <p className="font-medium">{i + 1}. {step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm"><Link to={step.to}>Open</Link></Button>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="overview" className="text-lg font-semibold">School at a glance</h2>
          <StatusBadge tone="pending">Awaiting data</StatusBadge>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <EmptyState icon={Users} title="No enrolment data" description="Student counts by class will show after you enrol students." />
          <EmptyState icon={CalendarCheck} title="No attendance recorded" description="Daily attendance trends appear once teachers start marking registers." />
          <EmptyState icon={Wallet} title="No fee activity" description="Collections and outstanding balances appear after fees are configured." />
          <EmptyState icon={Megaphone} title="No announcements" description="Messages sent to parents and staff will be listed here." />
        </div>
      </section>
    </div>
  );
}

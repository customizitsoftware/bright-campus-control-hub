import { createFileRoute, Link } from "@tanstack/react-router";
import { User } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { PendingBanner, PendingAction } from "@/components/common/pending-action";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_console/students/$studentId")({
  head: () => ({
    meta: [
      { title: "Student profile · SchoolOS" },
      { name: "description", content: "Student profile layout in SchoolOS." },
      { property: "og:title", content: "Student profile · SchoolOS" },
      { property: "og:description", content: "Student profile layout in SchoolOS." },
    ],
  }),
  component: StudentDetail,
});

const TABS = [
  { v: "overview", l: "Overview" }, { v: "guardians", l: "Guardians" }, { v: "attendance", l: "Attendance" },
  { v: "results", l: "Results" }, { v: "fees", l: "Fees" },
];

function StudentDetail() {
  const { studentId } = Route.useParams();
  return (
    <div className="space-y-6">
      <PageHeader title="Student profile" description={`Record reference: ${studentId}`}
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Students", to: "/students" }, { label: "Profile" }]}
        actions={<><Button asChild variant="outline"><Link to="/students">Back to students</Link></Button><PendingAction>Edit profile</PendingAction></>} />
      <PendingBanner>Demo layout only — no student record is loaded. Real profiles require backend access controls.</PendingBanner>
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground"><User className="size-6" aria-hidden /></div>
        <div>
          <p className="font-display text-lg font-semibold text-muted-foreground">Student name</p>
          <StatusBadge tone="pending">Demo placeholder</StatusBadge>
        </div>
      </div>
      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap">{TABS.map((t) => <TabsTrigger key={t.v} value={t.v}>{t.l}</TabsTrigger>)}</TabsList>
        {TABS.map((t) => (
          <TabsContent key={t.v} value={t.v} className="mt-4">
            <EmptyState icon={User} title={`No ${t.l.toLowerCase()} data`} description="This section will show the student's records once the backend is connected." />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

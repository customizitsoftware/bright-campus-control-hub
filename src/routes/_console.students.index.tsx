import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, UserPlus } from "lucide-react";
import { ModulePage } from "@/components/common/module-page";
import { DataTable, type Column } from "@/components/common/data-table";
import { PendingAction } from "@/components/common/pending-action";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_console/students/")({
  head: () => ({
    meta: [
      { title: "Students · SchoolOS" },
      { name: "description", content: "Student records, classes and guardians in SchoolOS." },
      { property: "og:title", content: "Students · SchoolOS" },
      { property: "og:description", content: "Student records, classes and guardians in SchoolOS." },
    ],
  }),
  component: Students,
});

type Student = { id: string; name: string; admissionNo: string; className: string; status: "active" | "withdrawn" };

const columns: Column<Student>[] = [
  { key: "name", header: "Name", cell: (s) => <Link to="/students/$studentId" params={{ studentId: s.id }} className="font-medium text-primary hover:underline">{s.name}</Link> },
  { key: "adm", header: "Admission no.", cell: (s) => s.admissionNo },
  { key: "class", header: "Class", cell: (s) => s.className },
  { key: "status", header: "Status", cell: (s) => <StatusBadge tone={s.status === "active" ? "success" : "neutral"}>{s.status}</StatusBadge> },
];

function Students() {
  const rows: Student[] = [];
  return (
    <ModulePage icon={Users} title="Students" description="Every enrolled learner, their class and guardians."
      actions={<PendingAction><UserPlus /> Add student</PendingAction>}
      planned={["Student profiles & guardians", "Bulk CSV import", "Class & arm assignment", "Promotion and graduation", "Medical & special-needs notes (restricted)", "Document uploads"]}>
      <DataTable columns={columns} rows={rows} getRowId={(r) => r.id} searchPlaceholder="Search by name or admission no."
        searchText={(r) => r.name + " " + r.admissionNo}
        filters={[{ key: "status", label: "Statuses", options: [{ value: "active", label: "Active" }, { value: "withdrawn", label: "Withdrawn" }], match: (r, v) => r.status === v }]}
        empty={{ icon: Users, title: "No students yet", description: "Students will appear here once enrolment is connected to the backend.",
          action: <Button asChild variant="outline" size="sm"><Link to="/students/$studentId" params={{ studentId: "demo" }}>View demo profile layout</Link></Button> }} />
    </ModulePage>
  );
}

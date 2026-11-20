import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { ModulePage } from "@/components/common/module-page";
import { DataTable, type Column } from "@/components/common/data-table";
import { PendingAction } from "@/components/common/pending-action";

export const Route = createFileRoute("/_console/academics")({
  head: () => ({
    meta: [
      { title: "Classes & Subjects · SchoolOS" },
      { name: "description", content: "Class levels, arms, subjects and teacher allocation." },
      { property: "og:title", content: "Classes & Subjects · SchoolOS" },
      { property: "og:description", content: "Class levels, arms, subjects and teacher allocation." },
    ],
  }),
  component: Page,
});

type Row = { id: string; cls: string; arm: string; teacher: string; subjects: string };

const columns: Column<Row>[] = [
  { key: "cls", header: "Class", cell: (r) => r.cls },
  { key: "arm", header: "Arm", cell: (r) => r.arm },
  { key: "teacher", header: "Class teacher", cell: (r) => r.teacher },
  { key: "subjects", header: "Subjects", cell: (r) => r.subjects },
];

function Page() {
  const rows: Row[] = [];
  return (
    <ModulePage icon={BookOpen} title="Classes & Subjects" description="Class levels, arms, subjects and teacher allocation."
      actions={<PendingAction>Add class</PendingAction>}
      planned={["Class levels & arms", "Subject catalogue (NERDC aligned)", "Teacher-subject allocation", "Timetable builder"]}>
      <DataTable columns={columns} rows={rows} getRowId={(r) => r.id} searchText={(r) => Object.values(r).join(" ")}
        empty={{ icon: BookOpen, title: "No classes configured", description: "Create classes like JSS 1A or Primary 4 to start allocating subjects and teachers." }} />
    </ModulePage>
  );
}

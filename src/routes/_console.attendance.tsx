import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck } from "lucide-react";
import { ModulePage } from "@/components/common/module-page";
import { DataTable, type Column } from "@/components/common/data-table";
import { PendingAction } from "@/components/common/pending-action";

export const Route = createFileRoute("/_console/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance · SchoolOS" },
      { name: "description", content: "Daily registers for students and staff." },
      { property: "og:title", content: "Attendance · SchoolOS" },
      { property: "og:description", content: "Daily registers for students and staff." },
    ],
  }),
  component: Page,
});

type Row = { id: string; date: string; cls: string; teacher: string; status: string };

const columns: Column<Row>[] = [
  { key: "date", header: "Date", cell: (r) => r.date },
  { key: "cls", header: "Class", cell: (r) => r.cls },
  { key: "teacher", header: "Marked by", cell: (r) => r.teacher },
  { key: "status", header: "Status", cell: (r) => r.status },
];

function Page() {
  const rows: Row[] = [];
  return (
    <ModulePage icon={CalendarCheck} title="Attendance" description="Daily registers for students and staff."
      actions={<PendingAction>Mark register</PendingAction>}
      planned={["Daily class registers", "Late & absence reasons", "Parent absence alerts", "Termly attendance summaries"]}>
      <DataTable columns={columns} rows={rows} getRowId={(r) => r.id} searchText={(r) => Object.values(r).join(" ")}
        empty={{ icon: CalendarCheck, title: "No registers recorded", description: "Teachers' daily registers will appear here once classes and students exist." }} />
    </ModulePage>
  );
}

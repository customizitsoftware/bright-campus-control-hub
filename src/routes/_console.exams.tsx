import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { ModulePage } from "@/components/common/module-page";
import { DataTable, type Column } from "@/components/common/data-table";
import { PendingAction } from "@/components/common/pending-action";

export const Route = createFileRoute("/_console/exams")({
  head: () => ({
    meta: [
      { title: "Exams & Results · SchoolOS" },
      { name: "description", content: "Assessments, score entry, result computation and report cards." },
      { property: "og:title", content: "Exams & Results · SchoolOS" },
      { property: "og:description", content: "Assessments, score entry, result computation and report cards." },
    ],
  }),
  component: Page,
});

type Row = { id: string; name: string; cls: string; term: string; status: string };

const columns: Column<Row>[] = [
  { key: "name", header: "Assessment", cell: (r) => r.name },
  { key: "cls", header: "Class", cell: (r) => r.cls },
  { key: "term", header: "Term", cell: (r) => r.term },
  { key: "status", header: "Status", cell: (r) => r.status },
];

function Page() {
  const rows: Row[] = [];
  return (
    <ModulePage icon={ClipboardList} title="Exams & Results" description="Assessments, score entry, result computation and report cards."
      actions={<PendingAction>Create assessment</PendingAction>}
      planned={["CA & exam score entry", "Grading scales", "Result approval workflow", "Report card generation"]}>
      <DataTable columns={columns} rows={rows} getRowId={(r) => r.id} searchText={(r) => Object.values(r).join(" ")}
        empty={{ icon: ClipboardList, title: "No assessments yet", description: "CA tests and exams will be listed here once academic setup is complete." }} />
    </ModulePage>
  );
}

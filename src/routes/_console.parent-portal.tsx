import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake } from "lucide-react";
import { ModulePage } from "@/components/common/module-page";
import { DataTable, type Column } from "@/components/common/data-table";
import { PendingAction } from "@/components/common/pending-action";

export const Route = createFileRoute("/_console/parent-portal")({
  head: () => ({
    meta: [
      { title: "Parent Portal · SchoolOS" },
      { name: "description", content: "What guardians will see: results, fees, attendance and messages." },
      { property: "og:title", content: "Parent Portal · SchoolOS" },
      { property: "og:description", content: "What guardians will see: results, fees, attendance and messages." },
    ],
  }),
  component: Page,
});

type Row = { id: string; name: string; students: string; date: string; status: string };

const columns: Column<Row>[] = [
  { key: "name", header: "Guardian", cell: (r) => r.name },
  { key: "students", header: "Linked students", cell: (r) => r.students },
  { key: "date", header: "Last active", cell: (r) => r.date },
  { key: "status", header: "Status", cell: (r) => r.status },
];

function Page() {
  const rows: Row[] = [];
  return (
    <ModulePage icon={HeartHandshake} title="Parent Portal" description="What guardians will see: results, fees, attendance and messages."
      actions={<PendingAction>Invite parents</PendingAction>}
      planned={["Guardian accounts & linking", "Result & report card access", "Fee statements & payment", "Two-way messaging"]}>
      <DataTable columns={columns} rows={rows} getRowId={(r) => r.id} searchText={(r) => Object.values(r).join(" ")}
        empty={{ icon: HeartHandshake, title: "No parents connected", description: "Guardians linked to students will appear here once parent accounts exist." }} />
    </ModulePage>
  );
}

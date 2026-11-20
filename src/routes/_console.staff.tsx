import { createFileRoute } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { ModulePage } from "@/components/common/module-page";
import { DataTable, type Column } from "@/components/common/data-table";
import { PendingAction } from "@/components/common/pending-action";

export const Route = createFileRoute("/_console/staff")({
  head: () => ({
    meta: [
      { title: "Staff & HR · SchoolOS" },
      { name: "description", content: "Staff records, roles, leave and payroll preparation." },
      { property: "og:title", content: "Staff & HR · SchoolOS" },
      { property: "og:description", content: "Staff records, roles, leave and payroll preparation." },
    ],
  }),
  component: Page,
});

type Row = { id: string; name: string; role: string; dept: string; status: string };

const columns: Column<Row>[] = [
  { key: "name", header: "Name", cell: (r) => r.name },
  { key: "role", header: "Role", cell: (r) => r.role },
  { key: "dept", header: "Department", cell: (r) => r.dept },
  { key: "status", header: "Status", cell: (r) => r.status },
];

function Page() {
  const rows: Row[] = [];
  return (
    <ModulePage icon={Briefcase} title="Staff & HR" description="Staff records, roles, leave and payroll preparation."
      actions={<PendingAction>Invite staff</PendingAction>}
      planned={["Staff profiles & documents", "Role assignment (server-enforced)", "Leave management", "Payroll preparation"]}>
      <DataTable columns={columns} rows={rows} getRowId={(r) => r.id} searchText={(r) => Object.values(r).join(" ")}
        empty={{ icon: Briefcase, title: "No staff added", description: "Staff members will appear here once invitations are enabled." }} />
    </ModulePage>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { ModulePage } from "@/components/common/module-page";
import { DataTable, type Column } from "@/components/common/data-table";
import { PendingAction } from "@/components/common/pending-action";

export const Route = createFileRoute("/_console/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Insights · SchoolOS" },
      { name: "description", content: "Academic, attendance and financial reports built from real records." },
      { property: "og:title", content: "Reports & Insights · SchoolOS" },
      { property: "og:description", content: "Academic, attendance and financial reports built from real records." },
    ],
  }),
  component: Page,
});

type Row = { id: string; name: string; period: string; date: string; status: string };

const columns: Column<Row>[] = [
  { key: "name", header: "Report", cell: (r) => r.name },
  { key: "period", header: "Period", cell: (r) => r.period },
  { key: "date", header: "Generated", cell: (r) => r.date },
  { key: "status", header: "Status", cell: (r) => r.status },
];

function Page() {
  const rows: Row[] = [];
  return (
    <ModulePage icon={BarChart3} title="Reports & Insights" description="Academic, attendance and financial reports built from real records."
      actions={<PendingAction>Generate report</PendingAction>}
      planned={["Enrolment reports", "Academic performance analysis", "Fee collection reports", "Exports to PDF & Excel"]}>
      <DataTable columns={columns} rows={rows} getRowId={(r) => r.id} searchText={(r) => Object.values(r).join(" ")}
        empty={{ icon: BarChart3, title: "No reports available", description: "Reports will be generated once there is real data to analyse." }} />
    </ModulePage>
  );
}

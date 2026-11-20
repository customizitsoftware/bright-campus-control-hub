import { createFileRoute } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { ModulePage } from "@/components/common/module-page";
import { DataTable, type Column } from "@/components/common/data-table";
import { PendingAction } from "@/components/common/pending-action";

export const Route = createFileRoute("/_console/admissions")({
  head: () => ({
    meta: [
      { title: "Admissions · SchoolOS" },
      { name: "description", content: "Application intake, screening and offers for new learners." },
      { property: "og:title", content: "Admissions · SchoolOS" },
      { property: "og:description", content: "Application intake, screening and offers for new learners." },
    ],
  }),
  component: Page,
});

type Row = { id: string; applicant: string; cls: string; date: string; status: string };

const columns: Column<Row>[] = [
  { key: "applicant", header: "Applicant", cell: (r) => r.applicant },
  { key: "cls", header: "Class applied", cell: (r) => r.cls },
  { key: "date", header: "Submitted", cell: (r) => r.date },
  { key: "status", header: "Status", cell: (r) => r.status },
];

function Page() {
  const rows: Row[] = [];
  return (
    <ModulePage icon={UserPlus} title="Admissions" description="Application intake, screening and offers for new learners."
      actions={<PendingAction>Add application</PendingAction>}
      planned={["Online application forms", "Entrance exam scheduling", "Offer & acceptance letters", "Application fee payments"]}>
      <DataTable columns={columns} rows={rows} getRowId={(r) => r.id} searchText={(r) => Object.values(r).join(" ")}
        empty={{ icon: UserPlus, title: "No applications yet", description: "Applications submitted by parents or staff will be listed here." }} />
    </ModulePage>
  );
}

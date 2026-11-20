import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { ModulePage } from "@/components/common/module-page";
import { DataTable, type Column } from "@/components/common/data-table";
import { PendingAction } from "@/components/common/pending-action";

export const Route = createFileRoute("/_console/finance")({
  head: () => ({
    meta: [
      { title: "Fees & Payments · SchoolOS" },
      { name: "description", content: "Fee schedules, invoices, payments and receipts in Naira." },
      { property: "og:title", content: "Fees & Payments · SchoolOS" },
      { property: "og:description", content: "Fee schedules, invoices, payments and receipts in Naira." },
    ],
  }),
  component: Page,
});

type Row = { id: string; name: string; cls: string; amount: string; status: string };

const columns: Column<Row>[] = [
  { key: "name", header: "Fee item", cell: (r) => r.name },
  { key: "cls", header: "Class", cell: (r) => r.cls },
  { key: "amount", header: "Amount (₦)", cell: (r) => r.amount },
  { key: "status", header: "Status", cell: (r) => r.status },
];

function Page() {
  const rows: Row[] = [];
  return (
    <ModulePage icon={Wallet} title="Fees & Payments" description="Fee schedules, invoices, payments and receipts in Naira."
      actions={<PendingAction>Create fee item</PendingAction>}
      planned={["Fee items per class & term", "Invoices & receipts", "Online payment gateway (pending provider)", "Discounts, scholarships & reconciliation"]}>
      <DataTable columns={columns} rows={rows} getRowId={(r) => r.id} searchText={(r) => Object.values(r).join(" ")}
        empty={{ icon: Wallet, title: "No fee items", description: "Fee items and invoices will appear after fee structures are configured." }} />
    </ModulePage>
  );
}

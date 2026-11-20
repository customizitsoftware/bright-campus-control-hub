import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { ModulePage } from "@/components/common/module-page";
import { DataTable, type Column } from "@/components/common/data-table";
import { PendingAction } from "@/components/common/pending-action";

export const Route = createFileRoute("/_console/platform-admin")({
  head: () => ({
    meta: [
      { title: "Platform Admin · SchoolOS" },
      { name: "description", content: "Manage tenant schools, subscriptions and platform health. Platform Super Admin only." },
      { property: "og:title", content: "Platform Admin · SchoolOS" },
      { property: "og:description", content: "Manage tenant schools, subscriptions and platform health. Platform Super Admin only." },
    ],
  }),
  component: Page,
});

type Row = { id: string; name: string; state: string; plan: string; status: string };

const columns: Column<Row>[] = [
  { key: "name", header: "School", cell: (r) => r.name },
  { key: "state", header: "State", cell: (r) => r.state },
  { key: "plan", header: "Plan", cell: (r) => r.plan },
  { key: "status", header: "Status", cell: (r) => r.status },
];

function Page() {
  const rows: Row[] = [];
  return (
    <ModulePage icon={ShieldCheck} title="Platform Admin" description="Manage tenant schools, subscriptions and platform health. Platform Super Admin only."
      actions={<PendingAction>Onboard school</PendingAction>}
      planned={["Tenant school provisioning", "Subscription & billing plans", "Platform audit logs", "Support impersonation (audited)"]}>
      <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">Hiding this page from the menu is not protection. Access must be enforced by server-side authorization before launch.</p>
      <DataTable columns={columns} rows={rows} getRowId={(r) => r.id} searchText={(r) => Object.values(r).join(" ")}
        empty={{ icon: ShieldCheck, title: "No tenant schools", description: "Schools onboarded to SchoolOS will be listed here." }} />
    </ModulePage>
  );
}

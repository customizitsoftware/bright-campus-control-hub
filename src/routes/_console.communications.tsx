import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { ModulePage } from "@/components/common/module-page";
import { DataTable, type Column } from "@/components/common/data-table";
import { PendingAction } from "@/components/common/pending-action";

export const Route = createFileRoute("/_console/communications")({
  head: () => ({
    meta: [
      { title: "Communication · SchoolOS" },
      { name: "description", content: "Announcements, SMS, email and in-app messages." },
      { property: "og:title", content: "Communication · SchoolOS" },
      { property: "og:description", content: "Announcements, SMS, email and in-app messages." },
    ],
  }),
  component: Page,
});

type Row = { id: string; name: string; audience: string; channel: string; status: string };

const columns: Column<Row>[] = [
  { key: "name", header: "Subject", cell: (r) => r.name },
  { key: "audience", header: "Audience", cell: (r) => r.audience },
  { key: "channel", header: "Channel", cell: (r) => r.channel },
  { key: "status", header: "Status", cell: (r) => r.status },
];

function Page() {
  const rows: Row[] = [];
  return (
    <ModulePage icon={MessageSquare} title="Communication" description="Announcements, SMS, email and in-app messages."
      actions={<PendingAction>New announcement</PendingAction>}
      planned={["Announcements to groups", "SMS & email delivery (provider pending)", "Message templates", "Delivery reports"]}>
      <DataTable columns={columns} rows={rows} getRowId={(r) => r.id} searchText={(r) => Object.values(r).join(" ")}
        empty={{ icon: MessageSquare, title: "No messages sent", description: "Announcements and messages to parents and staff will be listed here." }} />
    </ModulePage>
  );
}

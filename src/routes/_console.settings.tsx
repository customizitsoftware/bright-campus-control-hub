import { createFileRoute } from "@tanstack/react-router";
import { Settings, ShieldAlert } from "lucide-react";
import { ModulePage } from "@/components/common/module-page";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { notifyPending } from "@/lib/pending";

export const Route = createFileRoute("/_console/settings")({
  head: () => ({
    meta: [
      { title: "Settings · SchoolOS" },
      { name: "description", content: "School preferences, roles, security and integrations in SchoolOS." },
      { property: "og:title", content: "Settings · SchoolOS" },
      { property: "og:description", content: "School preferences, roles, security and integrations in SchoolOS." },
    ],
  }),
  component: SettingsPage,
});

const SECTIONS = [
  { t: "Sign-in & accounts", d: "Email/password sign-in, password reset and sessions." },
  { t: "Roles & permissions", d: "Server-enforced access for each of the 9 roles." },
  { t: "Payment provider", d: "Online fee collection gateway." },
  { t: "SMS & email provider", d: "Delivery of messages to parents and staff." },
  { t: "Data protection (NDPA)", d: "Consent, retention and data-subject requests." },
  { t: "Audit log", d: "Who changed what, and when." },
];

function SettingsPage() {
  return (
    <ModulePage icon={Settings} title="Settings" description="School preferences, access control, integrations and data protection."
      planned={["School profile editing", "Academic calendar", "Grading scales", "Notification preferences"]}>
      <section aria-labelledby="deps" className="space-y-3">
        <h2 id="deps" className="text-base font-semibold">Platform dependencies</h2>
        <ul className="grid gap-3 md:grid-cols-2">
          {SECTIONS.map((s) => (
            <li key={s.t} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4">
              <div><p className="font-medium">{s.t}</p><p className="text-sm text-muted-foreground">{s.d}</p></div>
              <StatusBadge tone="pending">Pending</StatusBadge>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="danger" className="rounded-xl border border-destructive/30 p-5">
        <h2 id="danger" className="flex items-center gap-2 text-base font-semibold"><ShieldAlert className="size-4 text-destructive" aria-hidden /> Danger zone</h2>
        <p className="mt-1 text-sm text-muted-foreground">Clearing data will permanently remove school records once storage exists.</p>
        <ConfirmDialog
          trigger={<Button variant="destructive" size="sm" className="mt-3">Reset school data</Button>}
          title="Reset all school data?"
          description="This would permanently delete records. In this phase there is no stored data, so nothing will happen."
          confirmLabel="Yes, reset"
          onConfirm={() => notifyPending("Resetting school data")}
        />
      </section>
    </ModulePage>
  );
}

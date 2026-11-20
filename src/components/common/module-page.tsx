import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { PageHeader, type Crumb } from "./page-header";
import { PendingBanner } from "./pending-action";
import { StatusBadge } from "./status-badge";

/** Standard layout for Phase 1 modules: header, pending notice, content, and planned capabilities. */
export function ModulePage({
  title, description, breadcrumbs, actions, planned, children, icon: Icon,
}: {
  title: string; description: string; breadcrumbs?: Crumb[]; actions?: ReactNode;
  planned: string[]; children?: ReactNode; icon: LucideIcon;
}) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} breadcrumbs={breadcrumbs ?? [{ label: "Dashboard", to: "/dashboard" }, { label: title }]} actions={actions} />
      <PendingBanner />
      {children}
      <section aria-labelledby="planned-heading" className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="mb-4 flex items-center gap-2">
          <Icon className="size-4 text-primary" aria-hidden />
          <h2 id="planned-heading" className="text-base font-semibold">Planned for this module</h2>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {planned.map((p) => (
            <li key={p} className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2.5 text-sm">
              <span>{p}</span>
              <StatusBadge tone="neutral">Not started</StatusBadge>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

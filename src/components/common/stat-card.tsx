import type { LucideIcon } from "lucide-react";

/** Only render with real, backend-provided values. Never pass placeholder numbers. */
export function StatCard({
  label, value, hint, icon: Icon,
}: { label: string; value: string | number; hint?: string; icon?: LucideIcon }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{label}</span>
        {Icon && <Icon className="size-4" aria-hidden />}
      </div>
      <p className="mt-2 font-display text-3xl font-semibold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

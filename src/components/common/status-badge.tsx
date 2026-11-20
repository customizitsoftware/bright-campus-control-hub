import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badge = cva("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", {
  variants: {
    tone: {
      neutral: "bg-muted text-muted-foreground",
      success: "bg-success-soft text-success",
      warning: "bg-warning-soft text-warning",
      info: "bg-info-soft text-info",
      danger: "bg-destructive/10 text-destructive",
      pending: "border border-dashed border-warning/60 bg-warning-soft text-warning",
    },
  },
  defaultVariants: { tone: "neutral" },
});

export function StatusBadge({
  children, tone, className,
}: { children: React.ReactNode; className?: string } & VariantProps<typeof badge>) {
  return (
    <span className={cn(badge({ tone }), className)}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

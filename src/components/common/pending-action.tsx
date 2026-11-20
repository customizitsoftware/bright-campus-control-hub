import type { ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/** A visibly disabled action with an explanation of why it is unavailable. */
export function PendingAction({
  children, reason = "Backend setup is pending", variant = "default", size,
}: { children: ReactNode; reason?: string; variant?: ButtonProps["variant"]; size?: ButtonProps["size"] }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Button variant={variant} size={size} disabled aria-disabled title={reason}>
            {children}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>{reason}</TooltipContent>
    </Tooltip>
  );
}

export function PendingBanner({ children }: { children?: ReactNode }) {
  return (
    <div role="note" className="flex items-start gap-3 rounded-lg border border-dashed border-warning/50 bg-warning-soft px-4 py-3 text-sm text-foreground">
      <span className="mt-0.5 rounded bg-warning px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">Pending</span>
      <p>{children ?? "This module is a UI foundation. Data storage, permissions and workflows will connect once the backend is set up."}</p>
    </div>
  );
}

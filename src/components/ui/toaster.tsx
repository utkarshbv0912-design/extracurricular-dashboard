"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Toaster: the single app-wide toast host (sonner), themed with design
 * tokens. Mount once in the root layout; pages call `toast()` directly.
 *
 * Feedback rules (PHASE_1_UX_PLAN.md §14): toasts are for *success* and
 * gentle confirmations — never for guilt, urgency, or destructive pressure.
 * Rich colors are off; the accent ring keeps brand without alarm styling.
 */
export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      position="bottom-right"
      offset={16}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-lg !border !border-line !bg-surface !text-foreground !shadow-lg",
          description: "!text-body",
          success: "[&_svg]:!text-success",
          error: "[&_svg]:!text-danger",
        },
      }}
      {...props}
    />
  );
}

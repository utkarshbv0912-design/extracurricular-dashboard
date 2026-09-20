import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Input: text input with token styling. Pair with <Field> for label +
 * error wiring (aria-describedby, aria-invalid) per PHASE_1_UX_PLAN.md §13.
 */
export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-lg border border-line-strong bg-surface px-3.5 text-sm text-foreground",
        "placeholder:text-faint",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong",
        "aria-invalid:border-danger aria-invalid:focus-visible:outline-danger",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

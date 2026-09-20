import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Textarea: multi-line input matching Input styling. min-height keeps
 * notes/descriptions comfortable on mobile.
 */
export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-lg border border-line-strong bg-surface px-3.5 py-2.5 text-sm text-foreground",
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

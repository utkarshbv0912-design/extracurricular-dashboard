import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Select: native select styled with a custom arrow (SVG data URI via the
 * --select-arrow token, swapped per color scheme in globals.css).
 *
 * A native control is the deliberate MVP choice: full mobile keyboard/
 * screen-reader behavior for free. A custom listbox can replace it later
 * if search-in-select (many opportunities) becomes necessary.
 */
export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-11 w-full appearance-none rounded-lg border border-line-strong bg-surface py-0 pl-3.5 pr-10 text-sm text-foreground",
        "bg-[length:1rem_1rem] bg-[position:right_0.75rem_center] bg-no-repeat",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong",
        "aria-invalid:border-danger aria-invalid:focus-visible:outline-danger",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      style={{ backgroundImage: "var(--select-arrow)" }}
      {...props}
    />
  );
}

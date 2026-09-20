"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Checkbox: Radix primitive — real `<input type=checkbox>` semantics, label
 * association, keyboard toggling, and touch-target size handled for us.
 * Used for the taxonomy interest chips and form consent toggles.
 */
export function Checkbox({
  className,
  ...props
}: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-line-strong bg-surface transition-colors",
        "hover:border-accent",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong",
        "data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-surface",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="h-4 w-4" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

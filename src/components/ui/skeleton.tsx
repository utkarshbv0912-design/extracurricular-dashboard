import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Skeleton: shimmering placeholder matching the token palette. Use it to
 * draw the *shape* of incoming content (cards, rows) so layout doesn't
 * jump when data arrives (PHASE_1_UX_PLAN.md §14 loading convention).
 *
 * The shimmer is the one exception to the "reduced motion = static" rule:
 * it is the only affordance distinguishing loading from empty, so it
 * persists (spinner precedent) but at low contrast and without pulsing.
 */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md bg-surface-muted",
        className,
      )}
      {...props}
    />
  );
}

import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

/**
 * LoadingState: section-level loading surface. Prefer Skeleton shapes when
 * the incoming layout is known (no jump); use this when the layout is
 * unknown or the wait is short and inline.
 */
export function LoadingState({
  label = "Loading",
  className,
  children,
  ...props
}: {
  label?: string;
  children?: ReactNode;
} & ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center text-sm text-body",
        className,
      )}
      {...props}
    >
      <Spinner />
      {children ? children : <p role="status">{label}</p>}
    </div>
  );
}

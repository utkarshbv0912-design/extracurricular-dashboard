import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Avatar: the signed-in user's chip in the header. Initials keep it
 * personal without collecting any image data (least-data principle).
 */
export function Avatar({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent-strong",
        className,
      )}
      {...props}
    />
  );
}

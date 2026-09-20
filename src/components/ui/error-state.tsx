import type { ComponentProps, ReactNode } from "react";
import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import { Card } from "@/components/ui/card";

/**
 * ErrorState: friendly failure surface for section-level and page-level
 * errors. Blame-free copy ("That didn't work — let's try again"), an
 * optional Retry action, and a raw `detail` slot that callers may use
 * for console-only debugging (never user-hostile text).
 */
export function ErrorState({
  title = "Something went wrong",
  description = "That didn't work — let's try again.",
  action,
  className,
  ...props
}: {
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
} & ComponentProps<"div">) {
  return (
    <Card
      className={
        "flex flex-col items-center gap-4 px-6 py-12 text-center " +
        (className ?? "")
      }
      {...props}
    >
      <LightbulbMascot mood="oops" className="h-24 w-24" />
      <div className="max-w-sm">
        <p className="font-drawn text-lg font-semibold text-foreground">
          {title}
        </p>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-body">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </Card>
  );
}

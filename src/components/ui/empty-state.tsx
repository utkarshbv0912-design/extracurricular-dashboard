import type { ReactNode } from "react";
import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import { Card } from "@/components/ui/card";

/**
 * EmptyState: friendly placeholder for "nothing here yet". Uses the mascot so
 * empty screens feel intentional rather than broken.
 */
export function EmptyState({
  title,
  description,
  action,
  mood = "happy",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  mood?: "happy" | "thinking" | "oops";
}) {
  return (
    <Card className="flex flex-col items-center gap-4 px-6 py-12 text-center">
      <LightbulbMascot mood={mood} className="h-24 w-24" />
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

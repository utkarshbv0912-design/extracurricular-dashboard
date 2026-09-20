import { cn } from "@/lib/utils";

/**
 * Progress: the step indicator for onboarding (3 dots) and multi-step flows.
 * Announces progress to screen readers via a native progressbar role.
 *
 * Accessibility: step *labels* are conveyed by the flow's own headings and
 * the aria-label here; the dots are the visual echo, not the sole channel.
 */
export function Progress({
  value,
  max = 3,
  label = "Step {current} of {total}",
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}) {
  const clamped = Math.min(Math.max(value, 0), max);
  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={max}
      aria-valuenow={clamped}
      aria-label={label
        .replace("{current}", String(clamped))
        .replace("{total}", String(max))}
      className={cn("flex items-center gap-2", className)}
    >
      {Array.from({ length: max }, (_, i) => {
        const step = i + 1;
        const done = step < clamped;
        const current = step === clamped;
        return (
          <span
            key={step}
            aria-hidden="true"
            className={cn(
              "h-2 rounded-full transition-all duration-200",
              done || current
                ? "w-6 bg-accent"
                : "w-2 bg-line-strong",
            )}
          />
        );
      })}
    </div>
  );
}

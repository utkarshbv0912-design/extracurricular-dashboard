import type { ComponentProps } from "react";

/**
 * Mascot: "Lumo" — a friendly pencil-drawn lightbulb.
 *
 * Phase 0 establishes the direction with a single inline SVG: hand-drawn
 * strokes (rounded caps, slight tilt), a warm glow, and a simple smile. No
 * animation, no AI avatar — richer art can replace this component later
 * without touching any call site.
 *
 * `mood` selects a small variation so states (empty, error, loading) can
 * reuse the same character. `className` sizes it (e.g. "h-24 w-24").
 */
export function LightbulbMascot({
  mood = "happy",
  className,
  ...props
}: {
  mood?: "happy" | "thinking" | "oops";
  className?: string;
} & ComponentProps<"svg">) {
  const tilt = mood === "thinking" ? -8 : -3;

  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {/* pencil-drawn glow rays */}
      <g
        stroke="var(--color-accent-glow)"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path d="M48 8v7" />
        <path d="M25 16l4 5" />
        <path d="M71 16l-4 5" />
      </g>

      {/* bulb */}
      <g transform={`rotate(${tilt} 48 46)`}>
        <circle
          cx="48"
          cy="46"
          r="24"
          fill="var(--color-accent-soft)"
          stroke="var(--color-foreground)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 5"
        />
        {/* filament smile */}
        {mood === "oops" ? (
          <path
            d="M38 54c3-4 17-4 20 0"
            stroke="var(--color-foreground)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <path
            d="M38 50c3 4 17 4 20 0"
            stroke="var(--color-foreground)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {/* eyes: closed and content (happy/oops), open when thinking */}
        {mood === "thinking" ? (
          <>
            <circle cx="41" cy="43" r="2" fill="var(--color-foreground)" />
            <circle cx="55" cy="43" r="2" fill="var(--color-foreground)" />
          </>
        ) : (
          <g
            stroke="var(--color-foreground)"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M38 43h5" />
            <path d="M53 43h5" />
          </g>
        )}
        {/* base */}
        <path
          d="M41 70h14M42 76h12"
          stroke="var(--color-foreground)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

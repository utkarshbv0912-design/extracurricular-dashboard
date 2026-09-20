const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
} as const;

/**
 * Spinner: the single loading indicator. Size variants keep it consistent
 * between full-page loading states and inline waits.
 */
export function Spinner({
  size = "md",
  label = "Loading",
}: {
  size?: keyof typeof sizes;
  label?: string;
}) {
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label}
      className={
        "inline-block animate-spin rounded-full border-accent-soft border-t-accent " +
        sizes[size]
      }
    />
  );
}

/**
 * Formatting helpers shared across screens. Kept dependency-free and
 * deterministic (no "today" drift inside rendering logic beyond the real
 * current date) so tests and SSR stay stable.
 */

const dateFmt = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso + "T00:00:00"));
}

/** Days from today until the date (negative = past). */
export function daysUntil(iso: string): number {
  const target = new Date(iso + "T00:00:00");
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

/**
 * Deadline phrasing per the UX plan's calm tone: neutral, relative, never
 * countdown-timer or urgency-styled. Past dates are stated neutrally.
 */
export function deadlinePhrase(iso: string): string {
  const d = daysUntil(iso);
  if (d < 0) return `Closed ${formatDate(iso)}`;
  if (d === 0) return "Closes today";
  if (d === 1) return "Closes tomorrow";
  if (d <= 14) return `Closes in ${d} days`;
  return `Closes ${formatDate(iso)}`;
}

export function hoursLabel(hours: number): string {
  return hours === 1 ? "1 hour" : `${hours.toLocaleString("en")} hours`;
}

export function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

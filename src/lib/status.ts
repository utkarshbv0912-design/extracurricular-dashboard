import type { ApplicationStatus } from "@/lib/taxonomy";

/** Human labels for application statuses (snake_case → friendly text). */
export function statusLabel(status: ApplicationStatus): string {
  switch (status) {
    case "in_progress":
      return "In progress";
    case "planned":
      return "Planned";
    case "submitted":
      return "Submitted";
    case "accepted":
      return "Accepted";
    case "rejected":
      return "Rejected";
    case "withdrawn":
      return "Withdrawn";
  }
}

/**
 * Badge variants per status — calm and colorblind-safe (text always carries
 * the meaning; color never encodes it alone). No alarm styling for
 * `rejected` per the mascot/tone rules.
 */
export function statusVariant(
  status: ApplicationStatus,
): "neutral" | "accent" | "outline" | "success" | "warning" | "danger" {
  switch (status) {
    case "planned":
      return "neutral";
    case "in_progress":
      return "accent";
    case "submitted":
      return "outline";
    case "accepted":
      return "success";
    case "rejected":
      return "danger";
    case "withdrawn":
      return "warning";
  }
}

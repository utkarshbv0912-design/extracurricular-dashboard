/**
 * The controlled shared category taxonomy (locked decision, DATABASE_PLAN.md).
 *
 * One list, used conceptually across profiles.interests (0+ values),
 * activities.category (exactly one), and opportunities.category (exactly
 * one). The validation layer owns this list; students select from it —
 * they never create arbitrary categories. `Other` absorbs edge cases.
 */
export const CATEGORIES = [
  "Sports",
  "Music",
  "Arts & Design",
  "Technology",
  "Science",
  "Business & Entrepreneurship",
  "Community Service",
  "Leadership",
  "Writing & Media",
  "Academic",
  "Debate & Public Speaking",
  "Environment",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Coarse grade bands — the only "age-adjacent" datum, by design. */
export const GRADE_BANDS = ["9", "10", "11", "12", "Other"] as const;
export type GradeBand = (typeof GRADE_BANDS)[number];

/** Application status values (locked, includes `withdrawn`). */
export const APPLICATION_STATUSES = [
  "planned",
  "in_progress",
  "submitted",
  "accepted",
  "rejected",
  "withdrawn",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/** UI-controlled sensible transitions (DB does not enforce sequencing). */
export const STATUS_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  planned: ["in_progress", "submitted", "withdrawn"],
  in_progress: ["submitted", "withdrawn"],
  submitted: ["accepted", "rejected", "withdrawn", "in_progress"],
  accepted: [],
  rejected: [],
  withdrawn: [],
};

export const TERMINAL_STATUSES: ApplicationStatus[] = [
  "accepted",
  "rejected",
  "withdrawn",
];

/** Opportunity lifecycle (admin-controlled). */
export const OPPORTUNITY_STATUSES = ["draft", "published", "archived"] as const;
export type OpportunityStatus = (typeof OPPORTUNITY_STATUSES)[number];

export function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

export function isApplicationStatus(value: string): value is ApplicationStatus {
  return (APPLICATION_STATUSES as readonly string[]).includes(value);
}

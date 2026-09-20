/** Achievement levels and display order (DATABASE_PLAN.md). */
export const LEVEL_ORDER = [
  "school",
  "regional",
  "national",
  "international",
] as const;

export type AchievementLevel = (typeof LEVEL_ORDER)[number];

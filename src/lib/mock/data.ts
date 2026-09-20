/**
 * Frontend-only mock data for Phase 1 UI development. Field names mirror
 * DATABASE_PLAN.md exactly, so the swap to server components + Supabase
 * queries is mechanical: replace these imports with src/lib/data/* calls.
 * No backend behavior is implemented or implied.
 */

import type {
  ApplicationStatus,
  Category,
  GradeBand,
  OpportunityStatus,
} from "@/lib/taxonomy";

export type MockProfile = {
  id: string;
  display_name: string;
  grade_level: GradeBand;
  interests: Category[];
  preferences: {
    opportunity_types: string[];
    deadline_window_days: number | "any";
  };
};

export type MockOpportunity = {
  id: string;
  title: string;
  organization: string;
  description: string;
  category: Category;
  eligibility: string;
  min_grade_level: GradeBand | null;
  max_grade_level: GradeBand | null;
  deadline: string;
  link: string;
  status: OpportunityStatus;
  created_at: string;
  updated_at: string;
};

export type MockApplication = {
  id: string;
  user_id: string;
  opportunity_id: string | null;
  /** Title shown when opportunity_id is null (off-catalog tracking). */
  off_catalog_title: string | null;
  status: ApplicationStatus;
  deadline: string;
  notes: string;
  created_at: string;
};

export type MockActivity = {
  id: string;
  user_id: string;
  title: string;
  category: Category;
  description: string;
  started_on: string;
  ended_on: string | null;
  hours: number;
  created_at: string;
};

export type MockAchievement = {
  id: string;
  user_id: string;
  activity_id: string | null;
  title: string;
  level: "school" | "regional" | "national" | "international";
  awarded_on: string;
  description: string;
  created_at: string;
};

export type MockReport = {
  id: string;
  opportunity_id: string;
  reported_by: string;
  reason: "inaccurate" | "expired" | "inappropriate" | "other";
  details: string;
  status: "open" | "resolved";
  created_at: string;
};

/** The signed-in demo student. */
export const mockProfile: MockProfile = {
  id: "u-student-1",
  display_name: "Maya",
  grade_level: "10",
  interests: ["Music", "Technology", "Community Service"],
  preferences: {
    opportunity_types: ["Competitions", "Programs", "Internships"],
    deadline_window_days: 14,
  },
};

export const mockOpportunities: MockOpportunity[] = [
  {
    id: "o-1",
    title: "National Youth Code Challenge",
    organization: "FutureCoders Foundation",
    description:
      "A 48-hour national coding challenge for high school students. Teams of up to four build a project that helps their local community, with mentor feedback rounds and a national showcase. No prior competition experience required — beginners are welcome and mentored.",
    category: "Technology",
    eligibility:
      "Open to students in grades 9–12 nationwide. Teams and individuals welcome; free registration.",
    min_grade_level: "9",
    max_grade_level: "12",
    deadline: "2026-10-15",
    link: "https://example.org/youth-code-challenge",
    status: "published",
    created_at: "2026-08-01",
    updated_at: "2026-09-01",
  },
  {
    id: "o-2",
    title: "Regional Youth Orchestra — Autumn Intake",
    organization: "City Music Trust",
    description:
      "Auditions for the regional youth orchestra's autumn season. Weekly rehearsals, three public concerts per season, and sectionals with professional players. Woodwind, brass, strings, and percussion seats available.",
    category: "Music",
    eligibility:
      "Grades 8–12. Audition video required (two contrasting pieces). Need-based travel support available.",
    min_grade_level: "9",
    max_grade_level: "12",
    deadline: "2026-09-28",
    link: "https://example.org/youth-orchestra",
    status: "published",
    created_at: "2026-08-05",
    updated_at: "2026-08-20",
  },
  {
    id: "o-3",
    title: "Community Summer Service Grants",
    organization: "Neighborhood Impact Collective",
    description:
      "Small grants (up to $500) for student-led community service projects — food drives, tutoring circles, park cleanups, accessibility projects. Apply with a one-page plan and a teacher or mentor reference.",
    category: "Community Service",
    eligibility:
      "Grades 9–12. Projects must be student-led and completed within six months.",
    min_grade_level: "9",
    max_grade_level: "12",
    deadline: "2026-10-02",
    link: "https://example.org/service-grants",
    status: "published",
    created_at: "2026-08-10",
    updated_at: "2026-09-05",
  },
  {
    id: "o-4",
    title: "Junior Debaters Open Cup",
    organization: "Civic Speech League",
    description:
      "One-day debate tournament with novice and open brackets. Parliamentary format, two prepared motions, and feedback ballots from experienced judges. Great first tournament for new debaters.",
    category: "Debate & Public Speaking",
    eligibility: "Grades 9–11 for the novice bracket; open bracket grades 9–12.",
    min_grade_level: "9",
    max_grade_level: "11",
    deadline: "2026-10-20",
    link: "https://example.org/open-cup",
    status: "published",
    created_at: "2026-08-12",
    updated_at: "2026-08-30",
  },
  {
    id: "o-5",
    title: "Eco-Schools Innovation Award",
    organization: "Green Futures Network",
    description:
      "Annual award for student projects that reduce waste or energy use at school or in the neighborhood. Submit a project journal, photos, and a short reflection. Winning projects are featured nationally.",
    category: "Environment",
    eligibility: "Grades 9–12, individual or team entries.",
    min_grade_level: "9",
    max_grade_level: "12",
    deadline: "2026-11-14",
    link: "https://example.org/eco-award",
    status: "published",
    created_at: "2026-08-15",
    updated_at: "2026-09-10",
  },
  {
    id: "o-6",
    title: "Student Journalism Fellowship",
    organization: "The Campus Wire",
    description:
      "A semester-long fellowship pairing student writers with professional editors. Pitch and publish four reported pieces on school-life topics. Stipend included; fully remote.",
    category: "Writing & Media",
    eligibility: "Grades 10–12. Two writing samples required.",
    min_grade_level: "10",
    max_grade_level: "12",
    deadline: "2026-10-08",
    link: "https://example.org/journalism-fellowship",
    status: "published",
    created_at: "2026-08-18",
    updated_at: "2026-09-12",
  },
  {
    id: "o-7",
    title: "Startup Ideas Bootcamp",
    organization: "Young Founders Guild",
    description:
      "Weekend bootcamp on turning ideas into plans: customer interviews, simple finance models, and a friendly pitch night. No product required — curiosity is enough.",
    category: "Business & Entrepreneurship",
    eligibility: "Grades 9–12; no prior business experience needed.",
    min_grade_level: "9",
    max_grade_level: "12",
    deadline: "2026-10-30",
    link: "https://example.org/bootcamp",
    status: "published",
    created_at: "2026-08-20",
    updated_at: "2026-09-01",
  },
  {
    id: "o-8",
    title: "AI Safety Essay Prize",
    organization: "Rationality Forum",
    description:
      "Essay prize on questions in AI safety for young writers. 1,500–3,000 words; judged by researchers; feedback provided to every entrant.",
    category: "Academic",
    eligibility: "Grades 10–12 worldwide.",
    min_grade_level: "10",
    max_grade_level: "12",
    deadline: "2026-12-01",
    link: "https://example.org/essay-prize",
    status: "published",
    created_at: "2026-08-22",
    updated_at: "2026-09-02",
  },
  {
    id: "o-9",
    title: "Summer Science Research Placement",
    organization: "Institute for Young Scientists",
    description:
      "Six-week summer research placements in university labs for students who have completed grade 10. Includes a stipend and a poster session at the end.",
    category: "Science",
    eligibility:
      "Currently in grades 10–11; strong science coursework; one teacher recommendation.",
    min_grade_level: "10",
    max_grade_level: "11",
    deadline: "2026-10-25",
    link: "https://example.org/research-placement",
    status: "published",
    created_at: "2026-08-25",
    updated_at: "2026-09-08",
  },
  {
    id: "o-10",
    title: "Community Mural Project — Lead Artists",
    organization: "Arts Alliance",
    description:
      "Student lead artists will design and paint a neighborhood mural with mentorship from professional muralists. Materials funded; portfolio review for lead roles.",
    category: "Arts & Design",
    eligibility: "Grades 9–12; portfolio encouraged but not required for crew roles.",
    min_grade_level: "9",
    max_grade_level: "12",
    deadline: "2026-09-20",
    link: "https://example.org/mural-project",
    status: "published",
    created_at: "2026-08-28",
    updated_at: "2026-09-14",
  },
  {
    id: "o-11",
    title: "Peer Leadership Council",
    organization: "Student Life Office",
    description:
      "Year-long council that plans school community events and mentors younger students. Monthly commitment; application includes two short reflection questions.",
    category: "Leadership",
    eligibility: "Grades 10–12 for the 2026–27 council year.",
    min_grade_level: "10",
    max_grade_level: "12",
    deadline: "2026-10-12",
    link: "https://example.org/leadership-council",
    status: "published",
    created_at: "2026-09-01",
    updated_at: "2026-09-10",
  },
  {
    id: "o-12",
    title: "Regional Robotics League — Season Signups",
    organization: "Tech Meetup Coalition",
    description:
      "Team signups for the regional robotics season. Build nights twice weekly, three tournaments, and mentor support. All experience levels; no cost to join.",
    category: "Sports",
    eligibility: "Grades 9–12. Teams of 6–10.",
    min_grade_level: "9",
    max_grade_level: "12",
    deadline: "2026-11-01",
    link: "https://example.org/robotics-league",
    status: "published",
    created_at: "2026-09-02",
    updated_at: "2026-09-12",
  },
  // Admin-only rows (draft/archived) — must never appear in student views.
  {
    id: "o-d1",
    title: "Hackathon Prep Series (draft)",
    organization: "FutureCoders Foundation",
    description: "Draft listing — not yet published.",
    category: "Technology",
    eligibility: "TBD",
    min_grade_level: null,
    max_grade_level: null,
    deadline: "2026-11-20",
    link: "https://example.org/draft",
    status: "draft",
    created_at: "2026-09-10",
    updated_at: "2026-09-10",
  },
  {
    id: "o-a1",
    title: "Winter Music Masterclass (archived)",
    organization: "City Music Trust",
    description: "Archived listing from last season — kept for history.",
    category: "Music",
    eligibility: "Grades 9–12.",
    min_grade_level: null,
    max_grade_level: null,
    deadline: "2025-12-01",
    link: "https://example.org/archived",
    status: "archived",
    created_at: "2025-09-01",
    updated_at: "2025-12-01",
  },
];

export const mockActivities: MockActivity[] = [
  {
    id: "a-1",
    user_id: "u-student-1",
    title: "School Jazz Band — Alto Sax",
    category: "Music",
    description:
      "Weekly rehearsals and monthly performances; section lead since spring.",
    started_on: "2025-09-01",
    ended_on: null,
    hours: 96,
    created_at: "2025-09-02",
  },
  {
    id: "a-2",
    user_id: "u-student-1",
    title: "Library Coding Club",
    category: "Technology",
    description:
      "Help run the weekly club for younger students; built the club website.",
    started_on: "2026-02-01",
    ended_on: null,
    hours: 44,
    created_at: "2026-02-02",
  },
  {
    id: "a-3",
    user_id: "u-student-1",
    title: "Food Bank Volunteering",
    category: "Community Service",
    description: "Saturday morning sorting and distribution shifts.",
    started_on: "2025-10-05",
    ended_on: "2026-05-16",
    hours: 62,
    created_at: "2025-10-06",
  },
];

export const mockAchievements: MockAchievement[] = [
  {
    id: "ach-1",
    user_id: "u-student-1",
    activity_id: "a-1",
    title: "Regional Jazz Ensemble — Selected",
    level: "regional",
    awarded_on: "2026-05-20",
    description: "One of four altos selected from the regional audition.",
    created_at: "2026-05-21",
  },
  {
    id: "ach-2",
    user_id: "u-student-1",
    activity_id: "a-2",
    title: "Coding Club — Best Project Showcase",
    level: "school",
    awarded_on: "2026-06-10",
    description: "Club website won the end-of-year showcase vote.",
    created_at: "2026-06-11",
  },
  {
    id: "ach-3",
    user_id: "u-student-1",
    activity_id: null,
    title: "City Essay Contest — Third Place",
    level: "national",
    awarded_on: "2026-03-02",
    description: "Essay on local history, awarded city-wide.",
    created_at: "2026-03-03",
  },
];

export const mockApplications: MockApplication[] = [
  {
    id: "app-1",
    user_id: "u-student-1",
    opportunity_id: "o-2",
    off_catalog_title: null,
    status: "in_progress",
    deadline: "2026-09-28",
    notes: "Record two contrasting pieces; ask Ms. Rivera for the practice room.",
    created_at: "2026-09-05",
  },
  {
    id: "app-2",
    user_id: "u-student-1",
    opportunity_id: "o-1",
    off_catalog_title: null,
    status: "planned",
    deadline: "2026-10-15",
    notes: "Ask Dev and Priya about forming a team.",
    created_at: "2026-09-08",
  },
  {
    id: "app-3",
    user_id: "u-student-1",
    opportunity_id: "o-3",
    off_catalog_title: null,
    status: "submitted",
    deadline: "2026-10-02",
    notes: "Submitted the tutoring-circle plan on Sept 12.",
    created_at: "2026-09-10",
  },
  {
    id: "app-4",
    user_id: "u-student-1",
    opportunity_id: "o-8",
    off_catalog_title: null,
    status: "accepted",
    deadline: "2026-09-30",
    notes: "Accepted! Confirm the mentor call.",
    created_at: "2026-08-30",
  },
  {
    id: "app-5",
    user_id: "u-student-1",
    opportunity_id: null,
    off_catalog_title: "Math Circle Regional Round",
    status: "in_progress",
    deadline: "2026-10-05",
    notes: "Not in the catalog — track directly on their site.",
    created_at: "2026-09-12",
  },
  {
    id: "app-6",
    user_id: "u-student-1",
    opportunity_id: "o-2",
    off_catalog_title: null,
    status: "withdrawn",
    deadline: "2026-09-20",
    notes: "Last year's cycle — withdrew before auditions.",
    created_at: "2026-08-20",
  },
];

export const mockReports: MockReport[] = [
  {
    id: "r-1",
    opportunity_id: "o-10",
    reported_by: "u-student-2",
    reason: "expired",
    details: "The mural project page says the deadline passed last week.",
    status: "open",
    created_at: "2026-09-13",
  },
  {
    id: "r-2",
    opportunity_id: "o-7",
    reported_by: "u-student-3",
    reason: "inaccurate",
    details: "The link goes to a generic homepage, not the bootcamp signup.",
    status: "open",
    created_at: "2026-09-14",
  },
  {
    id: "r-3",
    opportunity_id: "o-5",
    reported_by: "u-student-1",
    reason: "other",
    details: "Asked whether team entries count — resolved via email.",
    status: "resolved",
    created_at: "2026-09-01",
  },
];

/** Saved opportunity ids for the demo student. */
export const mockSavedIds = ["o-4", "o-6", "o-9"];

import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Fade } from "@/components/ui/fade";
import { deadlinePhrase, hoursLabel } from "@/lib/format";
import {
  mockActivities,
  mockAchievements,
  mockApplications,
  mockOpportunities,
  mockProfile,
  mockSavedIds,
} from "@/lib/mock/data";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

/**
 * Dashboard (PHASE_1_UX_PLAN.md §5) — "next action first". Currently
 * rendered from mock data; each section already handles its empty state so
 * the swap to server-fetched data is mechanical.
 */

export const metadata = {
  title: "Dashboard | Extracurricular Dashboard",
};

const quickActions = [
  { href: "/activities/new", label: "Add activity" },
  { href: "/achievements/new", label: "Add achievement" },
  { href: "/applications/new", label: "Track application" },
  { href: "/opportunities", label: "Find opportunities" },
];

export default function DashboardPage() {
  const profile = mockProfile;

  // Derived mock views (replaced by data-access queries in the backend phase).
  const activeApps = mockApplications.filter(
    (app) => app.status === "planned" || app.status === "in_progress",
  );
  const upcoming = [...activeApps].sort((a, b) =>
    a.deadline.localeCompare(b.deadline),
  );
  const nextAction = upcoming[0];
  const nextActionTitle = nextAction
    ? nextAction.off_catalog_title ??
      mockOpportunities.find((o) => o.id === nextAction.opportunity_id)?.title
    : null;

  // Rule-based mock recommendations: interest/category overlap, explainable.
  const recommended = mockOpportunities
    .filter((o) => o.status === "published")
    .filter((o) => profile.interests.includes(o.category))
    .slice(0, 3)
    .map((o) => ({
      ...o,
      reason: `Matches your interest: ${o.category}`,
    }));

  const saved = mockSavedIds
    .map((id) => mockOpportunities.find((o) => o.id === id))
    .filter((o): o is NonNullable<typeof o> => !!o)
    .slice(0, 3);

  const recentActivities = [...mockActivities]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 3);

  const achievementsByLevel = mockAchievements.reduce<Record<string, number>>(
    (acc, achievement) => {
      acc[achievement.level] = (acc[achievement.level] ?? 0) + 1;
      return acc;
    },
    {},
  );

  // First-use state: nothing tracked anywhere yet.
  const firstUse =
    mockActivities.length === 0 &&
    mockAchievements.length === 0 &&
    mockApplications.length === 0;

  const statusLabel = nextAction
    ? `${upcoming.length} deadline${upcoming.length === 1 ? "" : "s"} in progress`
    : "You're all caught up";

  return (
    <Container className="flex-1 py-8">
      {/* Welcome area */}
      <header className="mb-6">
        <h1 className="font-drawn text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Hi, {profile.display_name}
        </h1>
        <p className="mt-1 text-sm text-body">{statusLabel}.</p>
      </header>

      {firstUse ? (
        <Card className="mb-6">
          <CardBody className="flex items-start gap-4">
            <LightbulbMascot mood="thinking" className="h-14 w-14 shrink-0" />
            <div>
              <CardTitle>Welcome! Start here</CardTitle>
              <CardDescription className="mt-1">
                1. Add your first activity · 2. Add an achievement · 3. Find
                your first opportunity. This checklist disappears as you go.
              </CardDescription>
            </div>
          </CardBody>
        </Card>
      ) : null}

      {/* Next useful action strip */}
      {nextAction && nextActionTitle ? (
        <Fade>
          <Card className="mb-6 border-accent bg-accent-soft/60">
            <CardBody className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-accent-strong">
                  Next up
                </p>
                <p className="mt-0.5 font-medium text-foreground">
                  {nextActionTitle} — {deadlinePhrase(nextAction.deadline)}
                </p>
              </div>
              <ButtonLink href={`/applications/${nextAction.id}`} size="sm">
                Open <ArrowRight aria-hidden className="h-4 w-4" />
              </ButtonLink>
            </CardBody>
          </Card>
        </Fade>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Recommended opportunities */}
          <section aria-labelledby="recommended-heading">
            <div className="mb-3 flex items-center justify-between">
              <h2
                id="recommended-heading"
                className="font-drawn text-lg font-semibold text-foreground"
              >
                Recommended for you
              </h2>
              <Link
                href="/opportunities"
                className="text-sm text-accent-strong underline-offset-2 hover:underline"
              >
                See all
              </Link>
            </div>
            {recommended.length === 0 ? (
              <EmptyState
                mood="thinking"
                title="No matches yet"
                description="Add interests to your profile or browse everything in the finder."
                action={
                  <ButtonLink href="/opportunities" variant="outline" size="sm">
                    Browse opportunities
                  </ButtonLink>
                }
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {recommended.map((opportunity, i) => (
                  <Fade key={opportunity.id} index={i}>
                    <Card className="h-full">
                      <CardBody className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant="accent">{opportunity.category}</Badge>
                          <Badge variant="neutral">{opportunity.reason}</Badge>
                        </div>
                        <CardTitle className="text-base">
                          <Link
                            href={`/opportunities/${opportunity.id}`}
                            className="underline-offset-2 hover:underline"
                          >
                            {opportunity.title}
                          </Link>
                        </CardTitle>
                        <CardDescription>
                          {opportunity.organization}
                        </CardDescription>
                        <p className="mt-auto text-xs text-faint">
                          {deadlinePhrase(opportunity.deadline)}
                        </p>
                      </CardBody>
                    </Card>
                  </Fade>
                ))}
              </div>
            )}
          </section>

          {/* Upcoming deadlines */}
          <section aria-labelledby="deadlines-heading">
            <div className="mb-3 flex items-center justify-between">
              <h2
                id="deadlines-heading"
                className="font-drawn text-lg font-semibold text-foreground"
              >
                Upcoming deadlines
              </h2>
              <Link
                href="/applications"
                className="text-sm text-accent-strong underline-offset-2 hover:underline"
              >
                All applications
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <EmptyState
                title="No open deadlines"
                description="Track an application and its deadline will show up here."
                action={
                  <ButtonLink href="/applications/new" variant="outline" size="sm">
                    Track an application
                  </ButtonLink>
                }
              />
            ) : (
              <Card>
                <CardBody className="flex flex-col divide-y divide-line p-0">
                  {upcoming.map((app) => {
                    const title =
                      app.off_catalog_title ??
                      mockOpportunities.find((o) => o.id === app.opportunity_id)
                        ?.title ??
                      "Application";
                    return (
                      <Link
                        key={app.id}
                        href={`/applications/${app.id}`}
                        className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-surface-muted"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {title}
                          </p>
                          <p className="text-xs text-faint">
                            {deadlinePhrase(app.deadline)}
                          </p>
                        </div>
                        <Badge>{app.status.replace("_", " ")}</Badge>
                      </Link>
                    );
                  })}
                </CardBody>
              </Card>
            )}
          </section>

          {/* Recent activities */}
          <section aria-labelledby="recent-activities-heading">
            <div className="mb-3 flex items-center justify-between">
              <h2
                id="recent-activities-heading"
                className="font-drawn text-lg font-semibold text-foreground"
              >
                Recent activities
              </h2>
              <Link
                href="/activities"
                className="text-sm text-accent-strong underline-offset-2 hover:underline"
              >
                All activities
              </Link>
            </div>
            {recentActivities.length === 0 ? (
              <EmptyState
                title="No activities yet"
                description="Clubs, sports, volunteering, personal projects — they all count."
                action={
                  <ButtonLink href="/activities/new" variant="outline" size="sm">
                    Add your first activity
                  </ButtonLink>
                }
              />
            ) : (
              <Card>
                <CardBody className="flex flex-col divide-y divide-line p-0">
                  {recentActivities.map((activity) => (
                    <Link
                      key={activity.id}
                      href={`/activities/${activity.id}`}
                      className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-surface-muted"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {activity.title}
                        </p>
                        <p className="text-xs text-faint">
                          {activity.category} · {hoursLabel(activity.hours)}
                        </p>
                      </div>
                      <ArrowRight
                        aria-hidden
                        className="h-4 w-4 shrink-0 text-faint"
                      />
                    </Link>
                  ))}
                </CardBody>
              </Card>
            )}
          </section>
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-6">
          {/* Saved opportunities */}
          <section aria-labelledby="saved-heading">
            <div className="mb-3 flex items-center justify-between">
              <h2
                id="saved-heading"
                className="font-drawn text-lg font-semibold text-foreground"
              >
                Saved
              </h2>
              <Link
                href="/opportunities?tab=saved"
                className="text-sm text-accent-strong underline-offset-2 hover:underline"
              >
                View all
              </Link>
            </div>
            {saved.length === 0 ? (
              <EmptyState
                title="Nothing saved yet"
                description="Bookmark opportunities to compare them later."
              />
            ) : (
              <Card>
                <CardBody className="flex flex-col gap-3">
                  {saved.map((opportunity) => (
                    <Link
                      key={opportunity.id}
                      href={`/opportunities/${opportunity.id}`}
                      className="text-sm text-foreground underline-offset-2 hover:underline"
                    >
                      {opportunity.title}
                      <span className="block text-xs text-faint">
                        {deadlinePhrase(opportunity.deadline)}
                      </span>
                    </Link>
                  ))}
                </CardBody>
              </Card>
            )}
          </section>

          {/* Achievement summary */}
          <section aria-labelledby="achievements-heading">
            <div className="mb-3 flex items-center justify-between">
              <h2
                id="achievements-heading"
                className="font-drawn text-lg font-semibold text-foreground"
              >
                Achievements
              </h2>
              <Link
                href="/achievements"
                className="text-sm text-accent-strong underline-offset-2 hover:underline"
              >
                View all
              </Link>
            </div>
            {mockAchievements.length === 0 ? (
              <EmptyState
                title="No achievements yet"
                description="Awards, certificates, results — big or small."
              />
            ) : (
              <Card>
                <CardBody className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(achievementsByLevel).map(([level, count]) => (
                      <Badge key={level} variant="accent">
                        {count} {level}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-body">
                    Latest: {mockAchievements[0].title}
                  </p>
                </CardBody>
              </Card>
            )}
          </section>

          {/* Quick actions */}
          <section aria-labelledby="quick-actions-heading">
            <h2
              id="quick-actions-heading"
              className="mb-3 font-drawn text-lg font-semibold text-foreground"
            >
              Quick actions
            </h2>
            <Card>
              <CardBody className="grid gap-2">
                {quickActions.map((action) => (
                  <ButtonLink
                    key={action.href}
                    href={action.href}
                    variant="outline"
                    size="sm"
                  >
                    <Plus aria-hidden className="h-4 w-4" />
                    {action.label}
                  </ButtonLink>
                ))}
              </CardBody>
            </Card>
          </section>
        </div>
      </div>
    </Container>
  );
}

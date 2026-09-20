import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Fade } from "@/components/ui/fade";
import { formatDate } from "@/lib/format";
import { mockAchievements } from "@/lib/mock/data";
import { LEVEL_ORDER } from "@/lib/achievement-levels";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Achievements list (PHASE_1_UX_PLAN.md §8), grouped by level.
 */
export const metadata = { title: "Achievements | Extracurricular Dashboard" };

export default function AchievementsPage() {
  const byLevel = LEVEL_ORDER.map((level) => ({
    level,
    items: mockAchievements.filter((a) => a.level === level),
  })).filter((group) => group.items.length > 0);

  return (
    <Container className="flex-1 py-8">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-drawn text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Achievements
          </h1>
          <p className="mt-1 text-sm text-body">
            Awards, certificates, and results — only you can see this.
          </p>
        </div>
        <ButtonLink href="/achievements/new" size="sm">
          Add achievement
        </ButtonLink>
      </header>

      {mockAchievements.length === 0 ? (
        <EmptyState
          title="No achievements yet"
          description="Awards, certificates, results — big or small, they all tell your story."
          action={
            <ButtonLink href="/achievements/new">
              Add your first achievement
            </ButtonLink>
          }
        />
      ) : (
        <div className="flex flex-col gap-6">
          {byLevel.map((group) => (
            <section key={group.level} aria-labelledby={`level-${group.level}`}>
              <h2
                id={`level-${group.level}`}
                className="mb-3 font-drawn text-lg font-semibold text-foreground"
              >
                {group.level.charAt(0).toUpperCase() + group.level.slice(1)}
              </h2>
              <div className="flex flex-col gap-3">
                {group.items.map((achievement, i) => (
                  <Fade key={achievement.id} index={i}>
                    <Card className="transition-shadow hover:shadow-md">
                      <CardBody className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">
                            <Link
                              href={`/achievements/${achievement.id}`}
                              className="underline-offset-2 hover:underline"
                            >
                              {achievement.title}
                            </Link>
                          </p>
                          <p className="mt-0.5 text-xs text-faint">
                            {formatDate(achievement.awarded_on)}
                            {achievement.activity_id
                              ? ` · linked to an activity`
                              : ""}
                          </p>
                        </div>
                        <ArrowRight
                          aria-hidden
                          className="h-4 w-4 shrink-0 text-faint"
                        />
                      </CardBody>
                    </Card>
                  </Fade>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </Container>
  );
}

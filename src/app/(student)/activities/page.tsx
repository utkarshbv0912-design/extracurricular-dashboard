import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Fade } from "@/components/ui/fade";
import { formatDate, hoursLabel } from "@/lib/format";
import { mockActivities } from "@/lib/mock/data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Activities list (PHASE_1_UX_PLAN.md §7): ongoing then past, recency-sorted,
 * with the empty state per the UX plan.
 */
export const metadata = { title: "Activities | Extracurricular Dashboard" };

export default function ActivitiesPage() {
  const ongoing = mockActivities.filter((a) => !a.ended_on);
  const past = mockActivities.filter((a) => a.ended_on);

  return (
    <Container className="flex-1 py-8">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-drawn text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Activities
          </h1>
          <p className="mt-1 text-sm text-body">
            What you do outside class — only you can see this.
          </p>
        </div>
        <ButtonLink href="/activities/new" size="sm">
          Add activity
        </ButtonLink>
      </header>

      {mockActivities.length === 0 ? (
        <EmptyState
          title="No activities yet"
          description="Clubs, sports, volunteering, personal projects — they all count."
          action={
            <ButtonLink href="/activities/new">Add your first activity</ButtonLink>
          }
        />
      ) : (
        <div className="flex flex-col gap-6">
          {(
            [
              ["Ongoing", ongoing],
              ["Past", past],
            ] as const
          ).map(([label, items]) =>
            items.length > 0 ? (
              <section key={label} aria-labelledby={`activities-${label}`}>
                <h2
                  id={`activities-${label}`}
                  className="mb-3 font-drawn text-lg font-semibold text-foreground"
                >
                  {label}
                </h2>
                <div className="flex flex-col gap-3">
                  {items.map((activity, i) => (
                    <Fade key={activity.id} index={i}>
                      <Card className="transition-shadow hover:shadow-md">
                        <CardBody className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-medium text-foreground">
                              <Link
                                href={`/activities/${activity.id}`}
                                className="underline-offset-2 hover:underline"
                              >
                                {activity.title}
                              </Link>
                            </p>
                            <p className="mt-0.5 text-xs text-faint">
                              {activity.category} · {hoursLabel(activity.hours)} ·
                              since {formatDate(activity.started_on)}
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
            ) : null,
          )}
        </div>
      )}
    </Container>
  );
}

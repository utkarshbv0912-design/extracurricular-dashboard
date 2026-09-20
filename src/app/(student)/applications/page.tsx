import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Fade } from "@/components/ui/fade";
import { daysUntil, deadlinePhrase } from "@/lib/format";
import { mockApplications, mockOpportunities } from "@/lib/mock/data";
import { statusLabel, statusVariant } from "@/lib/status";
import Link from "next/link";

/**
 * Applications tracker (PHASE_1_UX_PLAN.md §9). Grouped by need, then
 * submitted, then outcomes. Multiple applications for the same opportunity
 * are first-class (locked decision) — cycle rows show the status.
 */
export const metadata = { title: "Applications | Extracurricular Dashboard" };

export default function ApplicationsPage() {
  const open = mockApplications.filter(
    (app) => app.status === "planned" || app.status === "in_progress",
  );
  const submitted = mockApplications.filter(
    (app) => app.status === "submitted",
  );
  const outcomes = mockApplications.filter((app) =>
    ["accepted", "rejected", "withdrawn"].includes(app.status),
  );

  function sortByDeadline(list: typeof mockApplications) {
    return [...list].sort((a, b) => a.deadline.localeCompare(b.deadline));
  }

  function appTitle(app: (typeof mockApplications)[number]): string {
    return (
      app.off_catalog_title ??
      mockOpportunities.find((o) => o.id === app.opportunity_id)?.title ??
      "Application"
    );
  }

  return (
    <Container className="flex-1 py-8">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-drawn text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Applications
          </h1>
          <p className="mt-1 text-sm text-body">
            Deadlines and statuses — only you can see this.
          </p>
        </div>
        <ButtonLink href="/applications/new" size="sm">
          Track application
        </ButtonLink>
      </header>

      {mockApplications.length === 0 ? (
        <EmptyState
          mood="thinking"
          title="Tracking applications here keeps deadlines off your mind"
          description="Add your first one, or find an opportunity first."
          action={
            <ButtonLink href="/opportunities">Find opportunities</ButtonLink>
          }
        />
      ) : (
        <div className="flex flex-col gap-6">
          {(
            [
              ["Needs attention", sortByDeadline(open)],
              ["Submitted — awaiting outcome", submitted],
              ["Outcomes", sortByDeadline(outcomes)],
            ] as const
          ).map(([label, items]) =>
            items.length > 0 ? (
              <section key={label} aria-labelledby={`apps-${label}`}>
                <h2
                  id={`apps-${label}`}
                  className="mb-3 font-drawn text-lg font-semibold text-foreground"
                >
                  {label}
                </h2>
                <div className="flex flex-col gap-3">
                  {items.map((app, i) => {
                    const days = daysUntil(app.deadline);
                    const urgent = days <= 14 && (app.status === "planned" || app.status === "in_progress");
                    return (
                      <Fade key={app.id} index={i}>
                        <Card
                          className={
                            "transition-shadow hover:shadow-md " +
                            (urgent ? "border-accent" : "")
                          }
                        >
                          <CardBody className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-medium text-foreground">
                                <Link
                                  href={`/applications/${app.id}`}
                                  className="underline-offset-2 hover:underline"
                                >
                                  {appTitle(app)}
                                </Link>
                              </p>
                              <p className="mt-0.5 text-xs text-faint">
                                {deadlinePhrase(app.deadline)}
                                {app.opportunity_id ? "" : " · off-catalog"}
                              </p>
                            </div>
                            <Badge variant={statusVariant(app.status)}>
                              {statusLabel(app.status)}
                            </Badge>
                          </CardBody>
                        </Card>
                      </Fade>
                    );
                  })}
                </div>
              </section>
            ) : null,
          )}
        </div>
      )}
    </Container>
  );
}

import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { mockOpportunities, mockReports } from "@/lib/mock/data";
import { ArrowRight } from "lucide-react";

/**
 * Admin overview (PHASE_1_UX_PLAN.md §11): quiet counts + quick links.
 * Auth is conceptual in this phase; the server-side guard arrives with the
 * backend phase.
 */
export const metadata = { title: "Admin | Extracurricular Dashboard" };

export default function AdminOverviewPage() {
  const published = mockOpportunities.filter((o) => o.status === "published");
  const drafts = mockOpportunities.filter((o) => o.status === "draft");
  const archived = mockOpportunities.filter((o) => o.status === "archived");
  const openReports = mockReports.filter((r) => r.status === "open");

  const counts = [
    { label: "Published", value: published.length },
    { label: "Drafts", value: drafts.length },
    { label: "Archived", value: archived.length },
    { label: "Open reports", value: openReports.length },
  ];

  return (
    <Container className="flex-1 py-8">
      <header className="mb-6">
        <h1 className="font-drawn text-2xl font-semibold tracking-tight text-foreground">
          Admin overview
        </h1>
        <p className="mt-1 text-sm text-body">
          Curate the catalog and resolve reports. Frontend shell — data is
          mocked until the backend phase.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-4">
        {counts.map((count) => (
          <Card key={count.label}>
            <CardBody>
              <p className="font-drawn text-2xl font-semibold text-foreground">
                {count.value}
              </p>
              <p className="text-sm text-body">{count.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardBody className="flex flex-col gap-2">
            <CardTitle>Opportunity management</CardTitle>
            <p className="text-sm text-body">
              Create, edit, publish, and archive listings. No hard delete —
              archiving keeps history.
            </p>
            <ButtonLink
              href="/admin/opportunities"
              variant="outline"
              size="sm"
              className="mt-1 w-fit"
            >
              Manage opportunities <ArrowRight aria-hidden className="h-4 w-4" />
            </ButtonLink>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-col gap-2">
            <CardTitle>Report queue</CardTitle>
            <p className="text-sm text-body">
              {openReports.length === 0
                ? "Nothing waiting — all reports resolved."
                : `${openReports.length} open report${openReports.length === 1 ? "" : "s"} to review.`}
            </p>
            <ButtonLink
              href="/admin/reports"
              variant="outline"
              size="sm"
              className="mt-1 w-fit"
            >
              Review reports <ArrowRight aria-hidden className="h-4 w-4" />
            </ButtonLink>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}

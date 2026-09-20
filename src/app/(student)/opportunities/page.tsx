import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinderFilters } from "@/components/opportunities/finder-filters";
import {
  OpportunityCard,
} from "@/components/opportunities/opportunity-card";
import { daysUntil } from "@/lib/format";
import {
  mockApplications,
  mockOpportunities,
  mockSavedIds,
} from "@/lib/mock/data";
import Link from "next/link";

/**
 * Opportunity Finder (PHASE_1_UX_PLAN.md §6) — a server component. Filter
 * and tab state live in the URL: ?tab=saved&q=&category=&grade=&deadline=.
 * Published-only mock catalog; draft/archived rows are filtered out exactly
 * as RLS will in the backend phase.
 */
export const metadata = { title: "Opportunities | Extracurricular Dashboard" };

type Search = {
  tab?: string;
  q?: string;
  category?: string;
  grade?: string;
  deadline?: string;
};

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const tab = params.tab === "saved" ? "saved" : "browse";
  const q = params.q ?? "";
  const category = params.category ?? "all";
  const grade = params.grade ?? "all";
  const deadline = params.deadline ?? "any";

  const published = mockOpportunities.filter(
    (o) => o.status === "published",
  );
  const trackedOpportunityIds = new Set(
    mockApplications
      .map((app) => app.opportunity_id)
      .filter((id): id is string => !!id),
  );

  function filter(list: typeof published) {
    const query = q.trim().toLowerCase();
    return list.filter((o) => {
      const matchesQuery =
        !query ||
        o.title.toLowerCase().includes(query) ||
        o.organization.toLowerCase().includes(query) ||
        o.description.toLowerCase().includes(query);
      const matchesCategory = category === "all" || o.category === category;
      const matchesGrade =
        grade === "all" ||
        (!!o.min_grade_level && grade >= o.min_grade_level &&
          !!o.max_grade_level && grade <= o.max_grade_level);
      const days = daysUntil(o.deadline);
      const matchesDeadline =
        deadline === "any" || days <= Number(deadline);
      return matchesQuery && matchesCategory && matchesGrade && matchesDeadline;
    });
  }

  const browse = filter(published);
  const savedList = published.filter((o) => mockSavedIds.includes(o.id));

  const activeFilterCount =
    (q ? 1 : 0) +
    (category !== "all" ? 1 : 0) +
    (grade !== "all" ? 1 : 0) +
    (deadline !== "any" ? 1 : 0);

  return (
    <Container className="flex-1 py-8">
      <header className="mb-6">
        <h1 className="font-drawn text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Opportunities
        </h1>
        <p className="mt-1 text-sm text-body">
          Curated programs, competitions, and more — published by admins.
        </p>
      </header>

      <Tabs value={tab}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList aria-label="Opportunity views">
            <TabsTrigger value="browse" asChild>
              <Link href="/opportunities">Browse</Link>
            </TabsTrigger>
            <TabsTrigger value="saved" asChild>
              <Link href="/opportunities?tab=saved">
                Saved ({savedList.length})
              </Link>
            </TabsTrigger>
          </TabsList>
          <p aria-live="polite" className="text-sm text-faint">
            {tab === "browse"
              ? `${browse.length} opportunit${browse.length === 1 ? "y" : "ies"}`
              : `${savedList.length} saved`}
          </p>
        </div>

        <TabsContent value="browse" className="mt-4">
          <FinderFilters
            q={q}
            category={category}
            grade={grade}
            deadline={deadline}
            activeCount={activeFilterCount}
          />
          {browse.length === 0 ? (
            <EmptyState
              mood="thinking"
              title="Nothing matches these filters"
              description="Try clearing a filter, or explore the “Other” category."
              action={
                <ButtonLink href="/opportunities">Clear filters</ButtonLink>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {browse.map((opportunity, i) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  saved={mockSavedIds.includes(opportunity.id)}
                  tracked={trackedOpportunityIds.has(opportunity.id)}
                  index={i}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-4">
          {savedList.length === 0 ? (
            <EmptyState
              title="Nothing saved yet"
              description="Open an opportunity and tap Save to keep it here for later."
              action={
                <ButtonLink href="/opportunities">Browse opportunities</ButtonLink>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {savedList.map((opportunity, i) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  saved
                  tracked={trackedOpportunityIds.has(opportunity.id)}
                  index={i}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Container>
  );
}

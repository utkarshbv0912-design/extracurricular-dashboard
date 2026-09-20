"use client";

import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { mockOpportunities, mockReports } from "@/lib/mock/data";
import { useState } from "react";

/**
 * Admin reports queue (PHASE_1_UX_PLAN.md §11): open → resolve flow with
 * the plan's reason enum. Mutations stubbed until the backend phase.
 */
export default function AdminReportsPage() {
  const [filter, setFilter] = useState<"open" | "resolved" | "all">("open");
  const [items, setItems] = useState(mockReports);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filtered = items.filter((r) => filter === "all" || r.status === filter);

  async function resolve(id: string) {
    setPendingId(id);
    // Stubbed mutation; backend phase wires the server action.
    await new Promise((resolve) => setTimeout(resolve, 500));
    setItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "resolved" } : r)),
    );
    setPendingId(null);
  }

  return (
    <Container className="flex-1 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-drawn text-2xl font-semibold tracking-tight text-foreground">
            Reports
          </h1>
          <p className="mt-1 text-sm text-body">
            Student reports about opportunity listings.
          </p>
        </div>
        <Select
          aria-label="Filter reports"
          className="w-40"
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
        >
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
          <option value="all">All</option>
        </Select>
      </header>

      {filtered.length === 0 ? (
        <EmptyState
          mood="happy"
          title="Nothing waiting"
          description="All reports are resolved. New reports from students appear here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((report) => {
            const opportunity = mockOpportunities.find(
              (o) => o.id === report.opportunity_id,
            );
            return (
              <Card key={report.id}>
                <CardBody className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        report.reason === "inappropriate"
                          ? "danger"
                          : report.reason === "expired"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {report.reason}
                    </Badge>
                    <Badge variant={report.status === "open" ? "accent" : "neutral"}>
                      {report.status}
                    </Badge>
                    <span className="text-xs text-faint">
                      {report.created_at}
                    </span>
                  </div>
                  <p className="text-sm text-body">
                    <strong className="text-foreground">
                      {opportunity?.title ?? "Unknown listing"}:
                    </strong>{" "}
                    {report.details}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {opportunity ? (
                      <ButtonLink
                        href={`/admin/opportunities/${opportunity.id}`}
                        size="sm"
                        variant="outline"
                      >
                        Open listing
                      </ButtonLink>
                    ) : null}
                    {report.status === "open" ? (
                      <Button
                        size="sm"
                        onClick={() => resolve(report.id)}
                        disabled={pendingId === report.id}
                      >
                        {pendingId === report.id ? (
                          <Spinner size="sm" label="" />
                        ) : null}
                        {pendingId === report.id ? "Resolving…" : "Resolve"}
                      </Button>
                    ) : null}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
}

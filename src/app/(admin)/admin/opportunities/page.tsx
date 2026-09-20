"use client";

import { Badge } from "@/components/ui/badge";
import { ButtonLink, Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockOpportunities } from "@/lib/mock/data";
import { OPPORTUNITY_STATUSES, type OpportunityStatus } from "@/lib/taxonomy";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

/**
 * Admin opportunity management (PHASE_1_UX_PLAN.md §11): all statuses
 * visible (students see published only), status filter, search, publish/
 * archive confirmations. Mutations stubbed until the backend phase.
 */
export default function AdminOpportunitiesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | OpportunityStatus>("all");
  const [items, setItems] = useState(mockOpportunities);
  const [confirm, setConfirm] = useState<{
    id: string;
    action: "publish" | "archive";
  } | null>(null);
  const [pending, setPending] = useState(false);

  const filtered = useMemo(
    () =>
      items.filter((o) => {
        const q = query.trim().toLowerCase();
        const matchesQuery =
          !q || o.title.toLowerCase().includes(q) ||
          o.organization.toLowerCase().includes(q);
        return matchesQuery && (status === "all" || o.status === status);
      }),
    [items, query, status],
  );

  async function runStatusChange() {
    if (!confirm) return;
    setPending(true);
    // Stubbed mutation; backend phase wires the server action.
    await new Promise((resolve) => setTimeout(resolve, 500));
    setItems((prev) =>
      prev.map((o) =>
        o.id === confirm.id
          ? { ...o, status: confirm.action === "publish" ? "published" : "archived" }
          : o,
      ),
    );
    setPending(false);
    setConfirm(null);
  }

  return (
    <Container className="flex-1 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-drawn text-2xl font-semibold tracking-tight text-foreground">
            Opportunities
          </h1>
          <p className="mt-1 text-sm text-body">
            All statuses — students see published listings only.
          </p>
        </div>
        <ButtonLink href="/admin/opportunities/new" size="sm">
          New opportunity
        </ButtonLink>
      </header>

      <div className="mb-4 flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="admin-search" className="text-xs font-medium text-faint">
            Search
          </label>
          <div className="relative mt-1">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
            />
            <Input
              id="admin-search"
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Title or organization…"
              type="search"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <label htmlFor="admin-status" className="text-xs font-medium text-faint">
            Status
          </label>
          <Select
            id="admin-status"
            className="mt-1"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "all" | OpportunityStatus)
            }
          >
            <option value="all">All statuses</option>
            {OPPORTUNITY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          mood="thinking"
          title="No opportunities match"
          description="Adjust the search or status filter."
        />
      ) : (
        <Card>
          <CardBody className="p-0">
            {/* Table on desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-wide text-faint">
                    <th scope="col" className="px-4 py-3 font-medium">Title</th>
                    <th scope="col" className="px-4 py-3 font-medium">Category</th>
                    <th scope="col" className="px-4 py-3 font-medium">Deadline</th>
                    <th scope="col" className="px-4 py-3 font-medium">Status</th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtered.map((o) => (
                    <tr key={o.id} className="transition-colors hover:bg-surface-muted">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/opportunities/${o.id}`}
                          className="font-medium text-foreground underline-offset-2 hover:underline"
                        >
                          {o.title}
                        </Link>
                        <span className="block text-xs text-faint">
                          {o.organization}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-body">{o.category}</td>
                      <td className="px-4 py-3 text-body">{o.deadline}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            o.status === "published"
                              ? "success"
                              : o.status === "draft"
                                ? "warning"
                                : "neutral"
                          }
                        >
                          {o.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          {o.status === "draft" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setConfirm({ id: o.id, action: "publish" })}
                            >
                              Publish
                            </Button>
                          ) : null}
                          {o.status === "published" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setConfirm({ id: o.id, action: "archive" })}
                            >
                              Archive
                            </Button>
                          ) : null}
                          {o.status === "archived" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setConfirm({ id: o.id, action: "publish" })}
                            >
                              Republish
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards on mobile */}
            <div className="flex flex-col divide-y divide-line md:hidden">
              {filtered.map((o) => (
                <div key={o.id} className="flex flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/admin/opportunities/${o.id}`}
                        className="font-medium text-foreground underline-offset-2 hover:underline"
                      >
                        {o.title}
                      </Link>
                      <p className="text-xs text-faint">{o.organization}</p>
                    </div>
                    <Badge
                      variant={
                        o.status === "published"
                          ? "success"
                          : o.status === "draft"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {o.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-body">
                    {o.category} · deadline {o.deadline}
                  </p>
                  <div className="flex gap-2">
                    <ButtonLink
                      href={`/admin/opportunities/${o.id}`}
                      size="sm"
                      variant="outline"
                    >
                      Edit
                    </ButtonLink>
                    {o.status !== "archived" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setConfirm({ id: o.id, action: "archive" })
                        }
                      >
                        Archive
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Publish/archive confirmation */}
      <Dialog open={!!confirm} onOpenChange={(open) => !open && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirm?.action === "publish" ? "Publish listing" : "Archive listing"}
            </DialogTitle>
            <DialogDescription>
              {confirm?.action === "publish"
                ? "Students will see this listing in the finder."
                : "Students will no longer see this; existing saves and applications keep their records."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button onClick={runStatusChange} disabled={pending}>
              {pending ? "Working…" : confirm?.action === "publish" ? "Publish" : "Archive"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

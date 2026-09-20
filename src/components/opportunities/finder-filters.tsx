"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CATEGORIES, GRADE_BANDS } from "@/lib/taxonomy";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * FinderFilters: client-side search + filter bar. Filter state lives in the
 * URL (?q=&category=&grade=&deadline=) so results are shareable and the
 * back button works; the server renders the filtered grid.
 */

const DEADLINE_OPTIONS = [
  { value: "any", label: "Any time" },
  { value: "7", label: "This week" },
  { value: "14", label: "Next 14 days" },
  { value: "30", label: "Next 30 days" },
] as const;

export function FinderFilters({
  q,
  category,
  grade,
  deadline,
  activeCount,
}: {
  q: string;
  category: string;
  grade: string;
  deadline: string;
  activeCount: number;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(q);
  // Note: the input intentionally does not re-sync from the URL on
  // back/forward navigation in this phase; new mounts read the URL.
  function navigateWith(key: string, value: string) {
    const params = new URLSearchParams();
    if (key === "q" ? value : q) params.set("q", key === "q" ? value : q);
    if (key === "category" ? value : category !== "all")
      params.set("category", key === "category" ? value : category);
    if (key === "grade" ? value : grade !== "all")
      params.set("grade", key === "grade" ? value : grade);
    if (key === "deadline" ? value : deadline !== "any")
      params.set("deadline", key === "deadline" ? value : deadline);
    const qs = params.toString();
    router.push(qs ? `/opportunities?${qs}` : "/opportunities");
  }

  function submitQuery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigateWith("q", query);
  }

  function clearAll() {
    router.push("/opportunities");
  }

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-lg border border-line bg-surface p-4">
      <form onSubmit={submitQuery} className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
        />
        <Input
          aria-label="Search opportunities"
          type="search"
          className="pl-9 pr-9"
          placeholder="Search title, organization, description…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => navigateWith("q", "")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-faint hover:text-foreground"
          >
            <X aria-hidden className="h-4 w-4" />
          </button>
        ) : null}
      </form>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="filter-category" className="text-xs font-medium text-faint">
            Category
          </label>
          <Select
            id="filter-category"
            value={category}
            onChange={(event) => navigateWith("category", event.target.value)}
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="filter-grade" className="text-xs font-medium text-faint">
            Grade band
          </label>
          <Select
            id="filter-grade"
            value={grade}
            onChange={(event) => navigateWith("grade", event.target.value)}
          >
            <option value="all">All grades</option>
            {GRADE_BANDS.filter((b) => b !== "Other").map((b) => (
              <option value={b} key={b}>
                Grade {b}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="filter-deadline" className="text-xs font-medium text-faint">
            Deadline
          </label>
          <Select
            id="filter-deadline"
            value={deadline}
            onChange={(event) => navigateWith("deadline", event.target.value)}
          >
            {DEADLINE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p aria-live="polite" className="text-xs text-faint">
          {activeCount > 0
            ? `${activeCount} active filter${activeCount === 1 ? "" : "s"}`
            : "No filters applied"}
        </p>
        {activeCount > 0 ? (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <X aria-hidden className="h-4 w-4" /> Clear filters
          </Button>
        ) : null}
      </div>
    </div>
  );
}

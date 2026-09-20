"use client";

import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, GRADE_BANDS, OPPORTUNITY_STATUSES, type Category, type OpportunityStatus } from "@/lib/taxonomy";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * AdminOpportunityForm: fields exactly per DATABASE_PLAN.md — title,
 * organization, description, category (taxonomy), eligibility, min/max
 * grade band, deadline, link, status. Mutations stubbed until backend.
 */
export function AdminOpportunityForm({
  initial,
}: {
  initial?: {
    title: string;
    organization: string;
    description: string;
    category: Category;
    eligibility: string;
    min_grade_level: string;
    max_grade_level: string;
    deadline: string;
    link: string;
    status: OpportunityStatus;
  };
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextErrors: Record<string, string> = {};
    if (!String(form.get("title") ?? "").trim()) {
      nextErrors.title = "Every listing needs a title.";
    }
    const link = String(form.get("link") ?? "").trim();
    if (!/^https?:\/\/.+/.test(link)) {
      nextErrors.link = "Enter a full URL starting with https://";
    }
    if (!form.get("deadline")) {
      nextErrors.deadline = "Pick the application deadline.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setPending(false);
    router.push("/admin/opportunities");
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Title *
            </label>
            <Input
              id="title"
              name="title"
              defaultValue={initial?.title}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "admin-title-error" : undefined}
            />
            {errors.title ? (
              <p id="admin-title-error" role="alert" className="text-sm text-danger">
                {errors.title}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="organization" className="text-sm font-medium text-foreground">
                Organization
              </label>
              <Input id="organization" name="organization" defaultValue={initial?.organization} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-sm font-medium text-foreground">
                Category
              </label>
              <Select id="category" name="category" defaultValue={initial?.category}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={initial?.description}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="eligibility" className="text-sm font-medium text-foreground">
              Eligibility (free text students will read)
            </label>
            <Textarea
              id="eligibility"
              name="eligibility"
              defaultValue={initial?.eligibility}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="min_grade_level" className="text-sm font-medium text-foreground">
                Min grade
              </label>
              <Select id="min_grade_level" name="min_grade_level" defaultValue={initial?.min_grade_level}>
                <option value="">None</option>
                {GRADE_BANDS.filter((b) => b !== "Other").map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="max_grade_level" className="text-sm font-medium text-foreground">
                Max grade
              </label>
              <Select id="max_grade_level" name="max_grade_level" defaultValue={initial?.max_grade_level}>
                <option value="">None</option>
                {GRADE_BANDS.filter((b) => b !== "Other").map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="deadline" className="text-sm font-medium text-foreground">
                Deadline *
              </label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                defaultValue={initial?.deadline}
                aria-invalid={!!errors.deadline}
                aria-describedby={errors.deadline ? "admin-deadline-error" : undefined}
              />
              {errors.deadline ? (
                <p id="admin-deadline-error" role="alert" className="text-sm text-danger">
                  {errors.deadline}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="link" className="text-sm font-medium text-foreground">
                External link *
              </label>
              <Input
                id="link"
                name="link"
                type="url"
                placeholder="https://…"
                defaultValue={initial?.link}
                aria-invalid={!!errors.link}
                aria-describedby={errors.link ? "admin-link-error" : undefined}
              />
              {errors.link ? (
                <p id="admin-link-error" role="alert" className="text-sm text-danger">
                  {errors.link}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-sm font-medium text-foreground">
                Status
              </label>
              <Select id="status" name="status" defaultValue={initial?.status ?? "draft"}>
                {OPPORTUNITY_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={pending}>
            {pending ? <Spinner size="sm" label="" /> : null}
            {pending ? "Saving…" : initial ? "Save changes" : "Create listing"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

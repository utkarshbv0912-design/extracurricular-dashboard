"use client";

import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, type Category } from "@/lib/taxonomy";

/**
 * ActivityForm: shared by create and edit (fields exactly per
 * DATABASE_PLAN.md: title, category, description, started_on, ended_on,
 * hours). Client-side validation is UX only — server validation arrives
 * with the backend phase.
 */
export function ActivityForm({
  initial,
}: {
  initial?: {
    title: string;
    category: Category;
    description: string;
    started_on: string;
    ended_on: string;
    hours: string;
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
      nextErrors.title = "Give this activity a name.";
    }
    if (!form.get("category")) {
      nextErrors.category = "Pick the closest category.";
    }
    if (!form.get("started_on")) {
      nextErrors.started_on = "When did it start?";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    // Stubbed mutation; the backend phase wires a server action + toast.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setPending(false);
    router.push("/activities");
  }

  return (
    <Card>
      <CardBody>
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Name of the activity *
            </label>
            <Input
              id="title"
              name="title"
              defaultValue={initial?.title}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title ? (
              <p id="title-error" role="alert" className="text-sm text-danger">
                {errors.title}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-sm font-medium text-foreground">
                Category *
              </label>
              <Select
                id="category"
                name="category"
                defaultValue={initial?.category}
                aria-invalid={!!errors.category}
                aria-describedby={errors.category ? "category-error" : undefined}
              >
                <option value="" disabled>
                  Choose a category…
                </option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
              {errors.category ? (
                <p id="category-error" role="alert" className="text-sm text-danger">
                  {errors.category}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="hours" className="text-sm font-medium text-foreground">
                Hours so far
              </label>
              <Input
                id="hours"
                name="hours"
                type="number"
                min="0"
                step="0.5"
                defaultValue={initial?.hours}
                placeholder="e.g. 2.5"
              />
              <p className="text-xs text-faint">Self-reported — decimals fine.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="started_on"
                className="text-sm font-medium text-foreground"
              >
                Started on *
              </label>
              <Input
                id="started_on"
                name="started_on"
                type="date"
                defaultValue={initial?.started_on}
                aria-invalid={!!errors.started_on}
                aria-describedby={errors.started_on ? "started-error" : undefined}
              />
              {errors.started_on ? (
                <p id="started-error" role="alert" className="text-sm text-danger">
                  {errors.started_on}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ended_on" className="text-sm font-medium text-foreground">
                Ended on (leave empty if ongoing)
              </label>
              <Input id="ended_on" name="ended_on" type="date" defaultValue={initial?.ended_on} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="description"
              className="text-sm font-medium text-foreground"
            >
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              defaultValue={initial?.description}
              placeholder="What do you do there? What have you contributed?"
            />
          </div>

          <p className="text-xs text-faint">
            Only you can see your activities.
          </p>

          <div className="flex gap-2">
            <Button type="submit" disabled={pending}>
              {pending ? <Spinner size="sm" label="" /> : null}
              {pending ? "Saving…" : "Save activity"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

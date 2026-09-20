"use client";

import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { LEVEL_ORDER, type AchievementLevel } from "@/lib/achievement-levels";
import { mockActivities } from "@/lib/mock/data";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * AchievementForm: shared by create/edit. Fields exactly per
 * DATABASE_PLAN.md: title, level, awarded_on, description, optional
 * activity_id (limited to the student's own activities).
 */
export function AchievementForm({
  initial,
}: {
  initial?: {
    title: string;
    level: AchievementLevel;
    awarded_on: string;
    description: string;
    activity_id: string;
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
      nextErrors.title = "Name this achievement.";
    }
    if (!form.get("level")) {
      nextErrors.level = "Pick a level.";
    }
    if (!form.get("awarded_on")) {
      nextErrors.awarded_on = "When did you receive it?";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    // Stubbed mutation; backend phase wires the server action + toast.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setPending(false);
    router.push("/achievements");
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Achievement *
            </label>
            <Input
              id="title"
              name="title"
              defaultValue={initial?.title}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "ach-title-error" : undefined}
            />
            {errors.title ? (
              <p id="ach-title-error" role="alert" className="text-sm text-danger">
                {errors.title}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="level" className="text-sm font-medium text-foreground">
                Level *
              </label>
              <Select
                id="level"
                name="level"
                defaultValue={initial?.level}
                aria-invalid={!!errors.level}
                aria-describedby={errors.level ? "ach-level-error" : undefined}
              >
                <option value="" disabled>
                  Choose a level…
                </option>
                {LEVEL_ORDER.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </Select>
              {errors.level ? (
                <p id="ach-level-error" role="alert" className="text-sm text-danger">
                  {errors.level}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="awarded_on"
                className="text-sm font-medium text-foreground"
              >
                Date awarded *
              </label>
              <Input
                id="awarded_on"
                name="awarded_on"
                type="date"
                defaultValue={initial?.awarded_on}
                aria-invalid={!!errors.awarded_on}
                aria-describedby={errors.awarded_on ? "ach-date-error" : undefined}
              />
              {errors.awarded_on ? (
                <p id="ach-date-error" role="alert" className="text-sm text-danger">
                  {errors.awarded_on}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="activity_id" className="text-sm font-medium text-foreground">
              Link to an activity (optional)
            </label>
            <Select
              id="activity_id"
              name="activity_id"
              defaultValue={initial?.activity_id}
            >
              <option value="">None</option>
              {mockActivities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.title}
                </option>
              ))}
            </Select>
            <p className="text-xs text-faint">
              It helps your dashboard tell the story.
            </p>
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
              placeholder="What was it for? Who awarded it?"
            />
          </div>

          <p className="text-xs text-faint">Only you can see your achievements.</p>

          <Button type="submit" disabled={pending}>
            {pending ? <Spinner size="sm" label="" /> : null}
            {pending ? "Saving…" : "Save achievement"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

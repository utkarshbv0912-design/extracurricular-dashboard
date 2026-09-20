"use client";

import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { mockOpportunities } from "@/lib/mock/data";
import {
  APPLICATION_STATUSES,
  STATUS_TRANSITIONS,
  type ApplicationStatus,
} from "@/lib/taxonomy";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * ApplicationForm: shared by create/edit. Fields per DATABASE_PLAN.md:
 * opportunity_id (nullable — "Something else" enables off-catalog tracking),
 * status (defaults planned), deadline (editable snapshot), notes.
 * Status choices follow the UI-controlled transitions (locked decision).
 */
export function ApplicationForm({
  initial,
  presetOpportunityId,
}: {
  initial?: {
    opportunity_id: string;
    off_catalog_title: string;
    status: ApplicationStatus;
    deadline: string;
    notes: string;
  };
  presetOpportunityId?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = !!initial;
  const published = mockOpportunities.filter((o) => o.status === "published");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextErrors: Record<string, string> = {};
    const opportunityId = String(form.get("opportunity_id") ?? "");
    const offCatalog = String(form.get("off_catalog_title") ?? "").trim();
    if (!opportunityId && !offCatalog) {
      nextErrors.opportunity_id =
        "Pick an opportunity, or choose “Something else”.";
    }
    if (!form.get("deadline")) {
      nextErrors.deadline = "Add a deadline to track.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    // Stubbed mutation; backend phase wires the server action + toast.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setPending(false);
    router.push("/applications");
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="opportunity_id"
              className="text-sm font-medium text-foreground"
            >
              Opportunity *
            </label>
            <Select
              id="opportunity_id"
              name="opportunity_id"
              defaultValue={initial?.opportunity_id ?? presetOpportunityId ?? ""}
            >
              <option value="">Choose from the catalog…</option>
              {published.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title}
                </option>
              ))}
              <option value="other">Something else (not in the catalog)</option>
            </Select>
            {errors.opportunity_id ? (
              <p
                id="opportunity-error"
                role="alert"
                className="text-sm text-danger"
              >
                {errors.opportunity_id}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="off_catalog_title"
              className="text-sm font-medium text-foreground"
            >
              Off-catalog title
            </label>
            <Input
              id="off_catalog_title"
              name="off_catalog_title"
              defaultValue={initial?.off_catalog_title}
              placeholder="e.g. Math Circle Regional Round"
            />
            <p className="text-xs text-faint">
              Fill this in instead of picking an opportunity to track something
              outside the catalog.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-sm font-medium text-foreground">
                Status
              </label>
              <Select
                id="status"
                name="status"
                defaultValue={initial?.status ?? "planned"}
              >
                {(isEdit
                  ? [
                      initial.status,
                      ...STATUS_TRANSITIONS[initial.status],
                    ]
                  : APPLICATION_STATUSES.filter(
                      (s) => s === "planned",
                    )
                ).map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ")}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="deadline"
                className="text-sm font-medium text-foreground"
              >
                Deadline *
              </label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                defaultValue={initial?.deadline}
                aria-invalid={!!errors.deadline}
                aria-describedby={errors.deadline ? "deadline-error" : undefined}
              />
              {errors.deadline ? (
                <p id="deadline-error" role="alert" className="text-sm text-danger">
                  {errors.deadline}
                </p>
              ) : null}
              <p className="text-xs text-faint">
                Your own copy — the listing deadline may change.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="notes" className="text-sm font-medium text-foreground">
              Notes
            </label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={initial?.notes}
              placeholder="Reminders to yourself — materials, contacts, next steps."
            />
          </div>

          <p className="text-xs text-faint">
            Only you can see your applications and notes.
          </p>

          <Button type="submit" disabled={pending}>
            {pending ? <Spinner size="sm" label="" /> : null}
            {pending ? "Saving…" : isEdit ? "Save changes" : "Track application"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

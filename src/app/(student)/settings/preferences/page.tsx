"use client";

import { useStubbedSave } from "@/components/settings/settings-form";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { mockProfile } from "@/lib/mock/data";
import { Check } from "lucide-react";
import { useState } from "react";

/** Preferences settings: matching preferences with their current effect. */
export default function PreferencesSettingsPage() {
  const { pending, saved, save } = useStubbedSave();
  const [types, setTypes] = useState<string[]>(
    mockProfile.preferences.opportunity_types,
  );
  const [window, setWindow] = useState(
    String(mockProfile.preferences.deadline_window_days),
  );

  const OPPORTUNITY_TYPES = ["Competitions", "Programs", "Internships", "Other"];

  function toggleType(type: string) {
    setTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }

  return (
    <Card>
      <CardBody>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            save(async () => {
              await new Promise((resolve) => setTimeout(resolve, 500));
            });
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <h2 className="font-drawn text-lg font-semibold text-foreground">
              Matching preferences
            </h2>
            <p className="text-sm text-body">
              Shape what recommendations and filters emphasize.
            </p>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium text-foreground">
              Opportunity types you want
            </legend>
            <div className="flex flex-wrap gap-2">
              {OPPORTUNITY_TYPES.map((type) => {
                const checked = types.includes(type);
                return (
                  <label
                    key={type}
                    className={
                      "cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors " +
                      (checked
                        ? "border-accent bg-accent-soft text-accent-strong"
                        : "border-line-strong bg-surface text-body hover:border-accent")
                    }
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleType(type)}
                    />
                    {type}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="window" className="text-sm font-medium text-foreground">
              Deadline window
            </label>
            <Select
              id="window"
              value={window}
              onChange={(e) => setWindow(e.target.value)}
            >
              <option value="7">Only closing in 7+ days</option>
              <option value="14">Only closing in 14+ days</option>
              <option value="30">Only closing in 30+ days</option>
              <option value="any">Any deadline</option>
 </Select>
            <p className="text-xs text-faint">
              Recommendations skip opportunities closing sooner than this.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? <Spinner size="sm" label="" /> : null}
              {pending ? "Saving…" : "Save preferences"}
            </Button>
            {saved ? (
              <p
                role="status"
                className="flex items-center gap-1 text-sm text-success"
              >
                <Check aria-hidden className="h-4 w-4" /> Saved
              </p>
            ) : null}
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

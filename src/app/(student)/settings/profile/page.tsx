"use client";

import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useStubbedSave } from "@/components/settings/settings-form";
import { mockProfile } from "@/lib/mock/data";
import { CATEGORIES, GRADE_BANDS, type Category } from "@/lib/taxonomy";
import { Check } from "lucide-react";
import { useState } from "react";

/** Profile settings: exactly the onboarding fields (least-data rule). */
export default function ProfileSettingsPage() {
  const { pending, saved, save } = useStubbedSave();
  const [displayName, setDisplayName] = useState(mockProfile.display_name);
  const [gradeBand, setGradeBand] = useState<string>(mockProfile.grade_level);
  const [interests, setInterests] = useState<Category[]>(mockProfile.interests);

  function toggleInterest(category: Category) {
    setInterests((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  }

  return (
    <Card>
      <CardBody>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            save(async () => {
              // Stubbed profile update; server action arrives with backend.
              await new Promise((resolve) => setTimeout(resolve, 500));
            });
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <h2 className="font-drawn text-lg font-semibold text-foreground">
              Profile
            </h2>
            <p className="text-sm text-body">
              Only the basics — visible to you alone.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="display-name" className="text-sm font-medium text-foreground">
              Display name
            </label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="grade-band" className="text-sm font-medium text-foreground">
              Grade band
            </label>
            <Select
              id="grade-band"
              value={gradeBand}
              onChange={(e) => setGradeBand(e.target.value)}
            >
              {GRADE_BANDS.map((band) => (
                <option key={band} value={band}>
                  {band}
                </option>
              ))}
            </Select>
            <p className="text-xs text-faint">
              Used only to filter opportunities by eligibility.
            </p>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium text-foreground">
              Interests
            </legend>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const checked = interests.includes(category);
                return (
                  <label
                    key={category}
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
                      onChange={() => toggleInterest(category)}
                    />
                    {category}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? <Spinner size="sm" label="" /> : null}
              {pending ? "Saving…" : "Save profile"}
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

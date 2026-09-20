"use client";

import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { mockProfile } from "@/lib/mock/data";
import { CATEGORIES, GRADE_BANDS, type Category } from "@/lib/taxonomy";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useState } from "react";

/**
 * Onboarding (PHASE_1_UX_PLAN.md §3): display name → grade band →
 * interests → matching preferences → confirmation. Collects ONLY fields
 * approved in DATABASE_PLAN.md. The profile-creating write is stubbed —
 * server-side creation for the authenticated user arrives with the backend
 * phase (locked decision).
 */

type Step = 1 | 2 | 3 | 4 | 5;

const OPPORTUNITY_TYPES = ["Competitions", "Programs", "Internships", "Other"];

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState(mockProfile.display_name);
  const [gradeBand, setGradeBand] = useState<string>(mockProfile.grade_level);
  const [interests, setInterests] = useState<Category[]>(mockProfile.interests);
  const [opportunityTypes, setOpportunityTypes] = useState<string[]>(
    mockProfile.preferences.opportunity_types,
  );
  const [deadlineWindow, setDeadlineWindow] = useState<string>(
    String(mockProfile.preferences.deadline_window_days),
  );

  function next() {
    setError(null);
    if (step === 1 && !displayName.trim()) {
      setError("Pick a name so we can say hello.");
      return;
    }
    setStep((s) => Math.min(s + 1, 5) as Step);
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 1) as Step);
  }

  function toggleInterest(category: Category) {
    setInterests((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  }

  function toggleType(type: string) {
    setOpportunityTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type],
    );
  }

  async function finish() {
    setPending(true);
    setError(null);
    // Stub: the real flow calls a server action that creates/updates the
    // profile for the authenticated user only.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setPending(false);
    setStep(5);
  }

  return (
    <main className="flex-1">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-12">
        {step < 5 ? (
          <header className="flex items-center justify-between gap-4">
            <h1 className="font-drawn text-xl font-semibold tracking-tight text-foreground">
              Set up your profile
            </h1>
            <Progress value={step} max={5} />
          </header>
        ) : null}

        {step === 1 ? (
          <Card>
            <CardBody className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <LightbulbMascot mood="happy" className="h-12 w-12" />
                <div>
                  <h2 className="font-drawn text-lg font-semibold text-foreground">
                    Let&apos;s set up your profile
                  </h2>
                  <p className="text-sm text-body">
                    Takes about a minute — change anything later.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="display-name"
                  className="text-sm font-medium text-foreground"
                >
                  Display name
                </label>
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  autoComplete="nickname"
                  aria-invalid={!!error}
                  aria-describedby={error ? "onb-error" : undefined}
                />
                {error ? (
                  <p id="onb-error" role="alert" className="text-sm text-danger">
                    {error}
                  </p>
                ) : null}
              </div>
            </CardBody>
          </Card>
        ) : null}

        {step === 2 ? (
          <Card>
            <CardBody className="flex flex-col gap-4">
              <div>
                <h2 className="font-drawn text-lg font-semibold text-foreground">
                  What grade are you in?
                </h2>
                <p className="text-sm text-body">
                  We use this only to filter opportunities by eligibility.
                </p>
              </div>
              <fieldset className="flex flex-wrap gap-2">
                <legend className="sr-only">Grade band</legend>
                {GRADE_BANDS.map((band) => (
                  <label
                    key={band}
                    className={
                      "cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors " +
                      (gradeBand === band
                        ? "border-accent bg-accent-soft text-accent-strong"
                        : "border-line-strong bg-surface text-body hover:border-accent")
                    }
                  >
                    <input
                      type="radio"
                      name="grade-band"
                      value={band}
                      checked={gradeBand === band}
                      onChange={() => setGradeBand(band)}
                      className="sr-only"
                    />
                    {band}
                  </label>
                ))}
              </fieldset>
            </CardBody>
          </Card>
        ) : null}

        {step === 3 ? (
          <Card>
            <CardBody className="flex flex-col gap-4">
              <div>
                <h2 className="font-drawn text-lg font-semibold text-foreground">
                  What are you into?
                </h2>
                <p className="text-sm text-body">
                  Pick any that fit — we&apos;ll use these to find matching
                  opportunities. &quot;Other&quot; always fits.
                </p>
              </div>
              <fieldset className="flex flex-wrap gap-2">
                <legend className="sr-only">Interests (choose any)</legend>
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
              </fieldset>
              <p className="text-xs text-faint">
                Selected: {interests.length === 0 ? "none yet" : interests.join(", ")}
              </p>
            </CardBody>
          </Card>
        ) : null}

        {step === 4 ? (
          <Card>
            <CardBody className="flex flex-col gap-4">
              <div>
                <h2 className="font-drawn text-lg font-semibold text-foreground">
                  Matching preferences
                </h2>
                <p className="text-sm text-body">
                  Optional — defaults work fine.
                </p>
              </div>
              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm font-medium text-foreground">
                  Opportunity types you want
                </legend>
                <div className="flex flex-wrap gap-2">
                  {OPPORTUNITY_TYPES.map((type) => {
                    const checked = opportunityTypes.includes(type);
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
                <label
                  htmlFor="deadline-window"
                  className="text-sm font-medium text-foreground"
                >
                  Deadline window
                </label>
                <Select
                  id="deadline-window"
                  value={deadlineWindow}
                  onChange={(event) => setDeadlineWindow(event.target.value)}
                >
                  <option value="7">Only closing in 7+ days</option>
                  <option value="14">Only closing in 14+ days</option>
                  <option value="30">Only closing in 30+ days</option>
                  <option value="any">Any deadline</option>
                </Select>
                <p className="text-xs text-faint">
                  Changeable anytime in Settings.
                </p>
              </div>
            </CardBody>
          </Card>
        ) : null}

        {step === 5 ? (
          <Card className="text-center">
            <CardBody className="flex flex-col items-center gap-4 py-8">
              <LightbulbMascot mood="happy" className="h-24 w-24" />
              <h2 className="font-drawn text-2xl font-semibold text-foreground">
                You&apos;re set{displayName ? `, ${displayName}` : ""}!
              </h2>
              <p className="max-w-sm text-sm leading-6 text-body">
                Your profile is ready. We asked only for what we need — and
                it&apos;s visible to you alone.
              </p>
              <ButtonLink href="/dashboard" size="lg">
                Go to dashboard
              </ButtonLink>
            </CardBody>
          </Card>
        ) : null}

        {step < 5 ? (
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={back}
              disabled={step === 1 || pending}
            >
              <ArrowLeft aria-hidden className="h-4 w-4" /> Back
            </Button>
            {step < 4 ? (
              <Button onClick={next} disabled={pending}>
                Next <ArrowRight aria-hidden className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={finish} disabled={pending}>
                {pending ? (
                  <Spinner size="sm" label="" />
                ) : (
                  <Check aria-hidden className="h-4 w-4" />
                )}
                {pending ? "Saving…" : "Finish"}
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}

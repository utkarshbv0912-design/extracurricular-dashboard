import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Fade } from "@/components/ui/fade";
import { BookmarkCheck, CalendarCheck, Sparkles } from "lucide-react";

/**
 * Landing page (public) — per PHASE_1_UX_PLAN.md §1: hero, how it works,
 * benefits, CTA. Auth CTAs are stubbed targets; the catalog is never
 * previewed here (locked access model).
 */

const steps = [
  {
    title: "Build your profile",
    description:
      "Your grade band and interests — nothing more. Takes about a minute.",
  },
  {
    title: "Track what you do",
    description:
      "Log activities and achievements with hours, dates, and links.",
  },
  {
    title: "Find and track opportunities",
    description:
      "Get explainable matches and keep every deadline on schedule.",
  },
];

const benefits = [
  {
    icon: Sparkles,
    title: "Explainable matches",
    description:
      "Every recommendation tells you why it matched — your interests, your grade band, closing soon.",
  },
  {
    icon: CalendarCheck,
    title: "Deadline tracking",
    description:
      "From planned to submitted to outcome — including withdrawn — without spreadsheets.",
  },
  {
    icon: BookmarkCheck,
    title: "Your data is yours",
    description:
      "Your records are visible only to you. We don't ask for your age, address, or school.",
  },
];

export default function LandingPage() {
  return (
    <Container className="flex-1">
      {/* Hero */}
      <section className="flex flex-col items-center gap-8 py-16 text-center sm:py-24">
        <LightbulbMascot mood="happy" className="h-28 w-28" />
        <div className="max-w-2xl">
          <h1 className="font-drawn text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Keep your extracurriculars — and the opportunities they unlock —
            in one place
          </h1>
          <p className="mt-5 text-lg leading-8 text-body">
            Track activities and achievements, discover curated programs and
            competitions, and never miss a deadline. Built for students, calm
            by design.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/auth/sign-up" size="lg">
            Sign up
          </ButtonLink>
          <ButtonLink href="/auth/sign-in" variant="outline" size="lg">
            Sign in
          </ButtonLink>
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-it-works" className="py-8">
        <h2
          id="how-it-works"
          className="text-center font-drawn text-2xl font-semibold tracking-tight text-foreground"
        >
          How it works
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <Fade key={step.title} index={i}>
              <Card className="h-full">
                <CardBody>
                  <p
                    aria-hidden
                    className="font-drawn text-sm font-semibold text-accent-strong"
                  >
                    Step {i + 1}
                  </p>
                  <CardTitle className="mt-1">{step.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {step.description}
                  </CardDescription>
                </CardBody>
              </Card>
            </Fade>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section aria-labelledby="benefits" className="py-8">
        <h2
          id="benefits"
          className="text-center font-drawn text-2xl font-semibold tracking-tight text-foreground"
        >
          Why students like it
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <Fade key={benefit.title} index={i}>
                <Card className="h-full">
                  <CardBody className="flex flex-col gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
                      <Icon aria-hidden className="h-5 w-5" />
                    </span>
                    <CardTitle>{benefit.title}</CardTitle>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardBody>
                </Card>
              </Fade>
            );
          })}
        </div>
      </section>

      {/* CTA band */}
      <section
        aria-labelledby="cta"
        className="my-12 rounded-lg border border-line bg-accent-soft px-6 py-12 text-center"
      >
        <h2
          id="cta"
          className="font-drawn text-2xl font-semibold tracking-tight text-foreground"
        >
          Ready when you are
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-body">
          Set up your profile in about a minute and see what&apos;s out there.
        </p>
        <div className="mt-6">
          <ButtonLink href="/auth/sign-up" size="lg">
            Sign up
          </ButtonLink>
        </div>
      </section>
    </Container>
  );
}

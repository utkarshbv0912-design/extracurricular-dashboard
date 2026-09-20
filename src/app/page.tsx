import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardTitle, CardDescription } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

const previews = [
  {
    title: "Track activities",
    description:
      "Log clubs, sports, service, and projects with hours and dates.",
  },
  {
    title: "Collect achievements",
    description:
      "Keep awards, certificates, and results in one tidy place.",
  },
  {
    title: "Find opportunities",
    description:
      "Browse curated competitions and programs with friendly reminders.",
  },
];

export default function Home() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-10 py-16 text-center sm:py-24">
      <LightbulbMascot mood="happy" className="h-28 w-28" />

      <div className="max-w-2xl">
        <h1 className="font-drawn text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Extracurricular Dashboard
        </h1>
        <p className="mt-4 text-lg leading-8 text-body">
          A friendly home for everything you do outside class — your
          activities, achievements, and the opportunities worth chasing.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/dashboard" size="lg">
          Open your dashboard
        </ButtonLink>
        <ButtonLink href="/dashboard" variant="outline" size="lg">
          See what&apos;s coming
        </ButtonLink>
      </div>

      <div className="mt-4 grid w-full gap-4 text-left sm:grid-cols-3">
        {previews.map((item) => (
          <Card key={item.title}>
            <CardBody className="flex flex-col gap-2">
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardBody>
          </Card>
        ))}
      </div>

      <p className="text-sm text-faint">
        Phase 0 — the shell is ready; features arrive in Phase 1.
      </p>
    </Container>
  );
}

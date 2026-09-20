import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { formatDate, hoursLabel } from "@/lib/format";
import { mockActivities } from "@/lib/mock/data";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

/**
 * Activity detail (PHASE_1_UX_PLAN.md §7). Delete is stubbed — the confirm
 * dialog and mutation arrive with the backend phase.
 */
export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity = mockActivities.find((a) => a.id === id);

  if (!activity) {
    return (
      <Container className="flex-1 py-16 text-center">
        <LightbulbMascot mood="thinking" className="mx-auto h-24 w-24" />
        <h1 className="mt-4 font-drawn text-2xl font-semibold text-foreground">
          Activity not found
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-body">
          It may have been deleted, or the link is off.{" "}
          <Link
            href="/activities"
            className="text-accent-strong underline-offset-2 hover:underline"
          >
            Back to activities
          </Link>
          .
        </p>
      </Container>
    );
  }

  return (
    <Container className="flex-1 max-w-2xl py-8">
      <Link
        href="/activities"
        className="text-sm text-accent-strong underline-offset-2 hover:underline"
      >
        ← Back to activities
      </Link>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="font-drawn text-2xl">{activity.title}</CardTitle>
          <CardDescription>
            {activity.category} · {hoursLabel(activity.hours)}
          </CardDescription>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 text-sm leading-6">
          <section>
            <h2 className="font-medium text-foreground">When</h2>
            <p className="mt-1 text-body">
              {formatDate(activity.started_on)}
              {" — "}
              {activity.ended_on ? formatDate(activity.ended_on) : "ongoing"}
            </p>
          </section>
          <section>
            <h2 className="font-medium text-foreground">Description</h2>
            <p className="mt-1 text-body">
              {activity.description || "No description yet."}
            </p>
          </section>
          <p className="text-xs text-faint">Only you can see this activity.</p>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href={`/activities/${activity.id}/edit`} size="sm">
              <Pencil aria-hidden className="h-4 w-4" /> Edit
            </ButtonLink>
            <Button variant="ghost" size="sm" disabled title="Arrives with the backend phase">
              <Trash2 aria-hidden className="h-4 w-4" /> Delete
            </Button>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
}

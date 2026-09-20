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
import { formatDate } from "@/lib/format";
import { mockAchievements, mockActivities } from "@/lib/mock/data";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

/**
 * Achievement detail (PHASE_1_UX_PLAN.md §8). Delete stubbed (backend phase).
 */
export default async function AchievementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const achievement = mockAchievements.find((a) => a.id === id);

  if (!achievement) {
    return (
      <Container className="flex-1 py-16 text-center">
        <LightbulbMascot mood="thinking" className="mx-auto h-24 w-24" />
        <h1 className="mt-4 font-drawn text-2xl font-semibold text-foreground">
          Achievement not found
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-body">
          <Link
            href="/achievements"
            className="text-accent-strong underline-offset-2 hover:underline"
          >
            Back to achievements
          </Link>
          .
        </p>
      </Container>
    );
  }

  const linkedActivity = mockActivities.find(
    (a) => a.id === achievement.activity_id,
  );

  return (
    <Container className="flex-1 max-w-2xl py-8">
      <Link
        href="/achievements"
        className="text-sm text-accent-strong underline-offset-2 hover:underline"
      >
        ← Back to achievements
      </Link>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="font-drawn text-2xl">
            {achievement.title}
          </CardTitle>
          <CardDescription>
            {achievement.level.charAt(0).toUpperCase() + achievement.level.slice(1)}{" "}
            · {formatDate(achievement.awarded_on)}
          </CardDescription>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 text-sm leading-6">
          <section>
            <h2 className="font-medium text-foreground">Description</h2>
            <p className="mt-1 text-body">
              {achievement.description || "No description yet."}
            </p>
          </section>
          <section>
            <h2 className="font-medium text-foreground">Linked activity</h2>
            <p className="mt-1 text-body">
              {linkedActivity ? (
                <Link
                  href={`/activities/${linkedActivity.id}`}
                  className="text-accent-strong underline-offset-2 hover:underline"
                >
                  {linkedActivity.title}
                </Link>
              ) : (
                "None — link one from Edit."
              )}
            </p>
          </section>
          <p className="text-xs text-faint">
            Only you can see this achievement.
          </p>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href={`/achievements/${achievement.id}/edit`} size="sm">
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

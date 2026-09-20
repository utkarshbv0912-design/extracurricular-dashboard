import { ActivityForm } from "@/components/activities/activity-form";
import { Container } from "@/components/ui/container";
import { mockActivities } from "@/lib/mock/data";
import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import Link from "next/link";

export const metadata = { title: "Edit activity | Extracurricular Dashboard" };

export default async function EditActivityPage({
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
        href={`/activities/${activity.id}`}
        className="text-sm text-accent-strong underline-offset-2 hover:underline"
      >
        ← Back to activity
      </Link>
      <h1 className="mt-4 font-drawn text-2xl font-semibold tracking-tight text-foreground">
        Edit activity
      </h1>
      <div className="mt-6">
        <ActivityForm
          initial={{
            title: activity.title,
            category: activity.category,
            description: activity.description,
            started_on: activity.started_on,
            ended_on: activity.ended_on ?? "",
            hours: String(activity.hours),
          }}
        />
      </div>
    </Container>
  );
}

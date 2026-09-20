import { AchievementForm } from "@/components/achievements/achievement-form";
import { Container } from "@/components/ui/container";
import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import { mockAchievements } from "@/lib/mock/data";
import Link from "next/link";

export const metadata = {
  title: "Edit achievement | Extracurricular Dashboard",
};

export default async function EditAchievementPage({
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

  return (
    <Container className="flex-1 max-w-2xl py-8">
      <Link
        href={`/achievements/${achievement.id}`}
        className="text-sm text-accent-strong underline-offset-2 hover:underline"
      >
        ← Back to achievement
      </Link>
      <h1 className="mt-4 font-drawn text-2xl font-semibold tracking-tight text-foreground">
        Edit achievement
      </h1>
      <div className="mt-6">
        <AchievementForm
          initial={{
            title: achievement.title,
            level: achievement.level,
            awarded_on: achievement.awarded_on,
            description: achievement.description,
            activity_id: achievement.activity_id ?? "",
          }}
        />
      </div>
    </Container>
  );
}

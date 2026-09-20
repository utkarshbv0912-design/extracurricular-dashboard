import { AchievementForm } from "@/components/achievements/achievement-form";
import { Container } from "@/components/ui/container";
import Link from "next/link";

export const metadata = {
  title: "Add achievement | Extracurricular Dashboard",
};

export default function NewAchievementPage() {
  return (
    <Container className="flex-1 max-w-2xl py-8">
      <Link
        href="/achievements"
        className="text-sm text-accent-strong underline-offset-2 hover:underline"
      >
        ← Back to achievements
      </Link>
      <h1 className="mt-4 font-drawn text-2xl font-semibold tracking-tight text-foreground">
        Add achievement
      </h1>
      <p className="mb-6 mt-1 text-sm text-body">
        Awards, certificates, competition results — big or small.
      </p>
      <AchievementForm />
    </Container>
  );
}

import { ActivityForm } from "@/components/activities/activity-form";
import { Container } from "@/components/ui/container";
import Link from "next/link";

export const metadata = { title: "Add activity | Extracurricular Dashboard" };

export default function NewActivityPage() {
  return (
    <Container className="flex-1 max-w-2xl py-8">
      <Link
        href="/activities"
        className="text-sm text-accent-strong underline-offset-2 hover:underline"
      >
        ← Back to activities
      </Link>
      <h1 className="mt-4 font-drawn text-2xl font-semibold tracking-tight text-foreground">
        Add activity
      </h1>
      <p className="mb-6 mt-1 text-sm text-body">
        Clubs, sports, volunteering, projects — it all counts.
      </p>
      <ActivityForm />
    </Container>
  );
}

import { ApplicationForm } from "@/components/applications/application-form";
import { Container } from "@/components/ui/container";
import Link from "next/link";

export const metadata = {
  title: "Track application | Extracurricular Dashboard",
};

export default async function NewApplicationPage({
  searchParams,
}: {
  searchParams: Promise<{ opportunity?: string }>;
}) {
  const { opportunity } = await searchParams;

  return (
    <Container className="flex-1 max-w-2xl py-8">
      <Link
        href="/applications"
        className="text-sm text-accent-strong underline-offset-2 hover:underline"
      >
        ← Back to applications
      </Link>
      <h1 className="mt-4 font-drawn text-2xl font-semibold tracking-tight text-foreground">
        Track an application
      </h1>
      <p className="mb-6 mt-1 text-sm text-body">
        Pick from the catalog, or track something else you&apos;re applying to.
      </p>
      <ApplicationForm presetOpportunityId={opportunity} />
    </Container>
  );
}

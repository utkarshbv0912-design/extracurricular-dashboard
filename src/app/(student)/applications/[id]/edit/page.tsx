import { ApplicationForm } from "@/components/applications/application-form";
import { Container } from "@/components/ui/container";
import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import { mockApplications } from "@/lib/mock/data";
import Link from "next/link";

export const metadata = {
  title: "Edit application | Extracurricular Dashboard",
};

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = mockApplications.find((a) => a.id === id);

  if (!app) {
    return (
      <Container className="flex-1 py-16 text-center">
        <LightbulbMascot mood="thinking" className="mx-auto h-24 w-24" />
        <h1 className="mt-4 font-drawn text-2xl font-semibold text-foreground">
          Application not found
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-body">
          <Link
            href="/applications"
            className="text-accent-strong underline-offset-2 hover:underline"
          >
            Back to applications
          </Link>
          .
        </p>
      </Container>
    );
  }

  return (
    <Container className="flex-1 max-w-2xl py-8">
      <Link
        href={`/applications/${app.id}`}
        className="text-sm text-accent-strong underline-offset-2 hover:underline"
      >
        ← Back to application
      </Link>
      <h1 className="mt-4 font-drawn text-2xl font-semibold tracking-tight text-foreground">
        Edit application
      </h1>
      <div className="mt-6">
        <ApplicationForm
          initial={{
            opportunity_id: app.opportunity_id ?? "other",
            off_catalog_title: app.off_catalog_title ?? "",
            status: app.status,
            deadline: app.deadline,
            notes: app.notes,
          }}
        />
      </div>
    </Container>
  );
}

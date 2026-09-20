import { AdminOpportunityForm } from "@/components/admin/opportunity-form";
import { Container } from "@/components/ui/container";
import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import { mockOpportunities } from "@/lib/mock/data";
import Link from "next/link";

export const metadata = {
  title: "Edit opportunity | Extracurricular Dashboard",
};

export default async function EditAdminOpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opportunity = mockOpportunities.find((o) => o.id === id);

  if (!opportunity) {
    return (
      <Container className="flex-1 py-16 text-center">
        <LightbulbMascot mood="thinking" className="mx-auto h-24 w-24" />
        <h1 className="mt-4 font-drawn text-2xl font-semibold text-foreground">
          Opportunity not found
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-body">
          <Link
            href="/admin/opportunities"
            className="text-accent-strong underline-offset-2 hover:underline"
          >
            Back to opportunities
          </Link>
          .
        </p>
      </Container>
    );
  }

  return (
    <Container className="flex-1 max-w-2xl py-8">
      <Link
        href="/admin/opportunities"
        className="text-sm text-accent-strong underline-offset-2 hover:underline"
      >
        ← Back to opportunities
      </Link>
      <h1 className="mt-4 font-drawn text-2xl font-semibold tracking-tight text-foreground">
        Edit opportunity
      </h1>
      <div className="mt-6">
        <AdminOpportunityForm
          initial={{
            title: opportunity.title,
            organization: opportunity.organization,
            description: opportunity.description,
            category: opportunity.category,
            eligibility: opportunity.eligibility,
            min_grade_level: opportunity.min_grade_level ?? "",
            max_grade_level: opportunity.max_grade_level ?? "",
            deadline: opportunity.deadline,
            link: opportunity.link,
            status: opportunity.status,
          }}
        />
      </div>
    </Container>
  );
}

import { AdminOpportunityForm } from "@/components/admin/opportunity-form";
import { Container } from "@/components/ui/container";
import Link from "next/link";

export const metadata = {
  title: "New opportunity | Extracurricular Dashboard",
};

export default function NewAdminOpportunityPage() {
  return (
    <Container className="flex-1 max-w-2xl py-8">
      <Link
        href="/admin/opportunities"
        className="text-sm text-accent-strong underline-offset-2 hover:underline"
      >
        ← Back to opportunities
      </Link>
      <h1 className="mt-4 font-drawn text-2xl font-semibold tracking-tight text-foreground">
        New opportunity
      </h1>
      <p className="mb-6 mt-1 text-sm text-body">
        Drafts are invisible to students until you publish.
      </p>
      <AdminOpportunityForm />
    </Container>
  );
}

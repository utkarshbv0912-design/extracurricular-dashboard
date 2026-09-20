import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = {
  title: "Dashboard | Extracurricular Dashboard",
  description: "Your extracurricular activities at a glance.",
};

const placeholders = [
  { title: "Activities", description: "Log and review what you do each week." },
  {
    title: "Hours logged",
    description: "See your committed time grow over the year.",
  },
  {
    title: "Achievements",
    description: "Collect awards and milestones as they happen.",
  },
];

export default function DashboardPage() {
  return (
    <Container className="flex-1 py-12">
      <header className="mb-8">
        <h1 className="font-drawn text-3xl font-semibold tracking-tight text-foreground">
          Your dashboard
        </h1>
        <p className="mt-2 text-body">
          A peek at the layout. Real data arrives in Phase 1.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {placeholders.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-faint">Coming in Phase 1</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <EmptyState
          title="Nothing tracked yet"
          description="Once onboarding exists, your activities and achievements will show up here."
          action={
            <ButtonLink href="/" variant="outline" size="sm">
              Back home
            </ButtonLink>
          }
        />
      </div>
    </Container>
  );
}

import { Container } from "@/components/ui/container";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardLoading() {
  return (
    <Container className="flex flex-1 items-center justify-center py-24">
      <Spinner size="lg" label="Loading dashboard" />
    </Container>
  );
}

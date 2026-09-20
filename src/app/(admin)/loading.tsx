import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

/** Admin route group loading: generic page skeleton. */
export default function AdminLoading() {
  return (
    <Container className="flex-1 py-8">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-2 h-4 w-64" />
      <Skeleton className="mt-6 h-40 w-full rounded-lg" />
    </Container>
  );
}

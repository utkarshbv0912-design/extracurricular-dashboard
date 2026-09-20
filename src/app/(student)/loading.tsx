import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

/** Student route group loading: generic page skeleton. */
export default function StudentLoading() {
  return (
    <Container className="flex-1 py-8">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-2 h-4 w-64" />
      <div className="mt-6 flex flex-col gap-3">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    </Container>
  );
}

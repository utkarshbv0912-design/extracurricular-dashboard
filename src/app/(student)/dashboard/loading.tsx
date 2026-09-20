import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

/** Dashboard loading state: skeleton matching the section layout. */
export default function DashboardLoading() {
  return (
    <Container className="flex-1 py-8">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-2 h-4 w-56" />
      <Skeleton className="mt-6 h-16 w-full rounded-lg" />
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </Container>
  );
}

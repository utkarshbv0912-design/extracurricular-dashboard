"use client";

import { useEffect } from "react";
import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

/**
 * Route-level error boundary. Shows a friendly message; the raw error is
 * logged to the console for debugging but never rendered (it could contain
 * internals we don't want on screen).
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
      <LightbulbMascot mood="oops" className="h-24 w-24" />
      <div className="max-w-md">
        <h1 className="font-drawn text-2xl font-semibold text-foreground">
          Something flickered out
        </h1>
        <p className="mt-2 text-sm leading-6 text-body">
          An unexpected error occurred. You can try again — if it keeps
          happening, come back a little later.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </Container>
  );
}

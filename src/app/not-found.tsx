import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
      <LightbulbMascot mood="thinking" className="h-24 w-24" />
      <div className="max-w-md">
        <h1 className="font-drawn text-2xl font-semibold text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-sm leading-6 text-body">
          Lumo looked everywhere, but this page doesn&apos;t exist. Maybe the link
          is old, or the address was mistyped.
        </p>
      </div>
      <ButtonLink href="/">Back to home</ButtonLink>
    </Container>
  );
}

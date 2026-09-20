import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import { Container } from "@/components/ui/container";

/**
 * AuthShell: centered card for auth flows (PHASE_1_UX_PLAN.md §2) — logo,
 * title, subcopy, then the form. No competing navigation.
 */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-6 py-16">
      <LightbulbMascot mood="happy" className="h-16 w-16" />
      <div className="w-full max-w-sm text-center">
        <h1 className="font-drawn text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-sm leading-6 text-body">{subtitle}</p>
        ) : null}
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </Container>
  );
}

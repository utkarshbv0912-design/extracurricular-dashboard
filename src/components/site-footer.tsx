import { Container } from "@/components/ui/container";

/**
 * SiteFooter: quiet, shared footer rendered once in the root layout.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-line py-8">
      <Container className="flex flex-col items-center justify-between gap-2 text-sm text-faint sm:flex-row">
        <p>Extracurricular Dashboard</p>
        <p>Private by design — your records are yours alone.</p>
      </Container>
    </footer>
  );
}

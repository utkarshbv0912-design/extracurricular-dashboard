"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

/**
 * PublicHeader: navigation for the landing and auth pages. Sign-in/up CTAs
 * are stubbed targets — real authentication arrives with the backend phase;
 * the UI and routes exist now.
 */
export function PublicHeader() {
  const pathname = usePathname();
  const onAuthPage = pathname?.startsWith("/auth") ?? false;

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-background/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full font-drawn text-base font-semibold tracking-tight text-foreground"
        >
          <LightbulbMascot className="h-8 w-8" />
          <span className="hidden sm:inline">Extracurricular Dashboard</span>
          <span className="sm:hidden">Dashboard</span>
        </Link>
        {!onAuthPage && (
          <nav aria-label="Account" className="flex items-center gap-2">
            <ButtonLink href="/auth/sign-in" variant="ghost" size="sm">
              Sign in
            </ButtonLink>
            <ButtonLink href="/auth/sign-up" variant="primary" size="sm">
              Sign up
            </ButtonLink>
          </nav>
        )}
      </Container>
    </header>
  );
}

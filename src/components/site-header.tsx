"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import { Container } from "@/components/ui/container";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
];

/**
 * SiteHeader: shared navigation for every page, rendered once in the root
 * layout. Highlights the active route and stays readable on small screens.
 */
export function SiteHeader() {
  const pathname = usePathname();

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
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-1 text-sm font-medium"
        >
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={
                  "rounded-full px-3 py-1.5 transition-colors " +
                  (active
                    ? "bg-accent-soft text-accent-strong"
                    : "text-body hover:bg-surface-muted hover:text-foreground")
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </Container>
    </header>
  );
}

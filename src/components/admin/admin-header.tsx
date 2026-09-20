"use client";

import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/opportunities", label: "Opportunities" },
  { href: "/admin/reports", label: "Reports" },
] as const;

/**
 * AdminHeader: separate chrome for the admin area (PHASE_1_UX_PLAN.md §4).
 * Students never see this surface — no student route links here, and the
 * server-side guard arrives with the backend phase.
 */
export function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-background/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-full font-drawn text-base font-semibold tracking-tight text-foreground"
          >
            <LightbulbMascot className="h-8 w-8" />
            <span className="hidden sm:inline">Extracurricular Dashboard</span>
            <Badge>Admin</Badge>
          </Link>
          <nav
            aria-label="Admin"
            className="hidden items-center gap-1 text-sm font-medium sm:flex"
          >
            {ADMIN_NAV.map((link) => {
              const active =
                link.href === "/admin"
                  ? pathname === "/admin"
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
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-body transition-colors hover:bg-surface-muted hover:text-foreground"
        >
          <ArrowLeft aria-hidden className="h-4 w-4" />
          Student view
        </Link>
      </Container>
    </header>
  );
}

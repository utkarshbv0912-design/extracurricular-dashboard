"use client";

import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import { Avatar } from "@/components/ui/avatar";
import { Container } from "@/components/ui/container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initials } from "@/lib/format";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

/** Top-level student destinations (IA per PHASE_1_UX_PLAN.md §4). */
export const STUDENT_NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/activities", label: "Activities" },
  { href: "/achievements", label: "Achievements" },
  { href: "/applications", label: "Applications" },
] as const;

/**
 * StudentHeader: desktop/tablet top navigation with avatar menu. On mobile
 * the nav items hide — the MobileBottomBar takes over (designed for mobile,
 * not a shrunken desktop, per PHASE_1_UX_PLAN.md §12).
 */
export function StudentHeader({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-background/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-full font-drawn text-base font-semibold tracking-tight text-foreground"
          >
            <LightbulbMascot className="h-8 w-8" />
            <span className="hidden lg:inline">Extracurricular Dashboard</span>
          </Link>
          <nav
            aria-label="Main"
            className="hidden items-center gap-1 text-sm font-medium md:flex"
          >
            {STUDENT_NAV.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(link.href + "/");
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
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Account menu"
            className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong"
          >
            <Avatar>{initials(name)}</Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings aria-hidden className="h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                // Stubbed: real sign-out arrives with the backend phase.
                router.push("/");
              }}
            >
              <LogOut aria-hidden className="h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Container>
    </header>
  );
}

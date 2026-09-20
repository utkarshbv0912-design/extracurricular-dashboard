"use client";

import { Container } from "@/components/ui/container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarCheck,
  Compass,
  Ellipsis,
  LayoutDashboard,
  LogOut,
  NotebookPen,
  Settings,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

/**
 * MobileBottomBar: the intentional mobile navigation (PHASE_1_UX_PLAN.md
 * §12) — four top destinations plus a More menu, thumb-reachable, with a
 * 44px+ touch target per item. Hidden at md and above, where the top
 * header nav takes over.
 */
const primary = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/opportunities", label: "Find", icon: Compass },
  { href: "/activities", label: "Activities", icon: NotebookPen },
  { href: "/applications", label: "Apps", icon: CalendarCheck },
] as const;

export function MobileBottomBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Container className="grid grid-cols-5">
        {primary.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={
                "flex min-h-14 flex-col items-center justify-center gap-0.5 py-2 text-xs transition-colors " +
                (active
                  ? "text-accent-strong"
                  : "text-body hover:text-foreground")
              }
            >
              <Icon aria-hidden className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="More menu"
            className="flex min-h-14 flex-col items-center justify-center gap-0.5 py-2 text-xs text-body transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong"
          >
            <Ellipsis aria-hidden className="h-5 w-5" />
            <span>More</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end" className="mb-2">
            <DropdownMenuItem asChild>
              <Link href="/achievements">
                <Trophy aria-hidden className="h-4 w-4" /> Achievements
              </Link>
            </DropdownMenuItem>
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
    </nav>
  );
}

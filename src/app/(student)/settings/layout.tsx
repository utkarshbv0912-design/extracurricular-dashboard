"use client";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SETTINGS_NAV = [
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/preferences", label: "Preferences" },
  { href: "/settings/privacy", label: "Privacy" },
  { href: "/settings/account", label: "Account" },
] as const;

/** Settings layout: quiet side nav on desktop, stacked tabs on mobile. */
export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Container className="flex-1 py-8">
      <header className="mb-6">
        <h1 className="font-drawn text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Settings
        </h1>
      </header>
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        <nav
          aria-label="Settings"
          className="flex gap-1 overflow-x-auto lg:w-44 lg:flex-col"
        >
          {SETTINGS_NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors lg:rounded-lg",
                  active
                    ? "bg-accent-soft text-accent-strong"
                    : "text-body hover:bg-surface-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </Container>
  );
}

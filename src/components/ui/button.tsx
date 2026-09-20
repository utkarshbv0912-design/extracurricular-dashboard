import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Button: one source of truth for variants and sizes so pages never
 * re-declare button classes. Renders as `button` by default, or as a Next
 * `Link` when `href` is provided.
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong";

const variants = {
  primary: "bg-foreground text-background hover:opacity-85",
  accent: "bg-accent-soft text-accent-strong hover:bg-accent-glow/40",
  outline: "border border-line-strong bg-surface text-foreground hover:bg-surface-muted",
  ghost: "text-body hover:bg-surface-muted hover:text-foreground",
} as const;

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
} as const;

type CommonProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className ?? ""}`}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={`${base} ${variants[variant]} ${sizes[size]} ${className ?? ""}`}
      {...props}
    />
  );
}

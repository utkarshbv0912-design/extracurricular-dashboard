import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button: one source of truth for variants and sizes so pages never
 * re-declare button classes. Renders as `button` by default, or as a Next
 * `Link` when `href` is provided (ButtonLink shares the exact same styles).
 *
 * Min height 44px at md (touch-target rule, PHASE_1_UX_PLAN.md §13);
 * pending/submitting callers pass `disabled` + their own spinner.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-foreground text-background hover:opacity-85",
        accent: "bg-accent-soft text-accent-strong hover:bg-accent-glow/40",
        outline:
          "border border-line-strong bg-surface text-foreground hover:bg-surface-muted",
        ghost: "text-body hover:bg-surface-muted hover:text-foreground",
        danger:
          "bg-danger text-surface hover:opacity-90",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants>;
type ButtonLinkProps = ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & { children: ReactNode };

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn: the single class-composition helper for the design system.
 * Conditional classes via clsx, Tailwind conflict resolution via
 * tailwind-merge — so later classes (e.g. a caller's px-3) reliably win
 * over component defaults.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

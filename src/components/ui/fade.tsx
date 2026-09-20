"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The motion vocabulary: three named presets, all fast and subtle, all
 * suppressed for reduced-motion users. Components use `animate={motionName}`
 * on the <Fade> wrapper; one-off animations may pass an object.
 */
export const motions = {
  /** Card/list item appearance: 6px rise + fade. */
  rise: { opacity: 1, y: 0 },
  /** Element becomes present without movement. */
  fade: { opacity: 1 },
  /** Small celebratory confirmation (saved, completed): gentle pop. */
  pop: { scale: 1 },
} as const;

export type MotionName = keyof typeof motions;

const enterFrom: Record<MotionName, { opacity: number; y?: number; scale?: number }> = {
  rise: { opacity: 0, y: 6 },
  fade: { opacity: 0 },
  pop: { opacity: 0, scale: 0.96 },
};

const durations: Record<MotionName, number> = {
  rise: 0.2,
  fade: 0.15,
  pop: 0.25,
};

/**
 * Fade: the ONLY allowed entrance-animation wrapper for cards, list items,
 * and panels. Stagger by passing index; reduced-motion users get static
 * content (useReducedMotion bypasses all animation).
 *
 * Conventions (PHASE_1_UX_PLAN.md §15 / design-system doc):
 * - animate ≤ 2 groups per screen; lists stagger ≤ 40ms per item.
 * - never animate layout-critical structure; animation is decoration on
 *   top of fully-functional static content.
 */
export function Fade({
  children,
  className,
  index,
  motion: motionName = "rise",
  ...props
}: {
  children: ReactNode;
  index?: number;
  motion?: MotionName;
} & HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={reduce ? false : enterFrom[motionName]}
      animate={reduce ? undefined : motions[motionName]}
      transition={{
        duration: reduce ? 0 : durations[motionName],
        ease: "easeOut",
        delay: reduce ? 0 : Math.min((index ?? 0) * 0.04, 0.24),
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

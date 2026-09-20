"use client";

import { useState } from "react";

/**
 * useStubbedSave: tiny client hook for settings forms in this phase —
 * simulates a server action's pending/saved cycle. Replaced by the real
 * server actions in the backend phase.
 */
export function useStubbedSave() {
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(run: () => Promise<void>) {
    setPending(true);
    setSaved(false);
    await run();
    setPending(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return { pending, saved, save };
}

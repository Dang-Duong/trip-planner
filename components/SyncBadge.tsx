"use client";

import type { Sync } from "@/lib/shared-state";

/**
 * Silent while everything is saved. It only speaks up when a tick or a receipt is
 * sitting in the outbox, because the one thing worse than no sync is thinking you
 * have it.
 */
export default function SyncBadge({ sync, pending }: { sync: Sync; pending: number }) {
  if (sync === "ok" && pending === 0) return null;

  const text =
    sync === "local"
      ? "this device only"
      : sync === "offline"
        ? pending > 0
          ? `offline · ${pending} unsent`
          : "offline"
        : `saving ${pending}…`;

  return (
    <span className="sync" data-state={sync} role="status">
      {text}
    </span>
  );
}

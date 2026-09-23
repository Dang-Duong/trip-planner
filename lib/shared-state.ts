"use client";

// Trip state that everyone shares, over `/api/trip/[slug]`.
//
// The shape of the hooks matches the localStorage ones in `local-state.ts` on purpose,
// so the views barely change. What is different is that a write is a queued op, not a
// setter: it goes into an outbox in localStorage first, then to the server. Signal in
// the Mattertal comes and goes, and a receipt typed in a valley with no bars has to
// survive until it can be sent.

import { useMemo, useSyncExternalStore } from "react";
import {
  applyOps,
  diffEntries,
  EMPTY_STATE,
  MAX_OPS,
  toEntries,
  type Entry,
  type Op,
  type TripState,
} from "./sync-ops";

/** `local` = the server has no store configured, so this browser is on its own. */
export type Sync = "ok" | "offline" | "local";

export type Shared = { view: TripState; sync: Sync; pending: number };

const IDLE: Shared = { view: EMPTY_STATE, sync: "ok", pending: 0 };

const POLL_MS = 6000;

function createStore(slug: string) {
  const cacheKey = `trip:${slug}:cache`;
  const outKey = `trip:${slug}:outbox`;
  const listeners = new Set<() => void>();

  let server: TripState = EMPTY_STATE;
  let pending: Op[] = [];
  let sync: Sync = "ok";
  let snap: Shared = IDLE;
  let timer: ReturnType<typeof setInterval> | null = null;
  let inFlight = false;
  let loaded = false;

  function load<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback; // private mode, or a corrupt entry — start clean
    }
  }

  function save(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore — see load()
    }
  }

  // One new object per change, the same object between them: useSyncExternalStore
  // re-renders forever if the snapshot identity keeps changing.
  function rebuild() {
    snap = { view: applyOps(server, pending), sync, pending: pending.length };
    listeners.forEach((l) => l());
  }

  async function flush() {
    if (inFlight) return;
    inFlight = true;

    // Ops queued while this request is in the air stay in the outbox for the next one.
    const sending = pending.slice(0, MAX_OPS);

    try {
      const res = await fetch(
        `/api/trip/${encodeURIComponent(slug)}`,
        sending.length
          ? {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ops: sending }),
              cache: "no-store",
            }
          : { cache: "no-store" },
      );

      if (res.status === 503) {
        // No store behind the API (local dev, or the env var never made it to the
        // deploy). Keep the old single-browser behaviour rather than lose the tick.
        server = applyOps(server, sending);
        pending = pending.slice(sending.length);
        save(cacheKey, server);
        save(outKey, pending);
        sync = "local";
        return;
      }

      if (!res.ok) throw new Error(`api ${res.status}`);

      server = (await res.json()) as TripState;
      pending = pending.slice(sending.length);
      save(cacheKey, server);
      save(outKey, pending);
      sync = "ok";
    } catch {
      // Ops stay in the outbox, so the next poll (or coming back online) retries them.
      // Every op is idempotent, so a request that timed out after Redis applied it is
      // harmless to send again.
      sync = "offline";
    } finally {
      inFlight = false;
      rebuild();
    }
  }

  const wake = () => {
    if (!document.hidden) void flush();
  };

  return {
    subscribe(onChange: () => void) {
      listeners.add(onChange);

      if (!loaded) {
        loaded = true;
        server = load(cacheKey, EMPTY_STATE);
        pending = load<Op[]>(outKey, []);
        rebuild();
      }

      if (!timer) {
        timer = setInterval(wake, POLL_MS);
        document.addEventListener("visibilitychange", wake);
        window.addEventListener("online", wake);
        void flush();
      }

      return () => {
        listeners.delete(onChange);
        if (listeners.size === 0 && timer) {
          clearInterval(timer);
          timer = null;
          document.removeEventListener("visibilitychange", wake);
          window.removeEventListener("online", wake);
        }
      };
    },
    snapshot: () => snap,
    push(ops: Op[]) {
      if (ops.length === 0) return;
      pending = [...pending, ...ops];
      save(outKey, pending);
      rebuild();
      void flush();
    },
  };
}

const stores = new Map<string, ReturnType<typeof createStore>>();

function storeFor(slug: string) {
  let store = stores.get(slug);
  if (!store) stores.set(slug, (store = createStore(slug)));
  return store;
}

function useShared(slug: string): Shared {
  const store = storeFor(slug);
  // The server snapshot is empty, which is also the first client render, so hydration
  // matches and the cached state arrives on the pass straight after it.
  return useSyncExternalStore(store.subscribe, store.snapshot, () => IDLE);
}

/** Drop-in for `useChecklist`, shared by everyone on the trip. */
export function useSharedChecklist(slug: string) {
  const store = storeFor(slug);
  const { view, sync, pending } = useShared(slug);
  const done = useMemo(() => new Set(view.shop), [view]);

  return {
    done,
    // Read the store, not the rendered `done`: two taps inside one task both close over
    // the same stale set, and the second would undo the first.
    toggle: (id: string) =>
      store.push([{ k: "tick", id, on: !store.snapshot().view.shop.includes(id) }]),
    clear: () => store.push([{ k: "clear" }]),
    sync,
    pending,
  };
}

/** Drop-in for `useStoredJson`, for anything stored by id — the expense list. */
export function useSharedEntries(slug: string) {
  const store = storeFor(slug);
  const { view, sync, pending } = useShared(slug);

  const write = (next: unknown[] | ((prev: Entry[]) => unknown[])) => {
    const prev = store.snapshot().view.money;
    const resolved = typeof next === "function" ? next(prev) : next;
    // A whole array in, per-receipt ops out — two people adding at once must not
    // overwrite each other.
    store.push(diffEntries(prev, toEntries(resolved)));
  };

  return [view.money as unknown, write, sync, pending] as const;
}

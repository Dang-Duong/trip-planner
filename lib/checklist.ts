"use client";

import { useSyncExternalStore } from "react";

const EMPTY: ReadonlySet<string> = new Set();

/**
 * localStorage is an external store, so we subscribe to it rather than mirroring it
 * into state from an effect. The server snapshot is empty, which is also the first
 * client render — so hydration matches, and the real values arrive without a
 * cascading re-render. Also keeps two open tabs in sync for free.
 */
function createStore(key: string) {
  let raw: string | null = null;
  let value: ReadonlySet<string> = EMPTY;
  const listeners = new Set<() => void>();

  const read = () => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null; // private mode / storage disabled — the list just won't persist
    }
  };

  return {
    subscribe(onChange: () => void) {
      listeners.add(onChange);
      window.addEventListener("storage", onChange);
      return () => {
        listeners.delete(onChange);
        window.removeEventListener("storage", onChange);
      };
    },
    // Must return a stable reference while the underlying string is unchanged,
    // or useSyncExternalStore will loop.
    snapshot(): ReadonlySet<string> {
      const next = read();
      if (next !== raw) {
        raw = next;
        try {
          value = new Set(next ? (JSON.parse(next) as string[]) : []);
        } catch {
          value = EMPTY; // corrupt entry — start clean rather than crash the page
        }
      }
      return value;
    },
    write(next: ReadonlySet<string>) {
      const json = JSON.stringify([...next]);
      try {
        localStorage.setItem(key, json);
      } catch {
        // ignore — see read()
      }
      raw = json;
      value = next;
      listeners.forEach((l) => l());
    },
  };
}

// Module-scoped so the mutable bookkeeping lives outside the render cycle.
const stores = new Map<string, ReturnType<typeof createStore>>();
const getStore = (key: string) => {
  let s = stores.get(key);
  if (!s) stores.set(key, (s = createStore(key)));
  return s;
};

/** Shared by the packing list and the shopping split, which keep separate keys. */
export function useChecklist(key: string) {
  const store = getStore(key);
  const done = useSyncExternalStore(store.subscribe, store.snapshot, () => EMPTY);

  // Read the store, not the rendered `done`: two toggles inside one task (a fast
  // double-tap, or several in a row) both close over the same stale set, so the
  // second write drops the first. The snapshot is always current.
  const toggle = (id: string) => {
    const next = new Set(store.snapshot());
    if (!next.delete(id)) next.add(id);
    store.write(next);
  };

  return { done, toggle, clear: () => store.write(EMPTY) };
}

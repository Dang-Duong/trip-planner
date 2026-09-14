"use client";

// localStorage-backed UI state. Everything here goes through useSyncExternalStore so
// the server snapshot and the first client render agree, and the stored value arrives
// on the pass straight after hydration — no setState inside an effect.

import { useMemo, useSyncExternalStore } from "react";

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

/** The same idea as above, for a single remembered value rather than a set. */
function createChoiceStore(key: string, fallback: string) {
  let raw: string | null = null;
  let value = fallback;
  const listeners = new Set<() => void>();

  return {
    subscribe(onChange: () => void) {
      listeners.add(onChange);
      window.addEventListener("storage", onChange);
      return () => {
        listeners.delete(onChange);
        window.removeEventListener("storage", onChange);
      };
    },
    snapshot() {
      let next: string | null = null;
      try {
        next = localStorage.getItem(key);
      } catch {
        next = null; // private mode — the choice just won't persist
      }
      if (next !== raw) {
        raw = next;
        value = next ?? fallback;
      }
      return value;
    },
    write(next: string) {
      try {
        localStorage.setItem(key, next);
      } catch {
        // ignore, as above
      }
      raw = next;
      value = next;
      listeners.forEach((l) => l());
    },
  };
}

const choices = new Map<string, ReturnType<typeof createChoiceStore>>();

function parse<T>(text: string, fallback: T): T {
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback; // corrupt entry — start clean rather than crash the page
  }
}

function readRaw(key: string) {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return ""; // private mode — see createChoiceStore
  }
}

/** The raw string behind one key. Both hooks below are built on this. */
function useStoredString(key: string, fallback: string) {
  let store = choices.get(key);
  if (!store) choices.set(key, (store = createChoiceStore(key, fallback)));
  const s = store;

  const raw = useSyncExternalStore(s.subscribe, s.snapshot, () => fallback);
  return [raw, (next: string) => s.write(next)] as const;
}

/** One remembered choice out of a fixed set — the language toggle. */
export function useStoredChoice<T extends string>(key: string, options: readonly T[], fallback: T) {
  const [raw, write] = useStoredString(key, fallback);
  const value = (options as readonly string[]).includes(raw) ? (raw as T) : fallback;
  return [value, (next: T) => write(next)] as const;
}

/** A JSON value kept in localStorage — the expense list. */
export function useStoredJson<T>(key: string, fallback: T) {
  const [raw, write] = useStoredString(key, "");

  const value = useMemo<T>(() => parse(raw, fallback), [raw, fallback]);

  // Takes an updater as well as a value: two writes inside one task both close over the
  // same rendered value, and the second would drop the first. The updater form reads the
  // store instead, so adding two receipts quickly keeps both.
  const set = (next: T | ((prev: T) => T)) => {
    const resolved =
      typeof next === "function"
        ? (next as (prev: T) => T)(parse(readRaw(key), fallback))
        : next;
    write(JSON.stringify(resolved));
  };

  return [value, set] as const;
}

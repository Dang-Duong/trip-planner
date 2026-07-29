"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { PackGroup } from "@/lib/types";

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

function usePacked(key: string) {
  const store = getStore(key);
  const done = useSyncExternalStore(store.subscribe, store.snapshot, () => EMPTY);
  return [done, store.write] as const;
}

export default function PackList({ groups, slug }: { groups: PackGroup[]; slug: string }) {
  const [done, write] = usePacked(`pack:${slug}:v1`);

  const ids = useMemo(
    () => groups.flatMap((g, gi) => g.items.map((_, ii) => `${gi}.${ii}`)),
    [groups],
  );

  const toggle = (id: string) => {
    const next = new Set(done);
    if (!next.delete(id)) next.add(id);
    write(next);
  };

  const count = ids.filter((id) => done.has(id)).length;

  return (
    <>
      <div className="bar">
        <span className="mono fine" id="pack-count">
          {count} / {ids.length}
        </span>
        <span
          className="pr"
          role="progressbar"
          aria-labelledby="pack-count"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={ids.length}
        >
          <i style={{ width: `${ids.length ? (count / ids.length) * 100 : 0}%` }} />
        </span>
        <button type="button" onClick={() => write(EMPTY)}>
          Clear
        </button>
      </div>

      <div className="pack">
        {groups.map((group, gi) => (
          <div className="pc" key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item, ii) => {
                const id = `${gi}.${ii}`;
                return (
                  <li key={id}>
                    <label>
                      <input type="checkbox" checked={done.has(id)} onChange={() => toggle(id)} />
                      <span>
                        {item.label}
                        {item.sub && <s>{item.sub}</s>}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

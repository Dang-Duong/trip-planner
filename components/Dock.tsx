"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

const TABS = ["plan", "places", "pack"] as const;
export type Tab = (typeof TABS)[number];
const isTab = (s: string): s is Tab => (TABS as readonly string[]).includes(s);

const read = (): Tab => {
  const h = window.location.hash.slice(1);
  return isTab(h) ? h : "plan";
};
const subs = new Set<() => void>();
const subscribe = (fn: () => void) => {
  subs.add(fn);
  addEventListener("hashchange", fn);
  // Arriving from another page, Next writes the new URL (and its #tab) after this page
  // has rendered, so everyone reads it once more after that settles.
  const late = setTimeout(() => subs.forEach((f) => f()));
  return () => {
    clearTimeout(late);
    subs.delete(fn);
    removeEventListener("hashchange", fn);
  };
};

export const useTab = () => useSyncExternalStore(subscribe, read, (): Tab => "plan");

/** Runs a UI swap as a view transition. `dir` slides the sheet: 1 forward, -1 back, 0 fade. */
export function swap(update: () => void, dir = 0) {
  document.documentElement.dataset.dir = String(dir);
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    update();
    return;
  }
  document.startViewTransition(() => flushSync(update));
}

// Next's router changes the hash with pushState, which fires no hashchange, so tabs on
// the same page switch here instead. history.state is kept: Next reloads on a popstate
// whose state it doesn't recognise.
function goTab(t: Tab) {
  const from = TABS.indexOf(read());
  history.replaceState(history.state, "", `#${t}`);
  swap(() => subs.forEach((fn) => fn()), Math.sign(TABS.indexOf(t) - from));
}

const ICONS: Record<Tab | "shop" | "money", React.ReactNode> = {
  plan: (
    <>
      <path d="M2.5 20 9 9.5l3.2 5L15 10.5 21.5 20Z" />
      <path className="acc" d="M5.5 20c2.5-2.5 3.5-4 6.5-5.5" strokeDasharray="1.6 2" />
      <path className="acc" d="M15 10.5V4.5l3 1.2-3 1.2" />
    </>
  ),
  places: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-10.8a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21Z" />
      <rect x="9" y="7.6" width="6" height="5.2" rx=".4" />
      <path className="acc fill" d="M9 9.35h6v1.7H9Z" />
    </>
  ),
  pack: (
    <>
      <path d="M6.5 20.5V10a5.5 5.5 0 0 1 11 0v10.5Z" />
      <path d="M10 4.7V3.4h4v1.3" />
      <path className="acc fill" d="M9 14h6v4.2H9Z" />
      <path d="M6.5 12.5h11" />
    </>
  ),
  shop: (
    <>
      <path d="M5 8.5h14l-1.3 12H6.3Z" />
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
      <path className="acc" d="M8.5 12.5c1.2 1.6 5.8 1.6 7 0" />
    </>
  ),
  money: (
    <>
      <ellipse className="acc fill" cx="12" cy="6.8" rx="6.5" ry="2.6" />
      <path d="M5.5 6.8v5c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6v-5" />
      <path d="M5.5 11.8v5c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6v-5" />
    </>
  ),
};

export default function Dock({ slug, shop }: { slug: string; shop: boolean }) {
  const path = usePathname();
  const tab = useTab();
  const base = `/trips/${slug}`;
  const home = path === base;

  const items: { id: keyof typeof ICONS; label: string; href: string; on: boolean }[] = [
    { id: "plan", label: "Plan", href: `${base}#plan`, on: home && tab === "plan" },
    { id: "places", label: "Places", href: `${base}#places`, on: home && tab === "places" },
    { id: "pack", label: "Pack", href: `${base}#pack`, on: home && tab === "pack" },
  ];
  if (shop) {
    items.push(
      { id: "shop", label: "Shop", href: `${base}/shop`, on: path === `${base}/shop` },
      { id: "money", label: "Money", href: `${base}/money`, on: path === `${base}/money` },
    );
  }

  return (
    <nav className="dock" aria-label="Trip">
      <span
        className="mark"
        aria-hidden="true"
        hidden={!items.some((it) => it.on)}
        style={
          { "--i": items.findIndex((it) => it.on), "--n": items.length } as React.CSSProperties
        }
      />
      {items.map(({ id, label, href, on }) => {
        const body = (
          <>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {ICONS[id]}
            </svg>
            {label}
          </>
        );
        const current = on ? "page" : undefined;
        return home && isTab(id) ? (
          <a
            key={id}
            href={`#${id}`}
            aria-current={current}
            onClick={(e) => {
              e.preventDefault();
              goTab(id);
            }}
          >
            {body}
          </a>
        ) : (
          <Link
            key={id}
            href={href}
            aria-current={current}
            scroll={false}
            // Put the tab in the URL up front so the trip page and the dock agree on it from
            // the first frame, rather than showing Plan until Next writes the hash.
            onClick={() => isTab(id) && history.replaceState(history.state, "", `#${id}`)}
          >
            {body}
          </Link>
        );
      })}
    </nav>
  );
}

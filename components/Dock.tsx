"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ICONS = {
  plan: <path d="M4 5h16M4 12h10M4 19h7" />,
  places: (
    <>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  pack: (
    <>
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  money: (
    <>
      <ellipse cx="12" cy="6.5" rx="7" ry="3" />
      <path d="M5 6.5v11c0 1.7 3.1 3 7 3s7-1.3 7-3v-11M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
    </>
  ),
  shop: (
    <>
      <path d="M4 5h2l2 10h10l2-7H7" />
      <circle cx="9" cy="19" r="1.3" />
      <circle cx="17" cy="19" r="1.3" />
    </>
  ),
};

export type Tab = "plan" | "places" | "pack";
export const TABS: Tab[] = ["plan", "places", "pack"];

export function useTab(): Tab {
  const [tab, setTab] = useState<Tab>("plan");
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.slice(1) as Tab;
      setTab(TABS.includes(h) ? h : "plan");
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  return tab;
}

export default function Dock({ slug, shop }: { slug: string; shop: boolean }) {
  const path = usePathname();
  const tab = useTab();
  const base = `/trips/${slug}`;
  const items: { id: keyof typeof ICONS; label: string; href: string; on: boolean }[] = [
    { id: "plan", label: "Plan", href: `${base}#plan`, on: path === base && tab === "plan" },
    { id: "places", label: "Places", href: `${base}#places`, on: path === base && tab === "places" },
    { id: "pack", label: "Pack", href: `${base}#pack`, on: path === base && tab === "pack" },
  ];
  if (shop) {
    items.push(
      { id: "shop", label: "Shop", href: `${base}/shop`, on: path === `${base}/shop` },
      { id: "money", label: "Money", href: `${base}/money`, on: path === `${base}/money` },
    );
  }

  return (
    <nav className="dock" aria-label="Trip">
      {items.map((it) => (
        <Link key={it.id} href={it.href} aria-current={it.on ? "page" : undefined} scroll={false}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {ICONS[it.id]}
          </svg>
          {it.label}
        </Link>
      ))}
    </nav>
  );
}

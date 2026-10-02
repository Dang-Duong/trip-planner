"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Icons are Microsoft Fluent 3D emoji (MIT) in /public/icons, resized to 96px.
type Item = "plan" | "places" | "pack" | "shop" | "money";

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
  const items: { id: Item; label: string; href: string; on: boolean }[] = [
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
          <Image src={`/icons/${it.id}.png`} alt="" width={30} height={30} />
          {it.label}
        </Link>
      ))}
    </nav>
  );
}

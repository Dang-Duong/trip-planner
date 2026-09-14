"use client";

import { useEffect } from "react";
import BackLink from "@/components/BackLink";
import ShopList from "@/components/ShopList";
import { useStoredChoice } from "@/lib/checklist";
import type { Lang } from "@/lib/types";
import { getTrip } from "@/trips";

const COPY = {
  en: {
    title: "Who buys what",
    people: "People",
    items: "Items",
    meat: "Meat",
    water: "Water",
    bought: "bought",
    reset: "Reset",
    notes: "Before anyone buys anything",
    back: "Back to the plan",
    backSub: "Map & days",
    switchTo: "Přepnout do češtiny",
  },
  cs: {
    title: "Kdo co kupuje",
    people: "Lidí",
    items: "Položek",
    meat: "Maso",
    water: "Voda",
    bought: "koupeno",
    reset: "Vynulovat",
    notes: "Než někdo začne nakupovat",
    back: "Zpátky na plán",
    backSub: "Mapa a dny",
    switchTo: "Switch to English",
  },
} as const;

const LANGS = [
  { id: "en", label: "EN" },
  { id: "cs", label: "CS" },
] as const satisfies readonly { id: Lang; label: string }[];

const IDS = ["en", "cs"] as const;

const KEY = "shop-lang";

export default function ShopView({ slug }: { slug: string }) {
  const trip = getTrip(slug);
  const [lang, choose] = useStoredChoice<Lang>(KEY, IDS, "en");

  // The page is a single document in one language at a time, so the root element
  // should say which — screen readers pick their voice from it.
  useEffect(() => {
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = "en";
    };
  }, [lang]);

  if (!trip) return null;

  const t = COPY[lang];
  const content = trip.shop[lang];
  const items = content.people.reduce((n, p) => n + p.items.length, 0);

  return (
    <div className="shop">
      <header className="shop-head">
        <div className="shop-top">
          <span className="blz" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <div className="shop-lang" role="group" aria-label={t.switchTo}>
            {LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                lang={l.id}
                aria-pressed={lang === l.id}
                onClick={() => choose(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <h1>{t.title}</h1>
        <p className="shop-sub">
          {trip.title} {trip.titleAccent} {trip.titleTail} · {trip.dates}
        </p>
        <p className="shop-lede">{content.lede}</p>

        <dl className="shop-vitals">
          <div>
            <dt>{t.people}</dt>
            <dd>{content.people.length}</dd>
          </div>
          <div>
            <dt>{t.items}</dt>
            <dd>{items}</dd>
          </div>
          <div>
            <dt>{t.meat}</dt>
            <dd>5,2 kg</dd>
          </div>
          <div>
            <dt>{t.water}</dt>
            <dd>54 L</dd>
          </div>
        </dl>
      </header>

      {/* Keyed so switching language remounts the list rather than reconciling two
          different sets of strings into the same nodes. */}
      <ShopList
        key={lang}
        people={content.people}
        slug={trip.slug}
        boughtLabel={t.bought}
        resetLabel={t.reset}
      />

      <section className="shop-notes">
        <h2>{t.notes}</h2>
        <ul>
          {content.notes.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      </section>

      <BackLink slug={trip.slug} label={t.back} sub={t.backSub} />
    </div>
  );
}

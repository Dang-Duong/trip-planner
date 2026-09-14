"use client";

import BackLink from "@/components/BackLink";
import ShopList from "@/components/ShopList";
import { getTrip } from "@/trips";

export default function ShopView({ slug }: { slug: string }) {
  const trip = getTrip(slug);
  if (!trip) return null;

  const items = trip.shop.reduce((n, p) => n + p.items.length, 0);

  return (
    <div className="shop">
      <header className="shop-head">
        <span className="blz" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <h1>Who buys what</h1>
        <p className="shop-sub">
          {trip.title} {trip.titleAccent} {trip.titleTail} · {trip.dates}
        </p>
        <p className="shop-lede">
          One category each, so nobody buys the same thing twice. Tick yours off as you go — it
          saves on your own device. Buy in Czechia, top up in France, buy nothing in Switzerland.
        </p>
        <dl className="shop-vitals">
          <div>
            <dt>People</dt>
            <dd>{trip.shop.length}</dd>
          </div>
          <div>
            <dt>Items</dt>
            <dd>{items}</dd>
          </div>
          <div>
            <dt>Meat</dt>
            <dd>5,2 kg</dd>
          </div>
          <div>
            <dt>Water</dt>
            <dd>54 L</dd>
          </div>
        </dl>
      </header>

      <ShopList people={trip.shop} slug={trip.slug} />

      {trip.shopNotes && (
        <section className="shop-notes">
          <h2>Before anyone buys anything</h2>
          <ul>
            {trip.shopNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </section>
      )}

      <BackLink slug={trip.slug} />
    </div>
  );
}

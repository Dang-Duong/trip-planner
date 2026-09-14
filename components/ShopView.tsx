"use client";

import Link from "next/link";
import PackList from "@/components/PackList";
import { getTrip } from "@/trips";

export default function ShopView({ slug }: { slug: string }) {
  const trip = getTrip(slug);
  if (!trip) return null;

  const people = trip.shop.length;
  const items = trip.shop.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="idx">
      <header className="phead">
        <span className="blz" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <h1>Who buys what</h1>
        <p className="fine">
          {trip.title} {trip.titleAccent} {trip.titleTail} · {trip.dates} · one category each, so
          nobody buys the same thing twice.
        </p>
        <div className="stats">
          <div>
            <b>{people}</b>
            <span>Lists</span>
          </div>
          <div>
            <b>{items}</b>
            <span>Items</span>
          </div>
          <div>
            <b>5,2 kg</b>
            <span>Meat</span>
          </div>
          <div>
            <b>54 L</b>
            <span>Water</span>
          </div>
        </div>
      </header>

      <section style={{ paddingTop: "1.4rem" }}>
        <PackList groups={trip.shop} slug={trip.slug} storeKey="shop" />
        {trip.shopNotes && (
          <ul className="flags" style={{ marginTop: "1.4rem" }}>
            {trip.shopNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        )}
      </section>

      <footer>
        <p className="fine">
          <Link href={`/trips/${trip.slug}`}>← Back to the plan</Link>
        </p>
      </footer>
    </div>
  );
}

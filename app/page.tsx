import Link from "next/link";
import { trips } from "@/trips";

export default function Home() {
  return (
    <div className="idx">
      <header className="phead">
        <span className="blz" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <h1>Trips</h1>
        <p className="fine">Maps, timings, parking, packing. One page each.</p>
      </header>

      <section style={{ paddingTop: "1.4rem" }}>
        <div className="trips">
          {trips.map((trip) => (
            <Link className="trip" href={`/trips/${trip.slug}`} key={trip.slug}>
              <span className="td">{trip.dates}</span>
              <span className="tt">
                {trip.title} <span>{trip.titleAccent}</span> {trip.titleTail}
              </span>
              <span className="fine">{trip.blurb}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

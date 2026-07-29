"use client";

import { useEffect, useState } from "react";
import DayTimeline from "@/components/DayTimeline";
import PackList from "@/components/PackList";
import PinTable from "@/components/PinTable";
import TripMap from "@/components/TripMap";
import { getTrip } from "@/trips";

export default function TripView({ slug }: { slug: string }) {
  const trip = getTrip(slug);
  const [active, setActive] = useState(trip?.maps[0]?.id ?? "");

  // Scrollspy: whichever [data-map] block sits in the middle band of the viewport
  // decides what the sticky map shows.
  useEffect(() => {
    const blocks = Array.from(document.querySelectorAll<HTMLElement>("[data-map]"));
    if (!blocks.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).at(0);
        const id = (hit?.target as HTMLElement | undefined)?.dataset.map;
        if (id) setActive(id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    blocks.forEach((b) => io.observe(b));
    return () => io.disconnect();
  }, []);

  if (!trip) return null;

  return (
    <div className="split">
      <div className="mappane">
        <TripMap views={trip.maps} activeId={active} waypoints={trip.waypoints} />
        <div className="mtabs" role="tablist" aria-label="Map view">
          {trip.maps.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={m.id === active}
              onClick={() => setActive(m.id)}
            >
              {m.title}
            </button>
          ))}
        </div>
      </div>

      <div className="plan">
        <header className="phead" data-map="overview">
          <span className="blz" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <h1>
            {trip.title} <span>{trip.titleAccent}</span> {trip.titleTail}
          </h1>
          <p className="fine">{trip.subtitle}</p>
          <div className="stats">
            {trip.stats.map((s) => (
              <div key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </header>

        <section>
          <div className="hd">
            <b>01</b>
            <h2>Days</h2>
          </div>
          <DayTimeline days={trip.days} activeMapId={active} />
        </section>

        <section data-map="overview">
          <div className="hd">
            <b>02</b>
            <h2>Pins &amp; parking</h2>
          </div>
          <PinTable pins={trip.pins} />
          {trip.pinsNote && (
            <p className="fine" style={{ marginTop: ".7rem" }}>
              {trip.pinsNote}
            </p>
          )}

          <h2 style={{ margin: "1.7rem 0 .7rem" }}>{trip.flagsTitle}</h2>
          <ul className="flags">
            {trip.flags.map((flag, i) => (
              <li key={i}>{flag}</li>
            ))}
          </ul>
        </section>

        <section>
          <div className="hd">
            <b>03</b>
            <h2>Pack</h2>
          </div>
          <PackList groups={trip.pack} slug={trip.slug} />
        </section>

        <section>
          <div className="hd">
            <b>04</b>
            <h2>Before you go</h2>
          </div>
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Do</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {trip.prep.map((row, i) => (
                  <tr key={i}>
                    <td>{row.what}</td>
                    <td className="mono">{row.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer>
          <p className="fine">
            {trip.sources.map((s, i) => (
              <span key={s.href}>
                {i > 0 && " · "}
                <a href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </span>
            ))}
            {trip.sourcesNote && ` — ${trip.sourcesNote}`}
          </p>
        </footer>
      </div>
    </div>
  );
}

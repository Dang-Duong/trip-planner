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

  // Scrollspy: the last [data-map] block whose top has passed an anchor line near the
  // top of the reading column wins. Anchoring at the top rather than mid-viewport
  // matters — on a tall window the middle of the screen is already inside Saturday
  // while the page is still scrolled to the very top, which showed the wrong map first.
  useEffect(() => {
    const blocks = Array.from(document.querySelectorAll<HTMLElement>("[data-map]"));
    if (!blocks.length) return;

    let raf = 0;
    const pick = () => {
      raf = 0;
      // In the stacked layout the map is stuck across the top of the viewport, so the
      // anchor has to sit below it. Measured rather than hard-coding the breakpoint:
      // side by side, the pane is full height and its bottom is the viewport bottom.
      const pane = document.querySelector<HTMLElement>(".mappane");
      const paneBottom = pane ? pane.getBoundingClientRect().bottom : 0;
      const top = paneBottom < window.innerHeight - 1 ? paneBottom : 0;
      const line = top + (window.innerHeight - top) * 0.3;
      let current = blocks[0];
      for (const b of blocks) {
        if (b.getBoundingClientRect().top <= line) current = b;
      }
      if (current.dataset.map) setActive(current.dataset.map);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(pick);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
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
              // Scroll to the day this map belongs to; the scrollspy then sets `active`.
              // Falling back to setActive keeps maps with no day of their own usable.
              onClick={() => {
                const target = document.querySelector<HTMLElement>(`.chapter[data-map="${m.id}"]`);
                if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
                else setActive(m.id);
              }}
            >
              {m.title}
            </button>
          ))}
        </div>
      </div>

      <div className="plan">
        {/* One full-height chapter per day: the map on the left follows whichever
            day you have scrolled to, and the column snaps between them. */}
        {trip.days.map((day, i) => (
          <div className="chapter" key={day.date} data-map={day.mapId}>
            {i === 0 && (
              <header className="phead">
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
            )}
            <div className="chapter-head">
              <b>{String(i + 1).padStart(2, "0")}</b>
              <h2>
                Day {i + 1} of {trip.days.length}
              </h2>
            </div>
            <DayTimeline day={day} />
          </div>
        ))}

        <section data-map="overview">
          <div className="hd">
            <b>01</b>
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
            <b>02</b>
            <h2>Pack</h2>
          </div>
          <PackList groups={trip.pack} slug={trip.slug} />
        </section>

        <section>
          <div className="hd">
            <b>03</b>
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

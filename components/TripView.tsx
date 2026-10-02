"use client";

import { useRef, useState } from "react";
import DayTimeline, { More } from "@/components/DayTimeline";
import { swap, useTab } from "@/components/Dock";
import PackList from "@/components/PackList";
import TripMap, { BASEMAP_CHOICES, type Basemap } from "@/components/TripMap";
import type { LngLat } from "@/lib/types";
import { getTrip } from "@/trips";

export default function TripView({ slug }: { slug: string }) {
  const trip = getTrip(slug);
  const tab = useTab();
  const [dayIdx, setDayIdx] = useState(0);
  const [trail, setTrail] = useState<LngLat[] | undefined>(undefined);
  const [basemap, setBasemap] = useState<Basemap>("satellite");
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [open, setOpen] = useState(false);
  const dragY = useRef(0);
  const drag = {
    onTouchStart: (e: React.TouchEvent) => (dragY.current = e.touches[0].clientY),
    onTouchEnd: (e: React.TouchEvent) => {
      const dy = e.changedTouches[0].clientY - dragY.current;
      if (Math.abs(dy) > 30) setOpen(dy < 0);
    },
  };

  if (!trip) return null;
  const day = trip.days[dayIdx];
  const go = (i: number) => {
    if (i < 0 || i >= trip.days.length || i === dayIdx) return;
    swap(() => {
      setDayIdx(i);
      setTrail(undefined);
    }, Math.sign(i - dayIdx));
  };
  const mapId = tab === "plan" ? (day.mapId ?? trip.maps[0].id) : trip.maps[0].id;

  return (
    <div className="app">
      <div className="stage">
        <TripMap
          views={trip.maps}
          activeId={mapId}
          waypoints={trip.waypoints}
          trail={trail}
          basemap={basemap}
        />
        <div className="basemaps" role="group" aria-label="Base map">
          {BASEMAP_CHOICES.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={basemap === c.id}
              onClick={() => setBasemap(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <aside className="sheet" data-open={open}>
        <button
          type="button"
          className="grip"
          aria-label={open ? "Show more map" : "Show more plan"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          {...drag}
        />
        <header className="sheet-top" {...drag}>
          <h1>
            {trip.title} <span>{trip.titleAccent}</span> {trip.titleTail}
          </h1>
          <p>{trip.dates}</p>
        </header>

        {tab === "plan" && (
          <div
            className="pills"
            role="tablist"
            aria-label="Day"
            style={{ "--i": dayIdx, "--n": trip.days.length } as React.CSSProperties}
          >
            <span className="pill-mark" aria-hidden="true" />
            {trip.days.map((d, i) => (
              <button
                key={d.date}
                role="tab"
                aria-selected={i === dayIdx}
                onClick={() => go(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") go(dayIdx + 1);
                  if (e.key === "ArrowLeft") go(dayIdx - 1);
                }}
              >
                <b>{d.date}</b>
                <span>{d.title.split(" · ")[0]}</span>
              </button>
            ))}
          </div>
        )}

        <div
          className="sheet-body"
          onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
          onTouchEnd={(e) => {
            const t = touch.current;
            if (!t || tab !== "plan") return;
            const dx = e.changedTouches[0].clientX - t.x;
            const dy = e.changedTouches[0].clientY - t.y;
            if (Math.abs(dx) > 60 && Math.abs(dx) > 2 * Math.abs(dy)) go(dayIdx - Math.sign(dx));
          }}
        >
          {tab === "plan" && (
            <div key={day.date}>
              <div className="day-head">
                <h2>{day.title.split(" · ").slice(1).join(" · ")}</h2>
                <p className="day-meta">{day.meta}</p>
              </div>
              <DayTimeline day={day} onOption={(opt) => setTrail(opt?.line)} />
            </div>
          )}

          {tab === "places" && (
            <div>
              <h2 className="sec">Stops</h2>
              <ul className="rows">
                {trip.pins.map((pin, i) => (
                  <li key={i}>
                    <details className="fold">
                      <summary>
                        <i>{pin.when}</i>
                        <span>{pin.what}</span>
                        <em>{pin.cost === "—" ? "" : pin.cost}</em>
                      </summary>
                      <div className="fold-body">
                        {pin.sub && <p>{pin.sub}</p>}
                        <a className="go" href={pin.href} target="_blank" rel="noreferrer">
                          Open in Maps
                        </a>
                      </div>
                    </details>
                  </li>
                ))}
              </ul>

              <h2 className="sec">Hikes</h2>
              <div className="hikes">
                {trip.hikes.map((h) => (
                  <a className="hike" key={h.href} href={h.href} target="_blank" rel="noreferrer">
                    <b>{h.name}</b>
                    <span>{h.when}</span>
                    <dl>
                      <div><dt>km</dt><dd>{h.km}</dd></div>
                      <div><dt>up</dt><dd>{h.ascent}</dd></div>
                      <div><dt>time</dt><dd>{h.time}</dd></div>
                      <div><dt>top</dt><dd>{h.high}</dd></div>
                    </dl>
                  </a>
                ))}
              </div>
              {trip.hikesNote && <More>{trip.hikesNote}</More>}

              <h2 className="sec">{trip.flagsTitle}</h2>
              <ul className="rows">
                {trip.flags.map((flag, i) => (
                  <li key={i}>
                    <details className="fold">
                      <summary>
                        <span>{flag}</span>
                      </summary>
                    </details>
                  </li>
                ))}
              </ul>
              {trip.pinsNote && <p className="fine">{trip.pinsNote}</p>}
            </div>
          )}

          {tab === "pack" && (
            <div>
              <h2 className="sec">Pack</h2>
              <PackList groups={trip.pack} slug={trip.slug} />
              <h2 className="sec">Before you go</h2>
              <ul className="rows">
                {trip.prep.map((row, i) => (
                  <li key={i}>
                    <details className="fold">
                      <summary>
                        <i>{row.when}</i>
                        <span>{row.what}</span>
                      </summary>
                    </details>
                  </li>
                ))}
              </ul>
              <p className="fine sources">
                {trip.sources.map((s, i) => (
                  <span key={s.href}>
                    {i > 0 && ", "}
                    <a href={s.href} target="_blank" rel="noreferrer">
                      {s.label}
                    </a>
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>

      </aside>
    </div>
  );
}

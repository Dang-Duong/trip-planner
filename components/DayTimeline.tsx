import type { Day } from "@/lib/types";

export default function DayTimeline({
  days,
  activeMapId,
}: {
  days: Day[];
  activeMapId?: string;
}) {
  return (
    <div className="days">
      {days.map((day) => (
        <article
          className="day"
          key={day.date}
          data-map={day.mapId}
          data-active={day.mapId != null && day.mapId === activeMapId}
        >
          <div className="dh">
            <span className="d">{day.date}</span>
            <span className="t">{day.title}</span>
            <span className="m">{day.meta}</span>
          </div>
          {day.legs.map((leg, i) => (
            <div className="leg" key={i}>
              <i>{leg.time}</i>
              <span>{leg.text}</span>
            </div>
          ))}
          {day.note && <div className="fine">{day.note}</div>}
        </article>
      ))}
    </div>
  );
}

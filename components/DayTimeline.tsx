import type { Day } from "@/lib/types";

export default function DayTimeline({ day }: { day: Day }) {
  return (
    <article className="day">
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
  );
}

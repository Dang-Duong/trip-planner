import type { Day, Leg } from "@/lib/types";

const Legs = ({ legs }: { legs: Leg[] }) => (
  <>
    {legs.map((leg, i) => (
      <div className="leg" key={i}>
        <i>{leg.time}</i>
        <span>{leg.text}</span>
      </div>
    ))}
  </>
);

export default function DayTimeline({ day }: { day: Day }) {
  return (
    <article className="day">
      <div className="dh">
        <span className="d">{day.date}</span>
        <span className="t">{day.title}</span>
        <span className="m">{day.meta}</span>
      </div>

      {day.options ? (
        day.options.map((opt, i) => (
          <div className="opt" key={opt.name}>
            <div className="opt-h">
              <span className="opt-tag">{String.fromCharCode(65 + i)}</span>
              {opt.href ? (
                <a className="opt-name" href={opt.href} target="_blank" rel="noreferrer">
                  {opt.name} ↗
                </a>
              ) : (
                <span className="opt-name">{opt.name}</span>
              )}
              <span className="opt-meta">{opt.meta}</span>
            </div>
            <Legs legs={opt.legs} />
            {opt.note && <div className="fine">{opt.note}</div>}
          </div>
        ))
      ) : (
        <Legs legs={day.legs} />
      )}

      {day.note && <div className="fine">{day.note}</div>}
    </article>
  );
}

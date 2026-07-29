import type { Day, DayOption, Leg } from "@/lib/types";

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

export default function DayTimeline({
  day,
  onOption,
}: {
  day: Day;
  /** Called with the option under the pointer (or keyboard focus), null on leave. */
  onOption?: (opt: DayOption | null) => void;
}) {
  return (
    <article className="day">
      <div className="dh">
        <span className="d">{day.date}</span>
        <span className="t">{day.title}</span>
        <span className="m">{day.meta}</span>
      </div>

      {day.options ? (
        day.options.map((opt, i) => (
          <div
            className="opt"
            key={opt.name}
            // Focus is included so tabbing to the komoot link draws the trail too.
            onMouseEnter={() => onOption?.(opt)}
            onMouseLeave={() => onOption?.(null)}
            onFocus={() => onOption?.(opt)}
            onBlur={() => onOption?.(null)}
          >
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

import { useState } from "react";
import type { Day, DayOption, Leg } from "@/lib/types";

const Legs = ({ legs }: { legs: Leg[] }) => (
  <ol className="legs">
    {legs.map((leg, i) => (
      <li key={i}>
        <details className="fold">
          <summary>
            <i>{leg.time}</i>
            <span>{leg.text}</span>
          </summary>
        </details>
      </li>
    ))}
  </ol>
);

export default function DayTimeline({
  day,
  onOption,
}: {
  day: Day;
  onOption?: (opt: DayOption | null) => void;
}) {
  const [pick, setPick] = useState(0);
  const opt = day.options?.[pick];

  return (
    <article className="day">
      {day.options && (
        <div className="seg" role="tablist" aria-label="Route options">
          {day.options.map((o, i) => (
            <button
              key={o.name}
              role="tab"
              aria-selected={i === pick}
              onClick={() => {
                setPick(i);
                onOption?.(o);
              }}
            >
              {o.name}
            </button>
          ))}
        </div>
      )}
      {opt ? (
        <>
          <p className="day-meta">
            {opt.meta}
            {opt.href && (
              <a href={opt.href} target="_blank" rel="noreferrer">
                komoot
              </a>
            )}
          </p>
          <Legs legs={opt.legs} />
          {opt.note && <More>{opt.note}</More>}
        </>
      ) : (
        <Legs legs={day.legs} />
      )}
      {day.note && <More>{day.note}</More>}
    </article>
  );
}

export const More = ({ children }: { children: React.ReactNode }) => (
  <details className="more">
    <summary>Notes</summary>
    <div>{children}</div>
  </details>
);

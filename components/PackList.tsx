"use client";

import { useMemo } from "react";
import { useChecklist } from "@/lib/local-state";
import type { PackGroup } from "@/lib/types";

export default function PackList({ groups, slug }: { groups: PackGroup[]; slug: string }) {
  const { done, toggle, clear } = useChecklist(`pack:${slug}:v2`);

  const ids = useMemo(
    () => groups.flatMap((g, gi) => g.items.map((_, ii) => `${gi}.${ii}`)),
    [groups],
  );

  const count = ids.filter((id) => done.has(id)).length;

  return (
    <>
      <div className="bar">
        <span className="mono fine" id="pack-count">
          {count} / {ids.length}
        </span>
        <span
          className="pr"
          role="progressbar"
          aria-labelledby="pack-count"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={ids.length}
        >
          <i style={{ width: `${ids.length ? (count / ids.length) * 100 : 0}%` }} />
        </span>
        <button type="button" onClick={clear}>
          Clear
        </button>
      </div>

      <div className="pack">
        {groups.map((group, gi) => (
          <div className="pc" key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item, ii) => {
                const id = `${gi}.${ii}`;
                return (
                  <li key={id}>
                    <label>
                      <input
                        className="tick"
                        type="checkbox"
                        checked={done.has(id)}
                        onChange={() => toggle(id)}
                      />
                      <span>
                        {item.label}
                        {item.sub && <s>{item.sub}</s>}
                      </span>
                      {item.qty && <b className="pc-qty">{item.qty}</b>}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

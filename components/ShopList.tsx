"use client";

import { useChecklist } from "@/lib/local-state";
import type { ShopGroup } from "@/lib/types";

export default function ShopList({
  groups,
  slug,
  boughtLabel,
  resetLabel,
}: {
  groups: ShopGroup[];
  slug: string;
  boughtLabel: string;
  resetLabel: string;
}) {
  const { done, toggle, clear } = useChecklist(`shop:${slug}:v3`);

  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const bought = groups.reduce(
    (n, g, gi) => n + g.items.filter((_, ii) => done.has(`${gi}.${ii}`)).length,
    0,
  );

  return (
    <>
      <div className="shop-bar">
        <span className="shop-tally" id="shop-count">
          <b>{bought}</b>
          <i>
            / {total} {boughtLabel}
          </i>
        </span>
        <span
          className="shop-pr"
          role="progressbar"
          aria-labelledby="shop-count"
          aria-valuenow={bought}
          aria-valuemin={0}
          aria-valuemax={total}
        >
          <i style={{ width: `${total ? (bought / total) * 100 : 0}%` }} />
        </span>
        <button type="button" onClick={clear}>
          {resetLabel}
        </button>
      </div>

      {/* Multi-column rather than grid: the blocks run from three items to ten, and a grid
          row sizes every card to the tallest in it, which left half of them as voids. */}
      <div className="shop-cols">
        {groups.map((group, gi) => {
          const got = group.items.filter((_, ii) => done.has(`${gi}.${ii}`)).length;
          const complete = got === group.items.length;

          return (
            <article className="sc" key={group.title} data-complete={complete}>
              <header className="sc-head">
                <div>
                  <h3>{group.title}</h3>
                  {group.hint && <span className="sc-job">{group.hint}</span>}
                </div>
                <span className="sc-n" aria-label={`${got} / ${group.items.length} ${boughtLabel}`}>
                  {got}
                  <i>/{group.items.length}</i>
                </span>
              </header>

              {group.note && <p className="sc-note">{group.note}</p>}

              <ul className="sc-items">
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
                        <span className="sc-txt">
                          {item.label}
                          {item.sub && <s>{item.sub}</s>}
                        </span>
                        {item.qty && <b className="sc-qty">{item.qty}</b>}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </article>
          );
        })}
      </div>
    </>
  );
}

"use client";

import { useChecklist } from "@/lib/checklist";
import type { ShopPerson } from "@/lib/types";

export default function ShopList({ people, slug }: { people: ShopPerson[]; slug: string }) {
  const { done, toggle, clear } = useChecklist(`shop:${slug}:v1`);

  const total = people.reduce((n, p) => n + p.items.length, 0);
  const bought = people.reduce(
    (n, p, pi) => n + p.items.filter((_, ii) => done.has(`${pi}.${ii}`)).length,
    0,
  );

  return (
    <>
      <div className="shop-bar">
        <span className="shop-tally" id="shop-count">
          <b>{bought}</b>
          <i>/ {total} bought</i>
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
          Reset
        </button>
      </div>

      {/* Multi-column rather than grid: the lists run from one item to eight, and a grid
          row sizes every card to the tallest in it, which left half of them as voids. */}
      <div className="shop-cols">
        {people.map((person, pi) => {
          const mine = person.items.filter((_, ii) => done.has(`${pi}.${ii}`)).length;
          const complete = mine === person.items.length;

          return (
            <article className="sc" key={person.name} data-complete={complete}>
              <header className="sc-head">
                <div>
                  <h3>{person.name}</h3>
                  <span className="sc-job">{person.job}</span>
                </div>
                <span className="sc-n" aria-label={`${mine} of ${person.items.length} bought`}>
                  {mine}
                  <i>/{person.items.length}</i>
                </span>
              </header>

              {person.note && <p className="sc-note">{person.note}</p>}

              <ul className="sc-items">
                {person.items.map((item, ii) => {
                  const id = `${pi}.${ii}`;
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

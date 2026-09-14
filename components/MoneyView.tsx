"use client";

import { useMemo, useState } from "react";
import Fab, { ARROW } from "@/components/Fab";
import { useStoredJson } from "@/lib/local-state";
import { balances, RATES, settle, toCzk, type Currency, type Expense } from "@/lib/split";
import { getTrip } from "@/trips";

const CURRENCIES = Object.keys(RATES) as Currency[];
const NO_EXPENSES: Expense[] = [];

/** Whole crowns in, "1 240" out. cs-CZ groups with a non-breaking space, which is what
 *  we want — an amount should never wrap across two lines. */
const fmt = (czk: number) => czk.toLocaleString("cs-CZ");

export default function MoneyView({ slug }: { slug: string }) {
  const trip = getTrip(slug);
  const people = useMemo(() => trip?.shop.en.people.map((p) => p.name) ?? [], [trip]);

  const [expenses, write] = useStoredJson<Expense[]>(`money:${slug}:v1`, NO_EXPENSES);
  const [what, setWhat] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("CZK");
  const [payer, setPayer] = useState("");
  const [shares, setShares] = useState<string[]>([]);

  const net = useMemo(() => balances(expenses, people), [expenses, people]);
  const transfers = useMemo(() => settle(net), [net]);
  const total = expenses.reduce((n, e) => n + toCzk(e), 0);

  if (!trip) return null;

  // Anyone on a list that includes alcohol; the three youngest are the ones this exists for.
  const drinkers = people.filter((p) => !["Chipi", "Tuty", "Meloun"].includes(p));

  const valid = Number(amount) > 0 && payer && shares.length > 0;

  const add = () => {
    if (!valid) return;
    write((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        what: what.trim() || "Shopping",
        amount: Math.round(Number(amount) * 100),
        currency,
        payer,
        shares,
      },
    ]);
    setWhat("");
    setAmount("");
    // Payer and shares persist — several receipts in a row are usually the same
    // person and the same group. Currency does not: a CZK amount left on EUR is a
    // silently 25x wrong receipt.
    setCurrency("CZK");
  };

  const summary = [
    `${trip.title} ${trip.titleTail} — settle up`,
    `Total ${fmt(total)} Kč across ${expenses.length} receipts`,
    "",
    ...transfers.map((t) => `${t.from} → ${t.to}: ${fmt(t.amount)} Kč`),
  ].join("\n");

  return (
    <div className="shop">
      <header className="shop-head">
        <div className="shop-top">
          <span className="blz" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
        <h1>Who owes whom</h1>
        <p className="shop-sub">
          {trip.title} {trip.titleAccent} {trip.titleTail} · {trip.dates}
        </p>
        <p className="shop-lede">
          Put in what a receipt came to and tick who it was for. Untick the three youngest on
          anything alcoholic and they stop paying for it. Everything nets off at the bottom into
          the fewest payments.
        </p>
        <p className="money-warn">
          This is kept on <b>this device only</b>, like the tick boxes — so one person keeps the
          book and shares the summary. Say the word and I will make it shared.
        </p>
      </header>

      <section className="money-add">
        <h2>Add a receipt</h2>
        <div className="money-row">
          <label className="money-f money-f-wide">
            <span>What</span>
            <input
              id="money-what"
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              placeholder="Meat, soju, water…"
            />
          </label>
          <label className="money-f">
            <span>Amount</span>
            <input
              id="money-amount"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(",", "."))}
              placeholder="1240"
            />
          </label>
          <label className="money-f">
            <span>Currency</span>
            <select
              id="money-currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="money-f">
            <span>Who paid</span>
            <select id="money-payer" value={payer} onChange={(e) => setPayer(e.target.value)}>
              <option value="">Pick…</option>
              {people.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="money-who">
          <div className="money-who-h">
            <span>Split between</span>
            <div className="money-presets">
              <button type="button" onClick={() => setShares(people)}>
                Everyone
              </button>
              <button type="button" onClick={() => setShares(drinkers)}>
                No alcohol for the youngest
              </button>
              <button type="button" onClick={() => setShares([])}>
                None
              </button>
            </div>
          </div>
          <ul className="money-people">
            {people.map((p) => (
              <li key={p}>
                <label>
                  <input
                    className="tick"
                    type="checkbox"
                    checked={shares.includes(p)}
                    onChange={() =>
                      setShares(
                        shares.includes(p) ? shares.filter((x) => x !== p) : [...shares, p],
                      )
                    }
                  />
                  <span>{p}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <button type="button" className="money-add-btn" disabled={!valid} onClick={add}>
          Add {Number(amount) > 0 ? `${amount} ${currency}` : "receipt"}
          {shares.length > 0 && ` · split ${shares.length} ways`}
        </button>
      </section>

      {expenses.length > 0 && (
        <>
          <section className="money-list">
            <h2>
              Receipts <i>{fmt(total)} Kč</i>
            </h2>
            <ul>
              {expenses.map((e) => (
                <li key={e.id}>
                  <b>{e.what}</b>
                  <span className="money-meta">
                    {e.payer} paid · {e.shares.length} ways
                  </span>
                  <span className="money-amt">
                    {fmt(toCzk(e))} Kč
                    {e.currency !== "CZK" && <i>{(e.amount / 100).toFixed(2)} {e.currency}</i>}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${e.what}`}
                    onClick={() => write((prev) => prev.filter((x) => x.id !== e.id))}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="money-bal">
            <h2>Where everyone stands</h2>
            <ul>
              {people.map((p) => {
                const v = net.get(p) ?? 0;
                return (
                  <li key={p} data-state={v > 0 ? "up" : v < 0 ? "down" : "flat"}>
                    <span>{p}</span>
                    <b>
                      {v > 0 ? "+" : ""}
                      {fmt(v)}
                    </b>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="money-settle">
            <h2>Settle up</h2>
            {transfers.length === 0 ? (
              <p className="shop-lede">Everyone is square.</p>
            ) : (
              <ol>
                {transfers.map((t, i) => (
                  <li key={i}>
                    <b>{t.from}</b>
                    <span aria-hidden="true">→</span>
                    <b>{t.to}</b>
                    <i>{fmt(t.amount)} Kč</i>
                  </li>
                ))}
              </ol>
            )}
            <button
              type="button"
              className="money-copy"
              onClick={() => navigator.clipboard?.writeText(summary)}
            >
              Copy for the group chat
            </button>
          </section>
        </>
      )}

      <Fab
        variant="back"
        href={`/trips/${trip.slug}/shop`}
        label="Back to the lists"
        sub="Who buys what"
        icon={ARROW}
      />
    </div>
  );
}

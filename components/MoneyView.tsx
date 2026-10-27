"use client";

import qrcode from "qrcode-generator";
import { sileo, Toaster } from "sileo";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Select from "@/components/Select";
import SyncBadge from "@/components/SyncBadge";
import { useStoredChoice } from "@/lib/local-state";
import { showAccount, spayd, toIban } from "@/lib/payment";
import { useSharedEntries } from "@/lib/shared-state";
import {
  balances,
  breakdown,
  detectCurrency,
  parseAmount,
  RATES,
  sanitizeExpenses,
  settle,
  toCzk,
  type Line,
  type Transfer,
  type Currency,
  type Expense,
} from "@/lib/split";
import type { Entry } from "@/lib/sync-ops";
import { getTrip } from "@/trips";

const ACCT = "acct:";
const LOOKING = "*";
const noop = () => () => {};

const CURRENCIES = Object.keys(RATES) as Currency[];

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/** Minor units in the entered currency -> "1 240" or "46,50". */
const fmtAmount = (minor: number) =>
  (minor / 100).toLocaleString("cs-CZ", {
    minimumFractionDigits: minor % 100 ? 2 : 0,
    maximumFractionDigits: 2,
  });

/** Whole crowns in, "1 240" out. cs-CZ groups with a non-breaking space, which is what
 *  we want — an amount should never wrap across two lines. */
const fmt = (czk: number) => czk.toLocaleString("cs-CZ");

export default function MoneyView({ slug }: { slug: string }) {
  const trip = getTrip(slug);
  const people = useMemo(() => trip?.people ?? [], [trip]);

  const [stored, writeRaw, sync, pending] = useSharedEntries(slug);
  const expenses = useMemo(() => sanitizeExpenses(stored), [stored]);
  // Every write goes through the sanitiser too, so an updater never builds on junk.
  // Accounts share the store but aren't expenses: carry them over, or the diff deletes them.
  const write = (next: (prev: Expense[]) => Expense[]) =>
    writeRaw((prev: Entry[]) => [
      ...prev.filter((e) => e.id.startsWith(ACCT)),
      ...next(sanitizeExpenses(prev)),
    ]);
  const saveAccount = (person: string, iban: string | null) =>
    writeRaw((prev: Entry[]) => [
      ...prev.filter((e) => e.id !== ACCT + person),
      ...(iban ? [{ id: ACCT + person, iban }] : []),
    ]);
  const accounts = useMemo(() => {
    const out = new Map<string, string>();
    for (const e of Array.isArray(stored) ? (stored as Entry[]) : []) {
      const who = e.id.slice(ACCT.length);
      const iban = typeof e.iban === "string" ? toIban(e.iban) : null;
      if (e.id.startsWith(ACCT) && iban && people.includes(who))
        out.set(who, iban);
    }
    return out;
  }, [stored, people]);
  const [what, setWhat] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("CZK");
  const [payer, setPayer] = useState("");
  const [shares, setShares] = useState<string[]>([]);
  const [armed, setArmed] = useState<string | null>(null);
  const [why, setWhy] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [live, setLive] = useState<{ date: string; rates: Partial<Record<Currency, number>> }>();
  useEffect(() => {
    const check = () =>
      document.visibilityState === "visible" &&
      fetch("/api/rates")
        .then((r) => (r.ok ? r.json() : undefined))
        .then((next) => next && setLive(next))
        .catch(() => {});
    check();
    document.addEventListener("visibilitychange", check);
    return () => document.removeEventListener("visibilitychange", check);
  }, []);
  // Receipts from before rates were stored get the day's rate once, then keep it.
  useEffect(() => {
    const stamp = (e: Expense) => (e.currency === "CZK" || e.rate ? undefined : live?.rates[e.currency]);
    if (!expenses.some(stamp)) return;
    write((prev) => prev.map((e) => (stamp(e) ? { ...e, rate: stamp(e) } : e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- write is rebuilt every render
  }, [live, expenses]);
  const rate = currency === "CZK" ? undefined : (live?.rates[currency] ?? RATES[currency]);
  // "" = never asked, LOOKING = asked and skipped, otherwise a name on the trip.
  const whoOptions = useMemo(() => ["", LOOKING, ...people], [people]);
  const [who, setWho] = useStoredChoice(`money-me:${slug}`, whoOptions, "");
  const me = people.includes(who) ? who : "";
  const [switching, setSwitching] = useState(false);
  // The server can't see localStorage, so only ask once the stored answer has been read.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const asking = switching || (hydrated && who === "");
  const answer = (name: string | null) => {
    setWho(name ?? (who || LOOKING));
    setSwitching(false);
  };
  const mine = (e: Expense) => !me || e.payer === me || e.shares.includes(me);

  const net = useMemo(() => balances(expenses, people), [expenses, people]);
  const transfers = useMemo(
    () =>
      settle(
        net,
        balances(
          expenses.filter((e) => !e.settlement),
          people,
        ),
      ),
    [net, expenses, people],
  );
  const shown = me
    ? transfers.filter((t) => t.from === me || t.to === me)
    : transfers;

  // An expense can only name someone off the list if the trip data was renamed under it
  // (or storage was hand-edited). `balances` skips those rather than invent money — so
  // the header must not count them either, or the total won't match the split.
  const counts = (e: Expense) =>
    people.includes(e.payer) && e.shares.some((p) => people.includes(p));

  const receipts = expenses.filter((e) => !e.settlement);
  const payments = expenses.filter((e) => e.settlement);
  const total = receipts.filter(counts).reduce((n, e) => n + toCzk(e), 0);

  const paidButton = (t: Transfer) => {
    const key = `${t.from}>${t.to}`;
    return (
      <button
        type="button"
        className="money-paid"
        data-armed={armed === key}
        onBlur={() => setArmed(null)}
        onClick={() => {
          if (armed !== key) return setArmed(key);
          setArmed(null);
          markPaid(t.from, t.to, t.amount);
        }}
      >
        {armed === key ? `Confirm ${fmt(t.amount)} Kč?` : "Mark paid"}
      </button>
    );
  };

  const markPaid = (from: string, to: string, amount: number) =>
    write((prev) => [
      ...prev,
      {
        id: newId(),
        what: `${from} → ${to}`,
        amount: amount * 100,
        currency: "CZK",
        payer: from,
        shares: [to],
        settlement: true,
      },
    ]);

  if (!trip) return null;

  const drinkers = people.filter((p) => !trip.noAlcohol?.includes(p));

  const parsed = parseAmount(amount);
  const unreadable = amount.trim() !== "" && parsed === null;
  const valid = parsed !== null && payer !== "" && shares.length > 0;

  const add = () => {
    if (!valid || parsed === null) return;
    write((prev) => [
      ...prev,
      {
        id: newId(),
        what: what.trim() || "Shopping",
        amount: parsed,
        currency,
        ...(rate ? { rate } : {}),
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
      <Toaster position="top-center" theme="dark" />
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
          Put in what a receipt came to and tick who it was for.
          {trip.noAlcohol?.length
            ? " Untick the youngest two on anything alcoholic and they stop paying for it."
            : ""}{" "}
          Everything nets off at the bottom into the fewest payments.
        </p>
        <p className="money-warn">
          Receipts are <b>shared with everyone</b> on this page. Add one with no signal and it is kept on your phone
          until you have bars again — the badge says so while it waits.{" "}
          <SyncBadge sync={sync} pending={pending} />
        </p>
        <p className="who-chip">
          {me ? (
            <span>
              You&apos;re <b>{me}</b>
            </span>
          ) : (
            <span>Viewing everyone</span>
          )}
          <button type="button" onClick={() => setSwitching(true)}>
            {me ? "Switch" : "Pick your name"}
          </button>
        </p>
      </header>

      <WhoSheet people={people} me={me} open={asking} answer={answer} />

      {me && (
        <section className="money-me">
          {receipts.length > 0 && (
            <>
              <p className="money-me-sum">
                {(net.get(me) ?? 0) < 0
                  ? `You owe ${fmt(-(net.get(me) ?? 0))} Kč`
                  : (net.get(me) ?? 0) > 0
                    ? `You get back ${fmt(net.get(me) ?? 0)} Kč`
                    : "You're square — nothing to pay"}
              </p>
              <ul className="money-me-list">
                {transfers
                  .filter((t) => t.from === me)
                  .map((t) => (
                    <li key={`${t.from}>${t.to}`}>
                      <b>Pay {t.to}</b>
                      <i>{fmt(t.amount)} Kč</i>
                      {accounts.has(t.to) ? (
                        <PayQr
                          iban={accounts.get(t.to)!}
                          to={t.to}
                          amount={t.amount}
                          message={`${trip.title} ${t.from} -> ${t.to}`}
                        />
                      ) : (
                        <p className="money-me-note">
                          {`${t.to} hasn't added an account yet — ask them for it, or pay the usual way.`}
                        </p>
                      )}
                      {paidButton(t)}
                    </li>
                  ))}
                {transfers
                  .filter((t) => t.to === me)
                  .map((t) => (
                    <li key={`${t.from}>${t.to}`} data-incoming="true">
                      <b>{t.from} pays you</b>
                      <i>{fmt(t.amount)} Kč</i>
                    </li>
                  ))}
              </ul>
            </>
          )}
          <AccountField
            key={`${me}:${accounts.get(me) ?? ""}`}
            iban={accounts.get(me)}
            save={(iban) => saveAccount(me, iban)}
          />
        </section>
      )}

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
              onChange={(e) => {
                setAmount(e.target.value);
                const named = detectCurrency(e.target.value);
                if (named) setCurrency(named);
              }}
              aria-invalid={unreadable}
              aria-describedby={unreadable ? "money-amount-hint" : undefined}
              placeholder="1 240,50"
            />
            {unreadable && (
              <i id="money-amount-hint" className="money-hint">
                Can’t read that — try 1 240 or 1240,50
              </i>
            )}
          </label>
          <label className="money-f">
            <span>Currency</span>
            <Select
              value={currency}
              onChange={(c) => setCurrency(c as Currency)}
              options={CURRENCIES.map((c) => ({ value: c, label: c }))}
            />
            {rate && (
              <i className="money-hint money-rate">
                1 {currency} = {rate.toLocaleString("cs-CZ")} Kč
                {live?.rates[currency] ? ` · ČNB ${live.date}` : " · offline guess"}
              </i>
            )}
          </label>
          <label className="money-f">
            <span>Who paid</span>
            <Select
              value={payer}
              onChange={setPayer}
              options={[{ value: "", label: "Pick…" }, ...people.map((p) => ({ value: p, label: p }))]}
            />
          </label>
        </div>

        <div className="money-who">
          <div className="money-who-h">
            <span>Split between</span>
            <div className="money-presets">
              <button type="button" onClick={() => setShares(people)}>
                Everyone
              </button>
              {trip.noAlcohol?.length ? (
                <button type="button" onClick={() => setShares(drinkers)}>
                  No alcohol for the youngest
                </button>
              ) : null}
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
                        shares.includes(p)
                          ? shares.filter((x) => x !== p)
                          : [...shares, p],
                      )
                    }
                  />
                  <span>{p}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          className="money-add-btn"
          disabled={!valid}
          onClick={add}
        >
          {/* The parsed amount, not the typed text: "1.240" reads as 1,24, and this is
              where that shows up before anyone commits it. */}
          Add {parsed !== null ? `${fmtAmount(parsed)} ${currency}` : "receipt"}
          {shares.length > 0 && ` · split ${shares.length} ways`}
        </button>
      </section>

      {receipts.length > 0 && (
        <>
          <section className="money-list">
            <h2>
              Receipts <i>{fmt(total)} Kč</i>
            </h2>
            <ul>
              {receipts.filter(mine).map((e) => (
                <li key={e.id} data-skipped={!counts(e)}>
                  <b>{e.what}</b>
                  <span className="money-meta">
                    {counts(e)
                      ? `${e.payer} paid · ${e.shares.length} ways`
                      : `${e.payer} is not on this trip — not counted`}
                  </span>
                  <span className="money-amt">
                    {fmt(toCzk(e))} Kč
                    {e.currency !== "CZK" && (
                      <i>
                        {(e.amount / 100).toFixed(2)} {e.currency}
                        {e.rate && ` × ${e.rate.toLocaleString("cs-CZ")}`}
                      </i>
                    )}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${e.what}`}
                    onClick={() =>
                      write((prev) => prev.filter((x) => x.id !== e.id))
                    }
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
              {(me ? [me] : people).map((p) => {
                const v = net.get(p) ?? 0;
                return (
                  <li
                    key={p}
                    data-state={v > 0 ? "up" : v < 0 ? "down" : "flat"}
                  >
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
            {shown.length === 0 ? (
              <p className="shop-lede">
                {me ? `${me} is square.` : "Everyone is square."}
              </p>
            ) : (
              <ol>
                {shown.map((t) => (
                  <li key={`${t.from}>${t.to}`}>
                    <b>{t.from}</b>
                    <span aria-hidden="true">→</span>
                    <b>{t.to}</b>
                    <i>{fmt(t.amount)} Kč</i>
                    <button
                      type="button"
                      className="money-why-btn"
                      aria-expanded={why === `${t.from}>${t.to}`}
                      onClick={() =>
                        setWhy(
                          why === `${t.from}>${t.to}`
                            ? null
                            : `${t.from}>${t.to}`,
                        )
                      }
                    >
                      Why?
                    </button>
                    {accounts.has(t.to) && (
                      <button
                        type="button"
                        className="money-why-btn"
                        aria-expanded={qr === `${t.from}>${t.to}`}
                        onClick={() =>
                          setQr(
                            qr === `${t.from}>${t.to}`
                              ? null
                              : `${t.from}>${t.to}`,
                          )
                        }
                      >
                        QR
                      </button>
                    )}
                    {paidButton(t)}
                    {accounts.has(t.to) && qr === `${t.from}>${t.to}` && (
                      <PayQr
                        iban={accounts.get(t.to)!}
                        to={t.to}
                        amount={t.amount}
                        message={`${trip.title} ${t.from} -> ${t.to}`}
                      />
                    )}
                    {why === `${t.from}>${t.to}` && (
                      <div className="money-why">
                        <Side
                          who={t.from}
                          lines={breakdown(expenses, people, t.from)}
                          net={net.get(t.from) ?? 0}
                        />
                        <Side
                          who={t.to}
                          lines={breakdown(expenses, people, t.to)}
                          net={net.get(t.to) ?? 0}
                        />
                        <p>
                          <b>Why to {t.to}?</b> {explain(t, transfers)}
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            )}
            {payments.some(mine) && (
              <div className="money-paid-list">
                <h3>Already paid</h3>
                <ul>
                  {payments.filter(mine).map((e) => (
                    <li key={e.id}>
                      <span>{e.what}</span>
                      <i>{fmt(toCzk(e))} Kč</i>
                      <button
                        type="button"
                        aria-label={`Undo ${e.what}`}
                        onClick={() =>
                          write((prev) => prev.filter((x) => x.id !== e.id))
                        }
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
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

    </div>
  );
}

function Side({
  who,
  lines,
  net,
}: {
  who: string;
  lines: Line[];
  net: number;
}) {
  return (
    <div>
      <h4>
        {who} {net < 0 ? "owes" : "gets back"} <i>{fmt(Math.abs(net))} Kč</i>
      </h4>
      <ul>
        {lines.map(({ e, czk, ways }) => (
          <li key={`${e.id}${ways ? "s" : "p"}`}>
            <span>
              {e.settlement
                ? ways
                  ? `Got it from ${e.payer}`
                  : `Already sent to ${e.shares[0]}`
                : ways
                  ? `${e.what} · ${fmt(toCzk(e))} Kč ÷ ${ways}`
                  : `Paid for ${e.what}`}
            </span>
            <i>
              {czk > 0 ? "+" : "−"}
              {fmt(Math.round(Math.abs(czk)))}
            </i>
          </li>
        ))}
      </ul>
    </div>
  );
}

function explain(t: Transfer, all: Transfer[]) {
  const rest = all.filter((x) => x.from === t.from && x !== t);
  const also = rest.length
    ? ` The rest goes to ${rest.map((x) => `${x.to} (${fmt(x.amount)} Kč)`).join(" and ")}.`
    : "";
  return (
    `${t.from} only ever pays their own total, never someone else's receipt. ` +
    `Who gets it is just matched up so there are as few transfers as possible, ` +
    `and everyone still ends up with exactly what they're owed.${also}`
  );
}

function PayQr({
  iban,
  to,
  amount,
  message,
}: {
  iban: string;
  to: string;
  amount: number;
  message: string;
}) {
  const svg = useMemo(() => {
    const code = qrcode(0, "M");
    code.addData(spayd(iban, amount, message));
    code.make();
    return code.createSvgTag({ cellSize: 4, margin: 4, scalable: true });
  }, [iban, amount, message]);

  return (
    <div className="money-qr">
      <div
        className="money-qr-code"
        role="img"
        aria-label={`QR payment of ${fmt(amount)} Kč to ${to}`}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <p>
        <b>Scan it in your bank app</b>
        On this phone? Screenshot it and pick “QR from image”.
        <span>
          {to} · {showAccount(iban)} · {fmt(amount)} Kč
        </span>
      </p>
    </div>
  );
}

function WhoSheet({
  people,
  me,
  open,
  answer,
}: {
  people: string[];
  me: string;
  open: boolean;
  answer: (name: string | null) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (open && !d?.open) d?.showModal();
    if (!open && d?.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="who"
      aria-labelledby="who-h"
      onCancel={(e) => {
        e.preventDefault();
        answer(null);
      }}
      onClick={(e) => e.target === e.currentTarget && answer(null)}
    >
      <h2 id="who-h">Who are you?</h2>
      <p>
        See what you owe or get back, pay by QR in your banking app, and let
        others pay you the same way. Remembered on this phone.
      </p>
      <ul>
        {people.map((p) => (
          <li key={p}>
            <button
              type="button"
              aria-pressed={p === me}
              onClick={() => answer(p)}
            >
              {p}
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="who-skip" onClick={() => answer(null)}>
        {me ? "Cancel" : "Just looking"}
      </button>
    </dialog>
  );
}

function AccountField({
  iban,
  save,
}: {
  iban: string | undefined;
  save: (iban: string | null) => void;
}) {
  const [text, setText] = useState(iban ? showAccount(iban) : "");
  const parsed = toIban(text);
  const bad = text.trim() !== "" && !parsed;

  return (
    <div className="money-acct">
      <label className="money-f">
        <span>Your account — people scan a QR to pay you</span>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="19-2000145399/0800"
          inputMode="text"
          autoComplete="off"
        />
      </label>
      <button
        type="button"
        disabled={!parsed || parsed === iban}
        onClick={() => {
          save(parsed);
          sileo.success({
            title: iban ? "Account updated" : "Account saved",
            description: "People who owe you now get a QR code to pay you.",
          });
        }}
      >
        {iban ? "Update" : "Save"}
      </button>
      {iban && (
        <button
          type="button"
          onClick={() => {
            save(null);
            setText("");
            sileo.info({
              title: "Account removed",
              description: "Nobody gets a QR code to pay you any more.",
              button: { title: "Undo", onClick: () => save(iban) },
            });
          }}
        >
          Remove
        </button>
      )}
      {bad && (
        <i className="money-hint">
          That isn&apos;t a valid account number — check the digits and the bank
          code.
        </i>
      )}
    </div>
  );
}

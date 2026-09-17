/**
 * Who owes whom, for a group buying things for each other.
 *
 * Balances and transfers are whole crowns. Haléře haven't existed in cash since 2008,
 * and a settle-up that asks somebody to send 0.02 Kč is asking for something they
 * cannot do.
 *
 * The important rule is that rounding happens **once**, at the end. Dividing every
 * receipt into whole crowns and adding those up compounds the error: two 1 240 Kč
 * receipts split fourteen ways each round to 88 or 89, so the same person could end up
 * owing 176, 177 or 178 for what is arithmetically one 177.14 Kč obligation. Each
 * person's share is summed exactly first, and only the total is rounded.
 */

export type Currency = "CZK" | "EUR" | "CHF";

/** Fixed, because rates don't move enough over four days to be worth fetching. */
export const RATES: Record<Currency, number> = { CZK: 1, EUR: 25, CHF: 27 };

export type Expense = {
  id: string;
  what: string;
  /** In `currency`, minor units, so 46.50 EUR stays exact on its own receipt line. */
  amount: number;
  currency: Currency;
  /** Who actually paid at the till. */
  payer: string;
  /** Who the cost is divided between. Not necessarily everyone — see the drink lists. */
  shares: string[];
  /**
   * A payment between two people rather than something bought. It needs no special
   * handling here: "Chipi paid Bobr 177" is exactly an expense Chipi paid for which
   * Bobr is the only sharer, so it credits one and debits the other. The flag is only
   * so the page can list payments apart from shopping and keep them out of the total
   * spent — settling up isn't spending.
   */
  settlement?: boolean;
};

/** Minor units in the expense's own currency -> whole crowns. Rounds once, here. */
export const toCzk = (e: Pick<Expense, "amount" | "currency">) =>
  Math.round((e.amount * RATES[e.currency]) / 100);

/**
 * Round fractional shares to whole crowns so they still add up to `target`.
 *
 * Largest remainder: everyone gets their whole crowns, then the few left over go to
 * whoever was cut by the most. This is what keeps the spread to a single crown — the
 * best possible when the total doesn't divide evenly.
 */
function roundShares(exact: Map<string, number>, target: number): Map<string, number> {
  const out = new Map<string, number>();
  const cut: { who: string; by: number }[] = [];
  let given = 0;

  for (const [who, share] of exact) {
    // Nudge before flooring: a share that is mathematically a whole number can land on
    // 176.99999999 after a few divisions, and floor() would quietly lose a crown.
    const whole = Math.floor(share + 1e-9);
    out.set(who, whole);
    given += whole;
    cut.push({ who, by: share - whole });
  }

  cut.sort((a, b) => b.by - a.by);
  let left = target - given;
  for (let i = 0; left > 0 && i < cut.length; i++, left--) {
    out.set(cut[i].who, out.get(cut[i].who)! + 1);
  }
  return out;
}

/** Net position per person, in whole crowns. Positive = owed money. */
export function balances(expenses: Expense[], people: string[]): Map<string, number> {
  const paid = new Map(people.map((p) => [p, 0]));
  const owed = new Map(people.map((p) => [p, 0]));
  let pot = 0;

  for (const e of expenses) {
    // Deduplicate: a name listed twice would be charged twice while the books still
    // balanced, so the error is silent. The checkboxes can't produce it, but this data
    // comes out of localStorage.
    const who = [...new Set(e.shares)].filter((p) => owed.has(p));
    // Skip rather than half-apply: crediting nobody while still debiting the sharers
    // would invent money, and the balances would stop summing to zero.
    if (!who.length || !paid.has(e.payer)) continue;

    const total = toCzk(e);
    pot += total;
    paid.set(e.payer, paid.get(e.payer)! + total);

    const each = total / who.length;
    for (const p of who) owed.set(p, owed.get(p)! + each);
  }

  const share = roundShares(owed, pot);
  // Payments are whole crowns and the rounded shares add up to the same pot, so the
  // balances sum to exactly zero without any correction pass.
  return new Map(people.map((p) => [p, (paid.get(p) ?? 0) - (share.get(p) ?? 0)]));
}

export type Transfer = { from: string; to: string; amount: number };

/**
 * Collapse balances into payments. Greedy largest-debtor against largest-creditor:
 * at most one transfer per person after the first, which is what a group actually
 * wants — not everyone paying everyone. (Truly minimal is NP-hard and not worth it.)
 */
export function settle(net: Map<string, number>): Transfer[] {
  const owed = [...net].filter(([, v]) => v > 0).map(([p, v]) => ({ p, v }));
  const owes = [...net].filter(([, v]) => v < 0).map(([p, v]) => ({ p, v: -v }));
  owed.sort((a, b) => b.v - a.v);
  owes.sort((a, b) => b.v - a.v);

  const out: Transfer[] = [];
  let i = 0;
  let j = 0;
  while (i < owes.length && j < owed.length) {
    const amount = Math.min(owes[i].v, owed[j].v);
    if (amount > 0) out.push({ from: owes[i].p, to: owed[j].p, amount });
    owes[i].v -= amount;
    owed[j].v -= amount;
    if (owes[i].v === 0) i++;
    if (owed[j].v === 0) j++;
  }
  return out;
}

/**
 * What somebody typed -> minor units, or null if it isn't a usable amount.
 *
 * Takes the ways a receipt total really gets typed: "1240", "1 240" (Czech receipts group
 * thousands with a space, often a non-breaking one), "1240,50" (Czech decimal comma),
 * "1240.50", "1.240,50", "1,240.50", with or without "Kč", "€" and friends.
 *
 * Deliberately strict about the rest. `Number()` alone accepts "Infinity", "1e400" and
 * "0x10"; the first two poison every balance with NaN, and the last is 16 Kč.
 */
export function parseAmount(text: string): number | null {
  let s = text
    .replace(/[\s  ]/g, "")
    .replace(/kč|czk|eur|chf|€|fr\.?/gi, "");
  if (!/^[0-9.,]+$/.test(s)) return null;

  const commas = s.split(",").length - 1;
  const dots = s.split(".").length - 1;

  if (commas && dots) {
    // Both appear: whichever comes last is the decimal point, the other groups thousands.
    const decimal = s.lastIndexOf(",") > s.lastIndexOf(".") ? "," : ".";
    s = s.split(decimal === "," ? "." : ",").join("").replace(decimal, ".");
  } else if (commas > 1 || dots > 1) {
    // One kind of separator, repeated: it can only be grouping.
    s = s.replace(/[.,]/g, "");
  } else {
    // At most one separator: a decimal point. "1.240" reads as 1,24 Kč, which is why the
    // Add button shows the parsed amount rather than echoing what was typed.
    s = s.replace(",", ".");
  }

  if (!/^\d+(\.\d+)?$/.test(s)) return null;

  // Digits, not floats: 1.005 * 100 is 100.4999… in binary, so Math.round would give 1,00
  // for what is 1,01. The string is already clean, so round half-up on the third decimal.
  const [whole, frac = ""] = s.split(".");
  const cents = Number(`${frac}00`.slice(0, 2));
  const up = frac.length > 2 && Number(frac[2]) >= 5 ? 1 : 0;
  const minor = Number(whole) * 100 + cents + up;
  if (!Number.isFinite(minor) || minor <= 0) return null;
  // A million crowns is not a camping receipt, it's a slipped finger.
  if (minor > 1_000_000_00) return null;
  return minor;
}

const CURRENCIES = Object.keys(RATES);

/**
 * Whatever came out of storage -> only well-formed expenses.
 *
 * localStorage is a trust boundary: hand-edited, left over from an older shape, or
 * corrupt. Without this a stored `null` or `{}` crashed the page outright, and a receipt
 * with `amount: "abc"` was accepted and turned every balance into NaN.
 */
export function sanitizeExpenses(raw: unknown): Expense[] {
  if (!Array.isArray(raw)) return [];
  const out: Expense[] = [];
  for (const e of raw) {
    if (!e || typeof e !== "object") continue;
    const x = e as Record<string, unknown>;
    if (typeof x.id !== "string") continue;
    if (typeof x.amount !== "number" || !Number.isFinite(x.amount)) continue;
    if (typeof x.currency !== "string" || !CURRENCIES.includes(x.currency)) continue;
    if (typeof x.payer !== "string") continue;
    if (!Array.isArray(x.shares) || !x.shares.every((p) => typeof p === "string")) continue;
    out.push({
      id: x.id,
      what: typeof x.what === "string" ? x.what : "Receipt",
      amount: x.amount,
      currency: x.currency as Currency,
      payer: x.payer,
      shares: x.shares as string[],
      ...(x.settlement === true ? { settlement: true } : {}),
    });
  }
  return out;
}

/**
 * The currency named in what somebody typed, if any. Typing "€46,50" with the dropdown
 * still on CZK would otherwise record 46,50 Kč for a 1 163 Kč receipt — the parser strips
 * the symbol, so the page has to act on it before it goes.
 */
export function detectCurrency(text: string): Currency | null {
  if (/€|eur/i.test(text)) return "EUR";
  if (/chf|fr\.?\s*\d|\d\s*fr\.?/i.test(text)) return "CHF";
  if (/kč|czk/i.test(text)) return "CZK";
  return null;
}

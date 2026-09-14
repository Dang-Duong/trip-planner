/**
 * Who owes whom, for a group buying things for each other.
 *
 * Balances and transfers are in **whole crowns**, as integers. Two reasons, and the
 * second one bites:
 *
 * - Floats don't cancel. 1 240 Kč split 14 ways is 88.571… each, and in floating point
 *   the balances stop summing to zero, so somebody is owed 0.0000001 forever.
 * - Sub-crown precision creates transfers nobody can make. Settling in haléře left
 *   people owing each other two of them, which displayed as a "0 Kč" payment. Haléře
 *   haven't existed in cash since 2008; a split that produces them is wrong, not precise.
 *
 * Amounts are still *entered* in minor units, so €46.50 stays exact on its receipt line —
 * it's the conversion into the shared pot that rounds, once, to a whole crown.
 */

export type Currency = "CZK" | "EUR" | "CHF";

/** Fixed, because rates don't move enough over four days to be worth fetching. */
export const RATES: Record<Currency, number> = { CZK: 1, EUR: 25, CHF: 27 };

export type Expense = {
  id: string;
  what: string;
  /** In `currency`, minor units. */
  amount: number;
  currency: Currency;
  /** Who actually paid at the till. */
  payer: string;
  /** Who the cost is divided between. Not necessarily everyone — see the drink lists. */
  shares: string[];
};

/** Minor units in the expense's own currency -> whole crowns. */
export const toCzk = (e: Pick<Expense, "amount" | "currency">) =>
  Math.round((e.amount * RATES[e.currency]) / 100);

/**
 * Divide `amount` into `n` whole parts that sum to exactly `amount`. The remainder is
 * handed out a crown at a time rather than rounded, so nothing appears or vanishes.
 *
 * `offset` rotates who picks up those extra crowns. Without it the remainder always
 * lands on whoever is first in the list, and over twenty-five receipts Tomáš
 * systematically pays more than Meloun for no reason.
 */
export function shares(amount: number, n: number, offset = 0): number[] {
  if (n <= 0) return [];
  const base = Math.trunc(amount / n);
  const rest = amount - base * n;
  const from = ((offset % n) + n) % n;
  return Array.from({ length: n }, (_, i) => {
    const place = (i - from + n) % n;
    return base + (place < rest ? 1 : 0);
  });
}

/** A stable number per expense, so the rotation is deterministic but varies between them. */
const spin = (id: string) => [...id].reduce((n, c) => (n * 31 + c.charCodeAt(0)) | 0, 7);

/** Net position per person, in whole crowns. Positive = owed money. */
export function balances(expenses: Expense[], people: string[]): Map<string, number> {
  const net = new Map(people.map((p) => [p, 0]));
  const add = (person: string, delta: number) => {
    if (net.has(person)) net.set(person, net.get(person)! + delta);
  };

  for (const e of expenses) {
    const total = toCzk(e);
    const who = e.shares.filter((p) => net.has(p));
    if (!who.length) continue;
    add(e.payer, total);
    shares(total, who.length, spin(e.id)).forEach((part, i) => add(who[i], -part));
  }
  return net;
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

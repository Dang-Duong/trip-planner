/**
 * Who owes whom, for a group buying things for each other.
 *
 * All money is integer minor units (haléře, cents) — never floats. A 1 240 Kč bill
 * split 14 ways is 88.571… each, and floats turn that into balances that don't quite
 * cancel, so the last person is owed 0.0000001 forever.
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

export const toCzk = (e: Pick<Expense, "amount" | "currency">) =>
  Math.round(e.amount * RATES[e.currency]);

/**
 * Divide `amount` into `n` whole parts that sum to exactly `amount`. The remainder is
 * handed out one unit at a time rather than rounded, so nothing appears or vanishes.
 */
export function shares(amount: number, n: number): number[] {
  if (n <= 0) return [];
  const base = Math.trunc(amount / n);
  const rest = amount - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < rest ? 1 : 0));
}

/** Net position per person, in CZK minor units. Positive = owed money. */
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
    shares(total, who.length).forEach((part, i) => add(who[i], -part));
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

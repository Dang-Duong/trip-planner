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
    const who = e.shares.filter((p) => owed.has(p));
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

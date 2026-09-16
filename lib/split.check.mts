// Run: npm run check
import assert from "node:assert/strict";
import { balances, settle, toCzk, type Expense } from "./split.ts";

const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0);
const spread = (ns: number[]) => Math.max(...ns) - Math.min(...ns);

// --- currency ---
assert.equal(toCzk({ amount: 124000, currency: "CZK" }), 1240);
assert.equal(toCzk({ amount: 4650, currency: "EUR" }), 1163, "46.50 EUR, rounded once");

const people = ["Bobr", "BM", "Chipi", "Tuty"];

// One person pays for everyone.
{
  const e: Expense[] = [
    { id: "1", what: "Meat", amount: 100000, currency: "CZK", payer: "Bobr", shares: people },
  ];
  const net = balances(e, people);
  assert.equal(net.get("Bobr"), 750);
  assert.equal(net.get("Chipi"), -250);
}

// A cost the youngest don't share — the alcohol case.
{
  const e: Expense[] = [
    { id: "1", what: "Soju", amount: 90000, currency: "CZK", payer: "BM", shares: ["Bobr", "BM"] },
  ];
  const net = balances(e, people);
  assert.equal(net.get("BM"), 450);
  assert.equal(net.get("Bobr"), -450);
  assert.equal(net.get("Chipi"), 0, "not on the expense, so owes nothing");
}

// The reported case: two identical receipts, everyone shares both.
// 2 480 / 14 = 177.14, so every share must be 177 or 178 — never 176. Rounding each
// receipt on its own used to compound into a 2-crown spread.
{
  const all = "ABCDEFGHIJKLMN".split("");
  const e: Expense[] = [
    { id: "r1", what: "x", amount: 124000, currency: "CZK", payer: "A", shares: all },
    { id: "r2", what: "y", amount: 124000, currency: "CZK", payer: "B", shares: all },
  ];
  const net = balances(e, all);

  assert.equal(sum([...net.values()]), 0, "money cannot appear or vanish");
  assert.ok(net.get("A")! > 0 && net.get("B")! > 0, "both payers are owed money");
  assert.ok(Math.abs(net.get("A")! - net.get("B")!) <= 1, "equal payers within a crown");

  const debts = all.filter((p) => net.get(p)! < 0).map((p) => -net.get(p)!);
  assert.equal(debts.length, 12);
  assert.ok(spread(debts) <= 1, `everyone shares both receipts: spread was ${spread(debts)}`);
  for (const d of debts) assert.ok(d === 177 || d === 178, `${d} is not a share of 177.14`);

  const transfers = settle(net);
  for (const t of transfers) {
    assert.ok(t.amount > 0, `a ${t.amount} Kč transfer is not a payment`);
    assert.ok(Number.isInteger(t.amount), "whole crowns only");
    assert.ok(
      !(["A", "B"].includes(t.from) && ["A", "B"].includes(t.to)),
      "the two equal payers must not pay each other",
    );
  }
}

// Rounding once holds up over many receipts too — the case that compounds worst.
{
  const all = "ABCDEFGHIJKLMN".split("");
  const e: Expense[] = Array.from({ length: 25 }, (_, i) => ({
    id: `r${i}`,
    what: "x",
    amount: 100000 + i * 777,
    currency: "CZK" as const,
    payer: all[i % all.length],
    shares: all,
  }));
  const net = balances(e, all);
  assert.equal(sum([...net.values()]), 0);

  // Everyone shared every receipt, so every share is the same to within one crown.
  const paidBy = new Map(all.map((p) => [p, 0]));
  for (const x of e) paidBy.set(x.payer, paidBy.get(x.payer)! + toCzk(x));
  const dues = all.map((p) => paidBy.get(p)! - net.get(p)!);
  assert.ok(spread(dues) <= 1, `25 receipts compounded into a ${spread(dues)}-crown spread`);
}

// Mixed currencies and uneven groups still balance, and settling squares everyone.
{
  const e: Expense[] = [
    { id: "a", what: "Veg", amount: 4650, currency: "EUR", payer: "Tuty", shares: people },
    { id: "b", what: "Bread", amount: 33333, currency: "CZK", payer: "Chipi", shares: people },
    { id: "c", what: "Beer", amount: 7777, currency: "CZK", payer: "BM", shares: ["BM", "Bobr"] },
  ];
  const net = balances(e, people);
  assert.equal(sum([...net.values()]), 0, "money cannot appear or vanish");

  const after = new Map(net);
  const transfers = settle(net);
  for (const t of transfers) {
    assert.ok(t.amount > 0 && Number.isInteger(t.amount));
    after.set(t.from, after.get(t.from)! + t.amount);
    after.set(t.to, after.get(t.to)! - t.amount);
  }
  for (const [p, v] of after) assert.equal(v, 0, `${p} is not square after settling`);
  assert.ok(transfers.length <= people.length - 1, "at most n-1 transfers");
}

// Someone not on the trip, as a sharer and as a payer. Neither may unbalance the books.
{
  const ghostShare: Expense[] = [
    { id: "1", what: "x", amount: 1000, currency: "CZK", payer: "Bobr", shares: ["Bobr", "Ghost"] },
  ];
  assert.equal(sum([...balances(ghostShare, people).values()]), 0);

  const ghostPaid: Expense[] = [
    { id: "1", what: "x", amount: 1000, currency: "CZK", payer: "Ghost", shares: people },
  ];
  const net = balances(ghostPaid, people);
  assert.equal(sum([...net.values()]), 0, "an unknown payer must not invent debt");
  assert.equal(net.get("Bobr"), 0, "the expense is skipped, not half-applied");
}

// Recording a payment squares exactly the pair it names, and nobody else.
{
  const bought: Expense[] = [
    { id: "1", what: "Meat", amount: 100000, currency: "CZK", payer: "Bobr", shares: people },
  ];
  const owing = balances(bought, people);
  assert.equal(owing.get("Chipi"), -250);
  assert.equal(owing.get("Bobr"), 750);

  const paidUp = balances(
    [
      ...bought,
      {
        id: "2",
        what: "Chipi → Bobr",
        amount: 25000,
        currency: "CZK",
        payer: "Chipi",
        shares: ["Bobr"],
        settlement: true,
      },
    ],
    people,
  );
  assert.equal(paidUp.get("Chipi"), 0, "the person who paid is square");
  assert.equal(paidUp.get("Bobr"), 500, "and is owed that much less");
  assert.equal(paidUp.get("BM"), -250, "everyone else is untouched");
  assert.equal(sum([...paidUp.values()]), 0);

  // Once square, that pair drops out of the settle-up entirely.
  for (const t of settle(paidUp)) {
    assert.ok(!(t.from === "Chipi" && t.to === "Bobr"), "already paid, should not be listed");
  }
}

// A name listed twice is one sharer, not two. The books balance either way, so this
// error is silent — it just quietly charges somebody double.
{
  const three = ["A", "B", "C"];
  const net = balances(
    [{ id: "1", what: "x", amount: 30000, currency: "CZK", payer: "A", shares: ["A", "B", "B"] }],
    three,
  );
  assert.equal(net.get("A"), 150, "A paid 300 and shares it with B: owed 150 back");
  assert.equal(net.get("B"), -150, "B is one sharer however many times they are listed");
  assert.equal(net.get("C"), 0, "not on the expense");
}

// Paying for something only you consumed changes nothing.
{
  const net = balances(
    [{ id: "1", what: "x", amount: 30000, currency: "CZK", payer: "A", shares: ["A"] }],
    ["A", "B"],
  );
  assert.equal(net.get("A"), 0);
  assert.equal(net.get("B"), 0);
}

// A refund is a negative expense and inverts cleanly.
{
  const net = balances(
    [{ id: "1", what: "refund", amount: -30000, currency: "CZK", payer: "A", shares: ["A", "B"] }],
    ["A", "B"],
  );
  assert.equal(net.get("A"), -150);
  assert.equal(net.get("B"), 150);
  assert.equal(sum([...net.values()]), 0);
}

// Overpaying a settlement flips who is owed, rather than clamping at zero.
{
  const net = balances(
    [
      { id: "1", what: "x", amount: 30000, currency: "CZK", payer: "A", shares: ["A", "B"] },
      { id: "2", what: "B → A", amount: 50000, currency: "CZK", payer: "B", shares: ["A"], settlement: true },
    ],
    ["A", "B"],
  );
  assert.equal(net.get("B"), 350, "B owed 150 and paid 500, so is owed 350");
  assert.equal(sum([...net.values()]), 0);
}

// Nobody owes anybody when nothing has been bought.
assert.deepEqual(settle(balances([], people)), []);

// --- fuzz ---
// The cases above are the ones someone thought of. This is the rest: randomised people,
// amounts, currencies, share subsets, outsiders, duplicates, zeros, refunds and
// settlements, asserting only what must be true of any of them.
{
  // Deterministic, so a failure reproduces from its seed.
  const rng = (seed: number) => () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const CURR = ["CZK", "EUR", "CHF"] as const;
  const outsiders = ["Ghost", "Typo", ""];

  for (let seed = 1; seed <= 2000; seed++) {
    const r = rng(seed);
    const pick = <T,>(xs: readonly T[]) => xs[Math.floor(r() * xs.length)];
    const n = 1 + Math.floor(r() * 20);
    const crew = Array.from({ length: n }, (_, i) => `P${i}`);

    const xs: Expense[] = [];
    for (let i = 0; i < Math.floor(r() * 30); i++) {
      const who: string[] = [];
      for (const p of crew) if (r() < 0.6) who.push(p);
      if (r() < 0.1) who.push(pick(outsiders));
      if (r() < 0.08 && who.length) who.push(who[0]);

      let amount = Math.floor(r() * 200000);
      if (r() < 0.05) amount = 0;
      if (r() < 0.04) amount = -Math.floor(r() * 50000);

      xs.push({
        id: `e${i}`,
        what: "x",
        amount,
        currency: pick(CURR),
        payer: r() < 0.08 ? pick(outsiders) : pick(crew),
        shares: who,
        ...(r() < 0.12 ? { settlement: true } : {}),
      });
    }

    const net = balances(xs, crew);
    const vals = [...net.values()];
    assert.equal(net.size, n, `seed ${seed}: everyone needs a balance`);
    for (const v of vals) assert.ok(Number.isInteger(v), `seed ${seed}: non-integer balance ${v}`);
    assert.equal(sum(vals), 0, `seed ${seed}: balances do not sum to zero`);

    const moves = settle(net);
    assert.ok(moves.length <= Math.max(n - 1, 0), `seed ${seed}: ${moves.length} transfers for ${n}`);

    const after = new Map(net);
    for (const t of moves) {
      assert.ok(t.from !== t.to, `seed ${seed}: self-transfer`);
      assert.ok(t.amount > 0 && Number.isInteger(t.amount), `seed ${seed}: ${t.amount} Kč transfer`);
      after.set(t.from, after.get(t.from)! + t.amount);
      after.set(t.to, after.get(t.to)! - t.amount);
    }
    for (const [p, v] of after) assert.equal(v, 0, `seed ${seed}: ${p} left at ${v}`);
  }
}

console.log("split: all checks passed, including 2 000 fuzzed scenarios");

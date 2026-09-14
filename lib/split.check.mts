// Run: npm run check
import assert from "node:assert/strict";
import { balances, settle, shares, toCzk, type Expense } from "./split.ts";

// Remainders are handed out, not rounded away.
assert.deepEqual(shares(100, 3), [34, 33, 33]);
assert.equal(shares(124000, 14).reduce((a, b) => a + b, 0), 124000);
assert.deepEqual(shares(10, 0), []);
assert.deepEqual(shares(0, 4), [0, 0, 0, 0]);

const people = ["Bobr", "BM", "Chipi", "Tuty"];

// One person pays for everyone.
{
  const e: Expense[] = [
    { id: "1", what: "Meat", amount: 100000, currency: "CZK", payer: "Bobr", shares: people },
  ];
  const net = balances(e, people);
  assert.equal(net.get("Bobr"), 75000);
  assert.equal(net.get("Chipi"), -25000);
}

// A cost the youngest three don't share — the alcohol case.
{
  const e: Expense[] = [
    { id: "1", what: "Soju", amount: 90000, currency: "CZK", payer: "BM", shares: ["Bobr", "BM"] },
  ];
  const net = balances(e, people);
  assert.equal(net.get("BM"), 45000);
  assert.equal(net.get("Bobr"), -45000);
  assert.equal(net.get("Chipi"), 0, "not on the expense, so owes nothing");
}

// Currency converts, and balances always sum to zero however it divides.
{
  assert.equal(toCzk({ amount: 4500, currency: "EUR" }), 112500);
  const e: Expense[] = [
    { id: "1", what: "Veg", amount: 4500, currency: "EUR", payer: "Tuty", shares: people },
    { id: "2", what: "Bread", amount: 33333, currency: "CZK", payer: "Chipi", shares: people },
    { id: "3", what: "Beer", amount: 7777, currency: "CZK", payer: "BM", shares: ["BM", "Bobr", "Tuty"] },
  ];
  const net = balances(e, people);
  const sum = [...net.values()].reduce((a, b) => a + b, 0);
  assert.equal(sum, 0, "money cannot appear or vanish");

  // Settling must leave everyone square, and nobody pays a negative amount.
  const transfers = settle(net);
  const after = new Map(net);
  for (const t of transfers) {
    assert.ok(t.amount > 0, "no zero or negative transfers");
    after.set(t.from, after.get(t.from)! + t.amount);
    after.set(t.to, after.get(t.to)! - t.amount);
  }
  for (const [p, v] of after) assert.equal(v, 0, `${p} is not square after settling`);
  assert.ok(transfers.length <= people.length - 1, "at most n-1 transfers");
}

// An expense naming someone not on the trip is ignored rather than losing their share.
{
  const e: Expense[] = [
    { id: "1", what: "x", amount: 1000, currency: "CZK", payer: "Bobr", shares: ["Bobr", "Ghost"] },
  ];
  const net = balances(e, people);
  assert.equal([...net.values()].reduce((a, b) => a + b, 0), 0);
}

// Nobody owes anybody when nothing has been bought.
assert.deepEqual(settle(balances([], people)), []);

console.log("split: all checks passed");

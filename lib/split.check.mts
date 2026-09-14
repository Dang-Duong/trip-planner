// Run: npm run check
import assert from "node:assert/strict";
import { balances, settle, shares, toCzk, type Expense } from "./split.ts";

// --- dividing up ---
assert.deepEqual(shares(100, 3), [34, 33, 33]);
assert.equal(shares(1240, 14).reduce((a, b) => a + b, 0), 1240, "parts sum to the whole");
assert.deepEqual(shares(10, 0), []);
assert.deepEqual(shares(0, 4), [0, 0, 0, 0]);

// The extra crowns rotate, so the same people don't always pay them.
assert.deepEqual(shares(10, 4, 0), [3, 3, 2, 2]);
assert.deepEqual(shares(10, 4, 2), [2, 2, 3, 3]);
assert.equal(shares(10, 4, 2).reduce((a, b) => a + b, 0), 10);
assert.deepEqual(shares(10, 4, -1), shares(10, 4, 3), "negative offsets wrap");

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

// Two people paying the same amount owe each other nothing — and no dust transfer
// appears between them. This is the "PAPRIKASON -> BOBR 0 Kč" bug.
{
  const all = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];
  const e: Expense[] = [
    { id: "r1", what: "x", amount: 124000, currency: "CZK", payer: "A", shares: all },
    { id: "r2", what: "y", amount: 124000, currency: "CZK", payer: "B", shares: all },
  ];
  const net = balances(e, all);
  // 2 480 doesn't divide by 14, so the spare crown lands on somebody — two equal payers
  // can differ by one. What must never happen is the two of them paying each other.
  assert.ok(Math.abs(net.get("A")! - net.get("B")!) <= 1, "equal payers stand within a crown");
  assert.ok(net.get("A")! > 0 && net.get("B")! > 0, "both are owed money");

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

// Mixed currencies and uneven groups still balance, and settling squares everyone.
{
  const e: Expense[] = [
    { id: "a", what: "Veg", amount: 4650, currency: "EUR", payer: "Tuty", shares: people },
    { id: "b", what: "Bread", amount: 33333, currency: "CZK", payer: "Chipi", shares: people },
    { id: "c", what: "Beer", amount: 7777, currency: "CZK", payer: "BM", shares: ["BM", "Bobr"] },
  ];
  const net = balances(e, people);
  assert.equal([...net.values()].reduce((a, b) => a + b, 0), 0, "money cannot appear or vanish");

  const transfers = settle(net);
  const after = new Map(net);
  for (const t of transfers) {
    assert.ok(t.amount > 0 && Number.isInteger(t.amount));
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
  assert.equal([...balances(e, people).values()].reduce((a, b) => a + b, 0), 0);
}

// Nobody owes anybody when nothing has been bought.
assert.deepEqual(settle(balances([], people)), []);

console.log("split: all checks passed");

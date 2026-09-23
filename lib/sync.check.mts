// Run: npm run check
import assert from "node:assert/strict";
import {
  applyOps,
  diffEntries,
  EMPTY_STATE,
  isOp,
  MAX_ENTRY_BYTES,
  toEntries,
  type Entry,
  type Op,
} from "./sync-ops.ts";

const entry = (id: string, what = "Meat"): Entry => ({ id, what, amount: 100 });

// --- ticks ---
{
  const on = applyOps(EMPTY_STATE, [{ k: "tick", id: "0.1", on: true }]);
  assert.deepEqual(on.shop, ["0.1"]);
  assert.deepEqual(applyOps(on, [{ k: "tick", id: "0.1", on: false }]).shop, []);

  // Idempotent, because the outbox replays after a timeout.
  const twice = applyOps(EMPTY_STATE, [
    { k: "tick", id: "0.1", on: true },
    { k: "tick", id: "0.1", on: true },
  ]);
  assert.deepEqual(twice.shop, ["0.1"]);

  assert.deepEqual(applyOps(twice, [{ k: "clear" }]).shop, []);
}

// Two people ticking different lines in the same round trip both survive.
{
  const both = applyOps(EMPTY_STATE, [
    { k: "tick", id: "1.0", on: true },
    { k: "tick", id: "2.3", on: true },
  ]);
  assert.deepEqual(both.shop.sort(), ["1.0", "2.3"]);
}

// No ops must hand back the same object, or useSyncExternalStore re-renders forever.
assert.equal(applyOps(EMPTY_STATE, []), EMPTY_STATE);

// --- receipts ---
{
  const a = entry("a");
  const withA = applyOps(EMPTY_STATE, [{ k: "put", entry: a }]);
  assert.deepEqual(withA.money, [a]);

  // An edit replaces by id rather than appending a second copy.
  const edited = applyOps(withA, [{ k: "put", entry: entry("a", "Soju") }]);
  assert.equal(edited.money.length, 1);
  assert.equal(edited.money[0].what, "Soju");

  assert.deepEqual(applyOps(edited, [{ k: "drop", id: "a" }]).money, []);
  // Dropping something already gone is a no-op, not a crash.
  assert.deepEqual(applyOps(edited, [{ k: "drop", id: "zzz" }]).money.length, 1);
}

// --- diffing a whole array into ops ---
{
  const a = entry("a");
  const b = entry("b");

  assert.deepEqual(diffEntries([a], [a]), [], "unchanged means no traffic");
  assert.deepEqual(diffEntries([a], [a, b]), [{ k: "put", entry: b }]);
  assert.deepEqual(diffEntries([a, b], [a]), [{ k: "drop", id: "b" }]);

  const edited = entry("a", "Soju");
  assert.deepEqual(diffEntries([a], [edited]), [{ k: "put", entry: edited }]);
}

// The point of ops: one person adds while another marks a transfer paid, and both
// land. Applying each diff to the shared state in turn keeps both receipts — which a
// whole-array write would not.
{
  const base = { shop: [], money: [entry("a")] };
  const mine = diffEntries(base.money, [...base.money, entry("mine")]);
  const theirs = diffEntries(base.money, [...base.money, entry("theirs")]);
  const after = applyOps(applyOps(base, mine), theirs);
  assert.deepEqual(after.money.map((e) => e.id).sort(), ["a", "mine", "theirs"]);
}

// --- what the public endpoint accepts ---
{
  const good: Op[] = [
    { k: "tick", id: "0.1", on: true },
    { k: "clear" },
    { k: "drop", id: "a" },
    { k: "put", entry: entry("a") },
  ];
  assert.ok(good.every(isOp));

  assert.ok(!isOp(null));
  assert.ok(!isOp({ k: "nope" }));
  assert.ok(!isOp({ k: "tick", id: "0.1" }), "on must be a boolean");
  assert.ok(!isOp({ k: "tick", id: "", on: true }), "empty id");
  assert.ok(!isOp({ k: "tick", id: "x".repeat(65), on: true }), "id too long");
  assert.ok(!isOp({ k: "put", entry: { what: "no id" } }));
  assert.ok(
    !isOp({ k: "put", entry: { id: "a", what: "x".repeat(MAX_ENTRY_BYTES) } }),
    "oversized entry",
  );
}

// --- junk from storage or a hand-edited Redis field ---
assert.deepEqual(toEntries(null), []);
assert.deepEqual(toEntries([null, 7, "x", { no: "id" }, { id: 4 }]), []);
assert.deepEqual(toEntries([{ id: "a" }]), [{ id: "a" }]);

console.log("sync: all checks passed");

import assert from "node:assert/strict";
import { showAccount, spayd, toIban } from "./payment.ts";

// The textbook example: ČNB's own documentation and every IBAN calculator agree on it.
assert.equal(toIban("19-2000145399/0800"), "CZ6508000000192000145399");
assert.equal(toIban(" 19-2000145399 / 0800 "), "CZ6508000000192000145399", "spaces are fine");
assert.equal(toIban("CZ65 0800 0000 1920 0014 5399"), "CZ6508000000192000145399");
assert.equal(toIban("cz6508000000192000145399"), "CZ6508000000192000145399");

assert.equal(toIban("19-2000145398/0800"), null, "one wrong digit fails the bank checksum");
assert.equal(toIban("CZ6608000000192000145399"), null, "wrong IBAN check digits");
assert.equal(toIban("2000145399"), null, "no bank code");
assert.equal(toIban("2000145399/80"), null, "bank code is four digits");
assert.equal(toIban(""), null);
assert.equal(toIban("0/0800"), null);

assert.equal(toIban("SK3112000000198742637541"), "SK3112000000198742637541", "foreign IBANs pass");
assert.equal(toIban("SK3112000000198742637542"), null);

assert.equal(showAccount("CZ6508000000192000145399"), "19-2000145399/0800");
assert.equal(toIban(showAccount("CZ6508000000192000145399")), "CZ6508000000192000145399");

assert.equal(
  spayd("CZ6508000000192000145399", 1030, "Chamonix · Tuty → Čongus*"),
  "SPD*1.0*ACC:CZ6508000000192000145399*AM:1030.00*CC:CZK*MSG:Chamonix  Tuty -> Congus",
);
assert.ok(spayd("CZ6508000000192000145399", 1, "x".repeat(99)).endsWith("MSG:" + "x".repeat(60)));

console.log("payment: all checks passed");

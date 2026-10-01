/**
 * Czech QR payments (QR Platba / SPAYD): every Czech banking app scans these, so a
 * transfer needs no typed account number or amount.
 */

const mod97 = (digits: string) => {
  let r = 0;
  for (const d of digits) r = (r * 10 + Number(d)) % 97;
  return r;
};

/** Letters to their IBAN numbers (A=10 … Z=35), digits left alone. */
const numeric = (s: string) => s.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));

// The Czech account number carries its own mod-11 checksum, prefix and number separately.
const weighted = (digits: string, weights: number[]) =>
  [...digits].reduce((n, d, i) => n + Number(d) * weights[i], 0) % 11 === 0;

const PREFIX_WEIGHTS = [10, 5, 8, 4, 2, 1];
const NUMBER_WEIGHTS = [6, 3, 7, 9, 10, 5, 8, 4, 2, 1];

function czechValid(prefix: string, number: string) {
  return (
    /^\d{6}$/.test(prefix) &&
    /^\d{10}$/.test(number) &&
    Number(number) > 0 &&
    weighted(prefix, PREFIX_WEIGHTS) &&
    weighted(number, NUMBER_WEIGHTS)
  );
}

/**
 * "19-2000145399/0800", "2000145399/0800" or an IBAN -> a validated IBAN, or null.
 * A typo here sends real money to a stranger, so both checksums have to pass.
 */
export function toIban(text: string): string | null {
  const s = text.replace(/\s/g, "").toUpperCase();

  const local = /^(?:(\d{1,6})-)?(\d{2,10})\/(\d{4})$/.exec(s);
  if (local) {
    const prefix = (local[1] ?? "").padStart(6, "0");
    const number = local[2].padStart(10, "0");
    if (!czechValid(prefix, number)) return null;
    const bban = local[3] + prefix + number;
    const check = String(98 - mod97(bban + numeric("CZ") + "00")).padStart(2, "0");
    return `CZ${check}${bban}`;
  }

  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s)) return null;
  if (mod97(numeric(s.slice(4) + s.slice(0, 4))) !== 1) return null;
  if (s.startsWith("CZ") && (s.length !== 24 || !czechValid(s.slice(8, 14), s.slice(14))))
    return null;
  return s;
}

/** A Czech IBAN back to the "prefix-number/bank" people recognise; others grouped by four. */
export function showAccount(iban: string): string {
  if (iban.startsWith("CZ") && iban.length === 24) {
    const prefix = iban.slice(8, 14).replace(/^0+/, "");
    const number = iban.slice(14).replace(/^0+/, "");
    return `${prefix ? `${prefix}-` : ""}${number}/${iban.slice(4, 8)}`;
  }
  return iban.replace(/(.{4})/g, "$1 ").trim();
}

/** The QR payload. Message is ASCII without "*": some bank apps mangle diacritics. */
export function spayd(iban: string, czk: number, message: string): string {
  const msg = message
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/→/g, "->")
    .replace(/[^\x20-\x7e]|\*/g, "")
    .slice(0, 60);
  return `SPD*1.0*ACC:${iban}*AM:${czk.toFixed(2)}*CC:CZK*MSG:${msg}`;
}

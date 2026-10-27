import { RATES, type Currency } from "@/lib/split";

// ČNB publishes one fixing per working day around 14:30; an hour of staleness is fine.
export const revalidate = 3600;

const CNB =
  "https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt";

/** "EMU|euro|1|EUR|24.340" lines -> CZK per one unit, only for currencies we take. */
export async function GET() {
  try {
    const res = await fetch(CNB, { next: { revalidate } });
    if (!res.ok) throw new Error(`cnb ${res.status}`);
    const text = await res.text();
    const rates: Partial<Record<Currency, number>> = {};
    for (const line of text.split("\n")) {
      const [, , amount, code, rate] = line.split("|");
      if (code in RATES && code !== "CZK") {
        const r = Number(rate) / Number(amount);
        if (Number.isFinite(r) && r > 0) rates[code as Currency] = r;
      }
    }
    return Response.json({ date: text.split(" #")[0].trim(), rates });
  } catch {
    return Response.json({ error: "rates unavailable" }, { status: 502 });
  }
}

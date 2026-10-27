import { RATES, type Currency } from "@/lib/split";

// ČNB publishes one new rate per working day (~14:30); checking hourly picks it up the same afternoon.
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
        const r = Math.round((Number(rate) / Number(amount)) * 10) / 10;
        if (Number.isFinite(r) && r > 0) rates[code as Currency] = r;
      }
    }
    return Response.json({ date: text.split(" #")[0].trim(), rates });
  } catch {
    return Response.json({ error: "rates unavailable" }, { status: 502 });
  }
}

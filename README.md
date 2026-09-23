# trip-planner

Group trip plans: map, day-by-day timeline, parking pins, packing checklist. One page per trip,
public, no login. First trip is Chamonix → Matterhorn, Sept 2026.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

## What to buy

`shop` is one list grouped by **where you buy it** — Asian shop, butcher, greengrocer,
supermarket, drinks, grill & fuel, table & clean-up, and a "bring, don't buy" block for
things out of someone's kitchen. Nobody is assigned anything: whoever is going to that
shop picks up whatever isn't ticked.

It used to be one list per person, which existed to stop double-buying *and* to keep the
cost fair. The settle-up page does the fairness half properly now, so per-person
assignment was only earning its keep for "don't buy the meat twice" — which a shared
ticked list does just as well, without pinning anyone to a shop they aren't near.

It lives at `/trips/[slug]/shop`, with `ShopList` rendering the groups. Both languages
are separate arrays and **their order is load-bearing**: a tick is stored as
`<group index>.<item index>`, so `shop.en.groups` and `shop.cs.groups` must hold the same
groups in the same order with the same items in the same order, or ticks shift onto the
wrong lines when you switch language. Add, remove or move an item in both, or not at all.

Two things in `ShopList` are load-bearing:

- **Multi-column, not grid.** The blocks run from three items to ten. A grid row sizes
  every card to the tallest card in it, so half of them ended as voids. `columns: 2`
  packs them; `display: inline-block` on the card is what makes `break-inside: avoid`
  hold up across browsers.
- **Colour encodes state, not category.** The left rail is the blaze accent until a
  block is fully ticked, then it goes to `--stone` and the card stands down. That is the
  only colour the card spends.

`notes` are the caveats the list depends on (the car fridge, bread shelf life, entering
receipts) and render under the cards.

The roster itself is `people` on the trip, not on the shopping — the settle-up splits
between those names, and `noAlcohol` drives the one-click preset there.

The switcher writes the choice to localStorage and reads it back through
`useStoredChoice` in `lib/local-state.ts` — same `useSyncExternalStore` shape as the
checklists, so the server snapshot ("en") and the first client render agree and the
stored value lands on the pass after hydration. Reading localStorage into `useState`
from an effect would hydrate English and then flip, which is both a flash and a lint
error in this repo.

## Who owes whom

`/trips/[slug]/money` splits the shopping. You enter what a receipt came to, who paid, and
**tick who it was for** — untick the youngest three on anything alcoholic and they stop
paying for it. It nets everyone off and collapses the result into the fewest payments.

The maths is in `lib/split.ts` and has a runnable check: `npm run check` (Node's type
stripping, so the check imports the `.ts` directly — hence `allowImportingTsExtensions`).
Two things it exists to protect:

- **Round once, at the end.** Each person's share is summed exactly across every
  receipt and only the total is rounded, by largest remainder. Rounding each receipt to
  whole crowns and adding those up compounds the error: two 1 240 Kč receipts split
  fourteen ways each round to 88 or 89, so one person could owe 176 and another 178 for
  what is arithmetically the same 177.14 obligation. Rounding once keeps the spread to a
  single crown, which is the best possible when the total doesn't divide evenly.
- **Whole crowns, never haléře.** They haven't existed in cash since 2008, and settling
  in them produced transfers of 0.02 Kč that displayed as "0 Kč" — asking someone to send
  money they cannot send.
- **`settle()` is greedy, not optimal.** Largest debtor against largest creditor, at most
  n−1 transfers. Genuinely minimal is NP-hard and nobody cares.
- **A name listed twice in `shares` is one sharer.** Without deduplicating, the books
  still balanced while quietly charging that person double — the worst kind of wrong,
  because nothing looks off. The checkboxes can't produce it; localStorage can.

Two layers sit in front of the maths, and they're where real bugs actually were:

- **`parseAmount`** reads what somebody typed. It takes the ways a receipt total gets
  typed — `1 240` (how Czech receipts print it, often with a non-breaking space),
  `1240,50`, `1.240,50`, `1,240.50`, with or without `Kč`/`€` — and is deliberately strict
  about the rest, because `Number()` alone accepts `Infinity`, `1e400` and `0x10`. It does
  the arithmetic on digits rather than floats: `1.005 * 100` is `100.4999…` in binary.
  A lone separator is a decimal point, so `1.240` reads as 1,24 Kč — which is why the Add
  button shows the *parsed* amount rather than echoing the input.
- **`sanitizeExpenses`** reads what comes back out of storage. localStorage is a trust
  boundary: a stored `null` or `{}` used to crash the page outright, and a receipt with
  `amount: "abc"` was accepted and turned every balance into NaN.

`detectCurrency` makes a currency typed into the amount win over the dropdown — otherwise
`€46,50` with the dropdown on CZK is recorded as 46,50 Kč for a 1 163 Kč receipt.

`npm run check` ends with 2 000 fuzzed scenarios — random crew sizes, amounts,
currencies, share subsets, outsiders, duplicates, zeros, refunds and settlements —
asserting only what must hold of any of them: balances are whole and sum to zero, no
self-transfers, no zero or fractional transfers, at most n−1 of them, and everyone sits
at zero once they're applied. Seeded, so a failure reproduces.

**Marking a transfer paid records a payment, it doesn't set a flag.** The transfer list
is derived from the receipts, so it reshuffles whenever one is added — a "paid" tick
would end up attached to a payment that no longer exists. Instead it appends an expense
whose payer is the sender and whose only sharer is the recipient, which credits one and
debits the other. The pair go square, the row disappears on its own, and the payment
still counts after more receipts arrive. `settlement: true` is display-only: it keeps
payments out of the receipts list and out of the total spent, since settling up isn't
spending.

Foreign currency converts at a fixed rate in `RATES` — rates don't move enough over four
days to be worth fetching, and a live rate would make yesterday's totals drift.

**It is shared, like the tick boxes** — see below.

## Shared state

The shopping ticks and the receipts are shared by everyone on the page; the packing list
and the language toggle stay per-device, because those are your bag and your preference.

`lib/shared-state.ts` has the two hooks — `useSharedChecklist` and `useSharedEntries`,
shaped like the localStorage ones in `lib/local-state.ts` so the views barely changed —
and `app/api/trip/[slug]/route.ts` is the whole backend, over Upstash Redis.

Three things carry the design:

- **Ops, not documents.** Fourteen people tick at once, so a client that PUTs its own
  copy of the list would clobber whoever wrote last. Each change is one op (`tick`,
  `clear`, `put`, `drop`) and lands as one Redis command — `SADD`/`SREM` on a set for
  ticks, `HSET`/`HDEL` on a hash for receipts. They commute, and every one is
  idempotent, so replaying an op after a timeout can only be a no-op. `MoneyView` still
  hands over a whole array; `diffEntries` turns it into per-receipt ops.
- **An outbox, because the Mattertal has no signal.** A write goes into
  `trip:<slug>:outbox` in localStorage first, renders immediately on top of the last
  known server state, and is sent on the next flush. It survives a reload, retries on
  the 6-second poll and when the tab wakes or the connection returns, and `SyncBadge`
  says how many are waiting. Nothing is dropped because a tunnel ate the request.
- **No store means no breakage.** If neither env var is set, the API answers 503 and the
  client folds its ops into local state and keeps going exactly as it did before — which
  is what `npm run dev` does out of the box.

Writes poll rather than stream: a websocket for fourteen people ticking a list would be
more moving parts than it's worth, and a tick shows up for everyone else within about
six seconds.

**Setup.** Add an Upstash Redis database in Vercel's marketplace and attach it to the
project. It injects `KV_REST_API_URL` and `KV_REST_API_TOKEN`, which is all the route
reads (`UPSTASH_REDIS_REST_URL` / `_TOKEN` work too, for a database made outside Vercel).
Redeploy, and the page is shared. See `.env.example`.

**There is no login,** exactly like the rest of the page — anyone with the URL can tick
and add receipts. The route validates every op, caps a batch at 200 and a receipt at
2 kB, and only accepts slugs matching `^[a-z0-9-]{1,64}$`, so the blast radius is one
trip's list.

## Adding a trip

Copy `trips/chamonix-matterhorn-2026.tsx`, edit the content, and register it in `trips/index.ts`.
Nothing else changes — the page and the map are generic and render whatever the data file gives them.

**Waypoint coordinates live in the trip data file**, as `[lon, lat]`. A `MapView` names the
waypoints it marks and, optionally, the ones to join into a route line:

```ts
maps: [
  { id: "overview", title: "…", waypoints: [...], route: [...] },
  { id: "sat",      title: "…", waypoints: [...] },
]
```

A view does not choose its tiles — the reader does, with the switcher. Marker ink flips
automatically to suit whichever basemap is showing.

A `Day` can name a `mapId`; the sticky map follows the timeline as you scroll.

Labels sit to the right of their dot by default. Set `labelSide` (`left` / `right` / `above` /
`below`) to pull apart any that collide at the zoom the map settles on.

The data file is `.tsx`, not `.ts`, so leg text can hold inline `<b>`/`<em>` as JSX — no
`dangerouslySetInnerHTML`, no markdown parser. **Use real characters (`’ — ×`), not HTML
entities**: a text node containing an entity loses its leading whitespace in the JSX transform.

## Adding a basemap

`BASEMAPS` in `components/TripMap.tsx` is the whole story: add an entry, then declare a matching
raster source and layer in the initial style — **below `route-casing`**, or the route and hover
trail end up buried under the tiles. Add its id to `BASEMAP_LAYERS`, and to `BASEMAP_CHOICES` if it
should get a button. The first choice in that list is what the map opens on.

Two traps worth knowing:

- **Esri addresses tiles `{z}/{y}/{x}`**, row before column — the reverse of the usual slippy order.
  Swap them and you get tiles of somewhere else rather than a 404, so it fails as a map that looks
  plausible and is wrong.
- **Attribution is automatic but conditional.** MapLibre credits only sources used by *visible*
  layers, so the footer follows the switcher on its own — as long as the `attribution` string is on
  the source, not just in the `BASEMAPS` table.

`data-basemap` on `.mapbox` carries the active id so CSS can retune the marker palette; satellite
uses it to swap the dot fills to their bright variants, which the pale sheets don't need.

## The maplibre worker

maplibre-gl v6 works out its worker URL from `import.meta.url` and silently falls back to an empty
string when that isn't an `http(s)` URL — which is what a bundled chunk hands it. The result is a
map that draws raster tiles but never loads any GeoJSON, so route lines just never appear.

`scripts/copy-map-worker.mjs` copies the worker and its shared chunk into `public/` at
`predev`/`prebuild`, and `TripMap` points `setWorkerUrl()` at it. Both files are gitignored so they
can't drift from the installed version. If you upgrade maplibre and routes vanish, look here first.

## Type

Three faces, loaded through `next/font` in `app/layout.tsx` and self-hosted, so there is no request
to Google at runtime and no swap flash. Each is wired to a CSS variable in `globals.css` with its
old stack still behind it as the fallback:

| Role | Face | Variable |
| --- | --- | --- |
| Display — `h1`, trip cards, person names | Archivo | `--display` |
| Body | Instrument Sans | `--sans` |
| Data, labels, quantities | IBM Plex Mono | `--mono` |

Archivo is variable on **both** width and weight, and the headline voice is its narrow, heavy end —
hence `font-stretch: 78%` on `h1`. `axes: ["wdth"]` is what pulls the width axis in, and next/font
rejects it alongside a `weight` array: with `axes` set, the weight must be omitted (the whole
variable range comes along) or be `"variable"`.

## Stack

Next.js (App Router) · TypeScript · Tailwind v4 · MapLibre GL · localStorage for the packing and
shopping checkboxes (per person, per device — deliberately not shared). No backend, no auth, no
database.

Deploys to Vercel; both routes are prerendered as static HTML.

## Attribution

Required by the tile licences and wired into the map, switching with the selected basemap:
© OpenStreetMap contributors, © CARTO, © Esri, Maxar, Earthstar Geographics.

The Esri imagery endpoint is unauthenticated and is what Leaflet/OSM tooling generally points at,
but Esri's terms nominally expect an ArcGIS account for production use. If that ever matters,
swapping the satellite entry in `BASEMAPS` is a one-line change.

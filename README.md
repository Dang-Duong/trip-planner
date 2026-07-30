# trip-planner

Group trip plans: map, day-by-day timeline, parking pins, packing checklist. One page per trip,
public, no login. First trip is Chamonix → Matterhorn, Sept 2026.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

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

## Stack

Next.js (App Router) · TypeScript · Tailwind v4 · MapLibre GL · localStorage for the packing
checkboxes (per person, per device — deliberately not shared). No backend, no auth, no database.

Deploys to Vercel; both routes are prerendered as static HTML.

## Attribution

Required by the tile licences and wired into the map, switching with the selected basemap:
© OpenStreetMap contributors, © CARTO, © Esri, Maxar, Earthstar Geographics.

The Esri imagery endpoint is unauthenticated and is what Leaflet/OSM tooling generally points at,
but Esri's terms nominally expect an ArcGIS account for production use. If that ever matters,
swapping the satellite entry in `BASEMAPS` is a one-line change.

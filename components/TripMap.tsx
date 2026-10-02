"use client";

import { useEffect, useRef, useState } from "react";
import type { LngLat, MapView, Waypoint } from "@/lib/types";

type ML = typeof import("maplibre-gl");
type MLMap = import("maplibre-gl").Map;

const BASEMAPS = {
  // Colour, labelled, roads and place names — the familiar street-map look, for when
  // a contour sheet is not what you want.
  //
  // Esri rather than CARTO: CARTO began serving an "API key required" tile to every
  // keyless request in late Sept 2026. Esri's tiles still need no key.
  voyager: {
    tiles: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    ],
    maxzoom: 18,
    attribution: "© Esri, HERE, Garmin, © OpenStreetMap contributors",
    paint: { "raster-saturation": 0, "raster-contrast": 0, "raster-opacity": 1 },
  },
  // Left photographic on purpose — the whole reason to switch here is telling glacier
  // from moraine from scree, which any desaturation would flatten away.
  //
  // Esri's REST tiles are addressed {z}/{y}/{x} — row before column, the reverse of the
  // usual slippy order. Swapping them returns tiles of somewhere else rather than a 404,
  // so it fails as a plausible-looking wrong map. Same for satlabels below.
  satellite: {
    tiles: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    ],
    maxzoom: 18,
    attribution: "© Esri, Maxar, Earthstar Geographics",
    paint: { "raster-saturation": 0, "raster-contrast": 0, "raster-opacity": 1 },
  },
  // Place names over the imagery: Esri's boundaries-and-places sheet, light type with a
  // dark halo, made to sit on its own World_Imagery.
  satlabels: {
    tiles: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    ],
    maxzoom: 18,
    attribution: "© Esri, HERE, Garmin",
    paint: { "raster-saturation": 0, "raster-contrast": 0, "raster-opacity": 1 },
  },
} as const;

/** What the switcher offers. The first is what the map opens on. */
export type Basemap = "satellite" | "voyager";
export const BASEMAP_CHOICES: { id: Basemap; label: string }[] = [
  { id: "satellite", label: "Satellite" },
  { id: "voyager", label: "Streets" },
];

// Every basemap layer, so switching can hide the rest without listing them by hand.
const BASEMAP_LAYERS = ["voyager", "satellite", "satlabels"] as const;

// Colours resolve from CSS vars set on the map container, which flip with the
// basemap — pale streets and dark imagery need opposite ink. Deliberately large:
// these sit over aerial photography and labelled streets, both already busy, and a
// subtle dot loses every time.
const MARKER_STYLE: Record<Waypoint["kind"], { fill: string; stroke: string; r: number }> = {
  camp: { fill: "var(--map-accent)", stroke: "#FFFFFF", r: 8 },
  goal: { fill: "var(--map-cool)", stroke: "#FFFFFF", r: 8 },
  start: { fill: "var(--map-cool)", stroke: "#FFFFFF", r: 7.5 },
  hut: { fill: "var(--map-cool)", stroke: "#FFFFFF", r: 7 },
  peak: { fill: "var(--map-ink)", stroke: "#FFFFFF", r: 5 },
  stop: { fill: "#FFFFFF", stroke: "var(--map-accent)", r: 5.5 },
};

const SVG = "http://www.w3.org/2000/svg";

function markerEl(wp: Waypoint) {
  const s = MARKER_STYLE[wp.kind];
  const size = s.r * 2 + 4;

  const el = document.createElement("div");
  el.className = `wp-marker is-${wp.labelSide ?? "right"}`;

  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("aria-hidden", "true");
  const circle = document.createElementNS(SVG, "circle");
  circle.setAttribute("cx", String(s.r + 2));
  circle.setAttribute("cy", String(s.r + 2));
  circle.setAttribute("r", String(s.r));
  circle.setAttribute("fill", s.fill);
  circle.setAttribute("stroke", s.stroke);
  circle.setAttribute("stroke-width", "2.5");
  svg.appendChild(circle);

  const label = document.createElement("span");
  label.className = `wp-label is-${wp.kind}`;
  label.textContent = wp.name;
  if (wp.note) {
    const note = document.createElement("s");
    note.textContent = wp.note;
    label.appendChild(note);
  }

  el.append(svg, label);
  return el;
}

const empty = (): GeoJSON.FeatureCollection => ({ type: "FeatureCollection", features: [] });

// Generous, and wider on the right: labels sit beside their dot and would clip otherwise.
const PADDING = { top: 62, bottom: 72, left: 82, right: 108 };

type Cam = { pitch: number; bearing: number };

function fit(m: MLMap, lib: ML, pts: LngLat[], maxZoom: number, duration: number, cam: Cam) {
  if (!pts.length) return;
  const bounds = pts.reduce((b, p) => b.extend(p), new lib.LngLatBounds(pts[0], pts[0]));
  m.fitBounds(bounds, { padding: PADDING, maxZoom, duration, ...cam });
}

// What survives when labels collide. A day's objective and the campsites outrank
// waypoints you pass through.
const PRIORITY: Record<Waypoint["kind"], number> = {
  goal: 0,
  camp: 1,
  start: 2,
  hut: 3,
  peak: 4,
  stop: 5,
};

type Side = "right" | "left" | "above" | "below";
const SIDES: Side[] = ["right", "left", "above", "below"];

type Placed = { el: HTMLElement; kind: Waypoint["kind"]; side: Side };

const setSide = (el: HTMLElement, side: Side) => {
  el.classList.remove("is-right", "is-left", "is-above", "is-below");
  el.classList.add(`is-${side}`);
};

const hits = (a: DOMRect, b: DOMRect) =>
  !(a.right < b.left || b.right < a.left || a.bottom < b.top || b.bottom < a.top);

/**
 * Place labels in priority order, trying each side of the dot until one is free and
 * inside the map, and hiding the label only if every side collides. Labels are
 * absolutely positioned off a zero-size marker, so moving one never shifts another
 * and a single pass suffices.
 *
 * This is what stops the campsite label vanishing behind a summit at phone size —
 * and it removes the need to hand-pick a side per waypoint for every zoom the map
 * might settle at.
 */
function declutter(placed: Placed[], container: HTMLElement | null) {
  const items = placed
    .map((p) => ({ ...p, label: p.el.querySelector<HTMLElement>(".wp-label") }))
    .filter((p): p is Placed & { label: HTMLElement } => !!p.label);
  if (!items.length) return;

  const bounds = container?.getBoundingClientRect();
  for (const p of items) {
    p.label.classList.remove("is-hidden");
    setSide(p.el, p.side);
  }

  const kept: DOMRect[] = [];
  for (const p of [...items].sort((a, b) => PRIORITY[a.kind] - PRIORITY[b.kind])) {
    const candidates: Side[] = [p.side, ...SIDES.filter((s) => s !== p.side)];
    const fits = candidates.find((side) => {
      setSide(p.el, side);
      const r = p.label.getBoundingClientRect();
      const inside =
        !bounds ||
        (r.left >= bounds.left && r.right <= bounds.right &&
          r.top >= bounds.top && r.bottom <= bounds.bottom);
      return inside && !kept.some((k) => hits(k, r));
    });

    if (fits) {
      kept.push(p.label.getBoundingClientRect());
    } else {
      setSide(p.el, p.side);
      p.label.classList.add("is-hidden");
    }
  }
}

export default function TripMap({
  views,
  activeId,
  waypoints,
  trail,
  basemap = "satellite",
}: {
  views: MapView[];
  activeId: string;
  waypoints: Waypoint[];
  /** Hovered hike, drawn over the day's map. */
  trail?: LngLat[];
  /** Which tiles to paint under the markers. */
  basemap?: Basemap;
}) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);
  const ml = useRef<ML | null>(null);
  const markers = useRef<
    { mk: import("maplibre-gl").Marker; el: HTMLElement; kind: Waypoint["kind"]; side: Side }[]
  >([]);
  const [ready, setReady] = useState(false);
  // What the active day's map is framed on, so letting go of a hovered hike can put
  // the camera back without rebuilding the view.
  const viewPts = useRef<LngLat[]>([]);
  const viewCam = useRef<Cam>({ pitch: 0, bearing: 0 });
  const hadTrail = useRef(false);

  // Create the map once. Sources and layers are declared in the initial style so
  // nothing depends on 'load' having fired before they exist.
  useEffect(() => {
    const node = box.current;
    if (!node) return;
    let cancelled = false;

    (async () => {
      // maplibre-gl v6 is ESM-only and touches window on import — keep it client-side.
      const lib = await import("maplibre-gl");
      if (cancelled || !box.current) return;
      ml.current = lib;

      // Bundled chunks break maplibre's own worker-URL resolution (it falls back to
      // "" and the GeoJSON pipeline silently never loads). Serve it from /public —
      // see scripts/copy-map-worker.mjs.
      lib.setWorkerUrl("/maplibre-gl-worker.mjs");

      const m = new lib.Map({
        container: node,
        attributionControl: false,
        maxPitch: 75,
        center: [8.5, 47],
        zoom: 5,
        style: {
          version: 8,
          sources: {
            voyager: {
              type: "raster",
              tiles: [...BASEMAPS.voyager.tiles],
              tileSize: 256,
              maxzoom: BASEMAPS.voyager.maxzoom,
              attribution: BASEMAPS.voyager.attribution,
            },
            satellite: {
              type: "raster",
              tiles: [...BASEMAPS.satellite.tiles],
              tileSize: 256,
              maxzoom: BASEMAPS.satellite.maxzoom,
              attribution: BASEMAPS.satellite.attribution,
            },
            satlabels: {
              type: "raster",
              tiles: [...BASEMAPS.satlabels.tiles],
              tileSize: 256,
              maxzoom: BASEMAPS.satlabels.maxzoom,
              attribution: BASEMAPS.satlabels.attribution,
            },
            // Mapzen terrain on AWS open data: keyless, CORS-open, ~30 m in the Alps.
            dem: {
              type: "raster-dem",
              tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
              encoding: "terrarium",
              tileSize: 256,
              maxzoom: 14,
            },
            route: { type: "geojson", data: empty() },
            trail: { type: "geojson", data: empty() },
          },
          terrain: { source: "dem", exaggeration: 1.25 },
          sky: {
            "sky-color": "#0E2A3A",
            "horizon-color": "#9FD6E8",
            "fog-color": "#0A0E10",
            "sky-horizon-blend": 0.6,
            "horizon-fog-blend": 0.5,
            "fog-ground-blend": 0.75,
          },
          layers: [
            { id: "bg", type: "background", paint: { "background-color": "#E9E8E3" } },
            {
              id: "voyager",
              type: "raster",
              source: "voyager",
              layout: { visibility: "none" },
              paint: { ...BASEMAPS.voyager.paint },
            },
            {
              id: "satellite",
              type: "raster",
              source: "satellite",
              layout: { visibility: "none" },
              paint: { ...BASEMAPS.satellite.paint },
            },
            {
              id: "satlabels",
              type: "raster",
              source: "satlabels",
              layout: { visibility: "none" },
              paint: { ...BASEMAPS.satlabels.paint },
            },
            // Pale casing under the route so it stays readable where it crosses
            // borders, lakes and road lines on the basemap.
            {
              id: "route-casing",
              type: "line",
              source: "route",
              layout: { "line-join": "round", "line-cap": "round" },
              paint: { "line-color": "#F7F6F1", "line-width": 8, "line-opacity": 0.95 },
            },
            {
              // Heavier than it needs to be for its own sake: Positron draws national
              // borders in a similar red, and the route has to win that comparison.
              id: "route",
              type: "line",
              source: "route",
              layout: { "line-join": "round", "line-cap": "round" },
              paint: { "line-color": "#C0342A", "line-width": 3.4 },
            },
            // The hovered hike. Above the route so it wins where the two overlap, and
            // dashed so it never reads as another road on the topo sheet.
            {
              id: "trail-casing",
              type: "line",
              source: "trail",
              layout: { "line-join": "round", "line-cap": "round" },
              paint: { "line-color": "#FFFFFF", "line-width": 7, "line-opacity": 0.9 },
            },
            {
              id: "trail",
              type: "line",
              source: "trail",
              layout: { "line-join": "round", "line-cap": "round" },
              paint: { "line-color": "#C0342A", "line-width": 3.2, "line-dasharray": [2.4, 1.2] },
            },
          ],
        },
      });

      m.addControl(new lib.AttributionControl({ compact: true }), "bottom-right");
      m.addControl(new lib.NavigationControl({ visualizePitch: true }), "top-right");
      m.addControl(new lib.ScaleControl({ maxWidth: 84, unit: "metric" }), "bottom-left");

      map.current = m;
      m.on("load", () => !cancelled && setReady(true));
      // Which labels collide depends on the camera, so recheck once it settles —
      // after the fly-in, and after any pan or zoom.
      m.on("moveend", () => declutter(markers.current, box.current));
    })();

    return () => {
      cancelled = true;
      markers.current.forEach(({ mk }) => mk.remove());
      markers.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Apply the active view: swap basemap, redraw route, replace markers, fly the camera.
  useEffect(() => {
    const m = map.current;
    const lib = ml.current;
    if (!ready || !m || !lib) return;

    const view = views.find((v) => v.id === activeId) ?? views[0];
    if (!view) return;

    const byId = new Map(waypoints.map((w) => [w.id, w]));
    const marked = view.waypoints.map((id) => byId.get(id)).filter((w): w is Waypoint => !!w);
    const line: [number, number][] =
      view.routeLine ??
      (view.route ?? []).map((id) => byId.get(id)?.at).filter((p): p is [number, number] => !!p);

    const src = m.getSource("route") as import("maplibre-gl").GeoJSONSource;
    src.setData(
      line.length > 1
        ? {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: line },
          }
        : empty(),
    );

    markers.current.forEach(({ mk }) => mk.remove());
    markers.current = marked.map((wp) => {
      const el = markerEl(wp);
      return {
        mk: new lib.Marker({ element: el, anchor: "center", opacityWhenCovered: "1" }).setLngLat(wp.at).addTo(m),
        el,
        kind: wp.kind,
        side: (wp.labelSide ?? "right") as Side,
      };
    });
    declutter(markers.current, box.current);

    const pts = [...marked.map((w) => w.at), ...line];
    viewPts.current = pts;
    viewCam.current = { pitch: view.pitch ?? 0, bearing: view.bearing ?? 0 };
    // The pane can settle to its final size after the map is built; without this the
    // fit is computed against a stale width and drifts off-centre.
    m.resize();
    fit(m, lib, pts, 14, 1800, viewCam.current);
  }, [ready, activeId, views, waypoints]);

  // Basemap swapping is kept apart from the effect above on purpose: it must not
  // rebuild the markers or touch the camera. Zoom into the Hörnli ridge, tap Satellite,
  // and you stay on the ridge.
  useEffect(() => {
    const m = map.current;
    if (!ready || !m) return;

    for (const id of BASEMAP_LAYERS) {
      // Place names ride along with the imagery rather than being selectable alone.
      const on = id === basemap || (id === "satlabels" && basemap === "satellite");
      m.setLayoutProperty(id, "visibility", on ? "visible" : "none");
    }

    // Drives the marker palette.
    box.current?.setAttribute("data-basemap", basemap);
  }, [ready, basemap]);

  // Its own effect: hovering a hike must not rebuild the markers, only redraw the
  // trail and move the camera onto it. Zooming in is the point — several of these
  // routes are a few km across on a map framed to a whole valley, and at that scale
  // the line is a squiggle behind the labels.
  useEffect(() => {
    const m = map.current;
    const lib = ml.current;
    if (!ready || !m || !lib) return;

    const drawn = trail && trail.length > 1 ? trail : null;
    const src = m.getSource("trail") as import("maplibre-gl").GeoJSONSource;
    src.setData(
      drawn
        ? { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: drawn } }
        : empty(),
    );

    // Restore the day's framing only on the way out of a hover, never on mount —
    // otherwise this fires alongside the view effect and the two fight over the camera.
    if (!drawn && !hadTrail.current) return;
    hadTrail.current = !!drawn;

    // Quick, because this tracks the pointer: a leisurely fly makes moving between the
    // two options feel like the map is lagging behind you.
    fit(m, lib, drawn ?? viewPts.current, drawn ? 15 : 14, 500, viewCam.current);
  }, [ready, trail]);

  return <div className="mapbox" ref={box} role="img" aria-label={activeId} />;
}

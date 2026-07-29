"use client";

import { useEffect, useRef, useState } from "react";
import type { MapView, Waypoint } from "@/lib/types";

type ML = typeof import("maplibre-gl");
type MLMap = import("maplibre-gl").Map;

const BASEMAPS = {
  // CARTO Positron, label-free: pale and legible with clear national borders, and
  // no place names of its own to fight the waypoint labels we draw ourselves.
  osm: {
    tiles: ["https://basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"],
    maxzoom: 20,
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
    paint: { "raster-saturation": 0, "raster-contrast": 0.06, "raster-opacity": 1 },
  },
  // Greyscale, and faded back hard. The colour sheet is a beautiful map but it is
  // dense with its own type at this zoom and buries our waypoints. Muted to an
  // underlay it still shows every trail and contour without competing for attention.
  swisstopo: {
    tiles: [
      "https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/3857/{z}/{x}/{y}.jpeg",
    ],
    maxzoom: 17,
    attribution: '© <a href="https://www.swisstopo.admin.ch/">swisstopo</a>',
    paint: { "raster-saturation": 0, "raster-contrast": -0.05, "raster-opacity": 0.72 },
  },
} as const;

// Colours resolve from CSS vars set on the map container, which flip with the
// basemap — the dark drive map and the bright swisstopo sheets need opposite ink.
// Deliberately large. These sit on printed map sheets already full of type and
// line work — a subtle dot loses every time.
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

export default function TripMap({
  views,
  activeId,
  waypoints,
}: {
  views: MapView[];
  activeId: string;
  waypoints: Waypoint[];
}) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);
  const ml = useRef<ML | null>(null);
  const markers = useRef<import("maplibre-gl").Marker[]>([]);
  const [ready, setReady] = useState(false);

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
        // Trackpad pinch (which the OS sends as ctrl+wheel) and ⌘/ctrl+scroll zoom the
        // map; a plain two-finger scroll still scrolls the page. Without this a sticky
        // half-screen map swallows the wheel and you can't scroll past it.
        cooperativeGestures: true,
        center: [8.5, 47],
        zoom: 5,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: [...BASEMAPS.osm.tiles],
              tileSize: 256,
              maxzoom: BASEMAPS.osm.maxzoom,
              attribution: BASEMAPS.osm.attribution,
            },
            swisstopo: {
              type: "raster",
              tiles: [...BASEMAPS.swisstopo.tiles],
              tileSize: 256,
              maxzoom: BASEMAPS.swisstopo.maxzoom,
              // swisstopo only covers the Alps and 400s below z8. Without these the
              // fly-down from the country-level view requests tiles it won't serve.
              minzoom: 8,
              bounds: [5.6, 45.6, 10.8, 48.0],
              attribution: BASEMAPS.swisstopo.attribution,
            },
            route: { type: "geojson", data: empty() },
          },
          layers: [
            { id: "bg", type: "background", paint: { "background-color": "#E9E8E3" } },
            {
              id: "osm",
              type: "raster",
              source: "osm",
              layout: { visibility: "none" },
              paint: { ...BASEMAPS.osm.paint },
            },
            {
              id: "swisstopo",
              type: "raster",
              source: "swisstopo",
              layout: { visibility: "none" },
              paint: { ...BASEMAPS.swisstopo.paint },
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
          ],
        },
      });

      m.addControl(new lib.AttributionControl({ compact: true }), "bottom-right");
      m.addControl(new lib.NavigationControl({ showCompass: false }), "top-right");
      m.addControl(new lib.ScaleControl({ maxWidth: 84, unit: "metric" }), "bottom-left");

      map.current = m;
      m.on("load", () => !cancelled && setReady(true));
    })();

    return () => {
      cancelled = true;
      markers.current.forEach((mk) => mk.remove());
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
    const line = (view.route ?? [])
      .map((id) => byId.get(id)?.at)
      .filter((p): p is [number, number] => !!p);

    // Lets CSS thin the labels out on the wide-area drive map at phone sizes.
    box.current?.setAttribute("data-basemap", view.basemap);

    m.setLayoutProperty("osm", "visibility", view.basemap === "osm" ? "visible" : "none");
    m.setLayoutProperty(
      "swisstopo",
      "visibility",
      view.basemap === "swisstopo" ? "visible" : "none",
    );

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

    markers.current.forEach((mk) => mk.remove());
    markers.current = marked.map((wp) =>
      new lib.Marker({ element: markerEl(wp), anchor: "center" }).setLngLat(wp.at).addTo(m),
    );

    const pts = [...marked.map((w) => w.at), ...line];
    if (pts.length) {
      const bounds = pts.reduce((b, p) => b.extend(p), new lib.LngLatBounds(pts[0], pts[0]));
      // The pane can settle to its final size after the map is built; without this the
      // fit is computed against a stale width and drifts off-centre.
      m.resize();
      m.fitBounds(bounds, {
        // Generous side padding: labels sit beside their dot and would clip otherwise.
        padding: { top: 62, bottom: 72, left: 82, right: 108 },
        maxZoom: 14,
        duration: 900,
      });
    }
  }, [ready, activeId, views, waypoints]);

  return <div className="mapbox" ref={box} role="img" aria-label={activeId} />;
}

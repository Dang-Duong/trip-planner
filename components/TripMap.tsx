"use client";

import { useEffect, useRef, useState } from "react";
import type { MapView, Waypoint } from "@/lib/types";

type ML = typeof import("maplibre-gl");
type MLMap = import("maplibre-gl").Map;

const BASEMAPS = {
  // CARTO dark, label-free: the basemap's own place names would fight our waypoint
  // labels, so we use the no-labels build and put every label on ourselves.
  osm: {
    tiles: ["https://basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"],
    maxzoom: 19,
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
    paint: { "raster-saturation": 0, "raster-contrast": 0, "raster-opacity": 1 },
  },
  swisstopo: {
    tiles: [
      "https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg",
    ],
    maxzoom: 17,
    attribution: '© <a href="https://www.swisstopo.admin.ch/">swisstopo</a>',
    // Bright topo sheet against dark chrome — knock it back just enough to sit in the UI.
    paint: { "raster-saturation": -0.1, "raster-contrast": 0.02, "raster-opacity": 0.96 },
  },
} as const;

// Colours resolve from CSS vars set on the map container, which flip with the
// basemap — the dark drive map and the bright swisstopo sheets need opposite ink.
const MARKER_STYLE: Record<Waypoint["kind"], { fill: string; stroke: string; r: number }> = {
  camp: { fill: "var(--map-accent)", stroke: "var(--map-halo)", r: 6 },
  start: { fill: "var(--map-cool)", stroke: "var(--map-halo)", r: 5.5 },
  hut: { fill: "var(--map-cool)", stroke: "var(--map-halo)", r: 5 },
  peak: { fill: "var(--map-ink)", stroke: "var(--map-halo)", r: 3.5 },
  stop: { fill: "var(--map-dot)", stroke: "var(--map-ink)", r: 4 },
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
  circle.setAttribute("stroke-width", "2");
  svg.appendChild(circle);

  const label = document.createElement("span");
  label.className =
    "wp-label" + (wp.kind === "camp" ? " is-camp" : wp.kind === "peak" ? " is-peak" : "");
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
            { id: "bg", type: "background", paint: { "background-color": "#06090A" } },
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
            {
              id: "route-glow",
              type: "line",
              source: "route",
              layout: { "line-join": "round", "line-cap": "round" },
              paint: {
                "line-color": "#FF5A45",
                "line-width": 9,
                "line-blur": 8,
                "line-opacity": 0.45,
              },
            },
            {
              id: "route",
              type: "line",
              source: "route",
              layout: { "line-join": "round", "line-cap": "round" },
              paint: { "line-color": "#FF5A45", "line-width": 2.4 },
            },
          ],
        },
      });

      m.addControl(new lib.AttributionControl({ compact: true }), "bottom-right");
      m.addControl(new lib.NavigationControl({ showCompass: false }), "top-right");
      m.addControl(new lib.ScaleControl({ maxWidth: 84, unit: "metric" }), "bottom-left");
      m.scrollZoom.disable(); // the page scrolls past this; don't hijack the wheel

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

    // Bright topo sheets need dark ink and a light halo; the dark drive map the reverse.
    box.current?.classList.toggle("on-light", view.basemap === "swisstopo");

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

import type { ReactNode } from "react";

export type LngLat = [number, number];

export type WaypointKind = "start" | "stop" | "camp" | "peak" | "hut";

export type Waypoint = {
  id: string;
  name: string;
  at: LngLat;
  kind: WaypointKind;
  /** Shown under the name on the map: elevation, time, whatever is worth the pixels. */
  note?: string;
  /** Where the label sits relative to the dot. Use to pull apart labels that collide. */
  labelSide?: "left" | "right" | "above" | "below";
};

export type MapView = {
  id: string;
  title: string;
  basemap: "osm" | "swisstopo";
  /** Waypoint ids to mark. Also what the map fits its bounds to. */
  waypoints: string[];
  /** Waypoint ids drawn as a connected line, in order. Omit for marker-only maps. */
  route?: string[];
  note?: string;
};

export type Leg = { time: string; text: ReactNode };

export type Day = {
  date: string;
  title: string;
  meta: string;
  legs: Leg[];
  note?: ReactNode;
  /** Which MapView the sticky map shows while this day is on screen. */
  mapId?: string;
};

export type PackItem = { label: ReactNode; sub?: string };
export type PackGroup = { title: string; items: PackItem[] };

export type Pin = {
  when: string;
  what: ReactNode;
  sub?: ReactNode;
  cost: ReactNode;
  href: string;
  linkLabel: string;
};

export type PrepRow = { what: ReactNode; when: string };
export type Stat = { value: string; label: string };
export type Source = { label: string; href: string };

export type Trip = {
  slug: string;
  title: string;
  titleAccent?: string;
  titleTail?: string;
  dates: string;
  /** Full header line on the trip page. Leads with the dates. */
  subtitle: string;
  /** Index-card line. Omits the dates — the card already shows them. */
  blurb: string;
  stats: Stat[];
  waypoints: Waypoint[];
  maps: MapView[];
  pins: Pin[];
  pinsNote?: ReactNode;
  flagsTitle: string;
  flags: ReactNode[];
  days: Day[];
  pack: PackGroup[];
  prep: PrepRow[];
  sources: Source[];
  sourcesNote?: string;
};

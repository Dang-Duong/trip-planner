import type { ReactNode } from "react";

export type LngLat = [number, number];

/** `peak` is scenery for orientation; `goal` is what the day is actually aiming at. */
export type WaypointKind = "start" | "stop" | "camp" | "peak" | "hut" | "goal";

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
  /** Waypoint ids joined into a line, in order. A schematic — fine at hiking scale. */
  route?: string[];
  /**
   * Real road geometry, baked in rather than fetched. Straight lines between cities
   * are visibly not the road you drive, which matters on a map people navigate by.
   * Regenerate with OSRM — see the note in the trip data.
   */
  routeLine?: LngLat[];
  note?: string;
};

export type Leg = { time: string; text: ReactNode };

/** One of several ways a day could be run, each with its own timeline. */
export type DayOption = {
  name: string;
  /** komoot tour for this route. */
  href?: string;
  meta: string;
  legs: Leg[];
  note?: ReactNode;
  /** Trail geometry, drawn on the map while this option is hovered. Baked in like
   *  `MapView.routeLine` — see the note in the trip data for how to regenerate. */
  line?: LngLat[];
};

export type Day = {
  date: string;
  title: string;
  meta: string;
  /** Used when the day has a single plan. Ignored if `options` is set. */
  legs: Leg[];
  note?: ReactNode;
  /** Undecided days carry the candidates side by side instead of one timeline. */
  options?: DayOption[];
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

/** A candidate route, linked out to its komoot tour. */
export type Hike = {
  name: string;
  href: string;
  when: string;
  km: string;
  ascent: string;
  time: string;
  high: string;
  grade: string;
  note?: ReactNode;
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
  hikes: Hike[];
  hikesNote?: ReactNode;
  pack: PackGroup[];
  prep: PrepRow[];
  sources: Source[];
  sourcesNote?: string;
};

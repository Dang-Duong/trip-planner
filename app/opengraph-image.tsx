import { ogCard, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Čongus Trip Planner";

export default function Image() {
  return ogCard({
    kicker: "Čongus Trip Planner",
    title: "Trips",
    line: "Maps, timings, parking, packing. One page each.",
  });
}

import { ogCard, OG_SIZE } from "@/lib/og";
import { getTrip, trips } from "@/trips";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Trip plan";

export const generateStaticParams = () => trips.map((t) => ({ slug: t.slug }));

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const trip = getTrip((await params).slug);
  if (!trip) return ogCard({ kicker: "Čongus Trip Planner", title: "Trips", line: "" });
  return ogCard({
    kicker: trip.dates,
    title: trip.title,
    accent: trip.titleAccent,
    tail: trip.titleTail,
    line: trip.blurb,
    stats: trip.stats,
  });
}

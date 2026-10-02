import Dock from "@/components/Dock";
import { getTrip } from "@/trips";

// The dock lives here rather than in each page so it stays mounted, and in place,
// while you move between the plan, the shop and the money pages.
export default async function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = getTrip(slug);
  return (
    <>
      {children}
      {trip && <Dock slug={slug} shop={!!trip.shop} />}
    </>
  );
}

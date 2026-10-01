import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TripView from "@/components/TripView";
import { getTrip, trips } from "@/trips";

export const generateStaticParams = () => trips.map((t) => ({ slug: t.slug }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const trip = getTrip((await params).slug);
  if (!trip) return {};
  const title = `${trip.title} ${trip.titleAccent ?? ""} ${trip.titleTail ?? ""} · ${trip.dates}`.trim();
  // A child's openGraph replaces the layout's wholesale, so the shared fields come along.
  return {
    title,
    description: trip.subtitle,
    openGraph: { title, description: trip.subtitle, siteName: "Čongus Trip Planner", type: "website" },
    twitter: { card: "summary_large_image", title, description: trip.subtitle },
  };
}

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getTrip(slug)) notFound();
  return <TripView slug={slug} />;
}

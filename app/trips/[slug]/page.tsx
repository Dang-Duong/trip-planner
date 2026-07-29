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
  return {
    title: `${trip.title} ${trip.titleAccent ?? ""} ${trip.titleTail ?? ""} · ${trip.dates}`.trim(),
    description: trip.subtitle,
  };
}

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getTrip(slug)) notFound();
  return <TripView slug={slug} />;
}

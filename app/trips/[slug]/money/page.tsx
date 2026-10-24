import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MoneyView from "@/components/MoneyView";
import { getTrip, trips } from "@/trips";

export const generateStaticParams = () =>
  trips.filter((t) => t.people.length > 1).map((t) => ({ slug: t.slug }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const trip = getTrip((await params).slug);
  if (!trip) return {};
  return {
    title: `Who owes whom · ${trip.title} ${trip.titleTail ?? ""}`.replace(/\s+/g, " ").trim(),
    description: `Split the costs for ${trip.dates} — enter a receipt, tick who it was for, and settle up.`,
  };
}

export default async function MoneyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if ((getTrip(slug)?.people.length ?? 0) < 2) notFound();
  return <MoneyView slug={slug} />;
}

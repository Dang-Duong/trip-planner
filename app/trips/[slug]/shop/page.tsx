import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShopView from "@/components/ShopView";
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
    title: `Who buys what · ${trip.title} ${trip.titleTail ?? ""}`.replace(/\s+/g, " ").trim(),
    description: `The shopping split for ${trip.dates} — one category each, so nobody buys the same thing twice.`,
  };
}

export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getTrip(slug)) notFound();
  return <ShopView slug={slug} />;
}

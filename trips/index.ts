import type { Trip } from "@/lib/types";
import { chamonixMatterhorn2026 } from "./chamonix-matterhorn-2026";
import { hochschwab2026 } from "./hochschwab-2026";

export const trips: Trip[] = [hochschwab2026, chamonixMatterhorn2026];

export const getTrip = (slug: string) => trips.find((t) => t.slug === slug);

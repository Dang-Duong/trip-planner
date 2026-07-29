import type { Trip } from "@/lib/types";
import { chamonixMatterhorn2026 } from "./chamonix-matterhorn-2026";

export const trips: Trip[] = [chamonixMatterhorn2026];

export const getTrip = (slug: string) => trips.find((t) => t.slug === slug);

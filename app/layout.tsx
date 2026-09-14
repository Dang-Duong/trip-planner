import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

// Self-hosted by next/font, so no request to Google at runtime and no swap flash.
// Archivo is variable on both width and weight — the headline voice is the narrow,
// heavy end of it, which is why the `wdth` axis has to come along.
const display = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--f-display",
});
const sans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--f-sans",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  variable: "--f-mono",
});

// Vercel sets this at build time, so links shared out of the group chat resolve
// without a hardcoded domain here. Falls back to the dev server locally.
const site = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const description = "Group trip plans — maps, timings, parking, packing.";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "Čongus Trip Planner",
    // Trip pages lead with their own name — a tab truncates to about 20 characters
    // and "Chamonix → Matterhorn" is what has to survive that.
    template: "%s · Čongus",
  },
  description,
  applicationName: "Čongus Trip Planner",
  openGraph: {
    siteName: "Čongus Trip Planner",
    type: "website",
    locale: "en_GB",
    title: "Čongus Trip Planner",
    description,
  },
  twitter: { card: "summary", title: "Čongus Trip Planner", description },
};

// Phones are where this gets read, and the dark page looks wrong behind light
// browser chrome. Separate from `metadata` — Next moved themeColor here.
export const viewport: Viewport = { themeColor: "#0A0E10" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

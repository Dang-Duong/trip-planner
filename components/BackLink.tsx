import type { CSSProperties } from "react";
import Link from "next/link";
import { PARTICLES } from "@/components/ShopLink";

/** Floats top-left on the shopping split and returns to the map. */
export default function BackLink({
  slug,
  label,
  sub,
}: {
  slug: string;
  label: string;
  sub: string;
}) {
  return (
    <Link className="fab back" href={`/trips/${slug}`}>
      <span className="trail" aria-hidden="true">
        {PARTICLES.map((i) => (
          <i key={i} style={{ "--i": i } as CSSProperties} />
        ))}
      </span>
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M10 5 3 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 12h7a11 11 0 0 1 11 11" strokeLinecap="round" />
      </svg>
      <span className="fab-t">
        {label}
        <b>{sub}</b>
      </span>
    </Link>
  );
}

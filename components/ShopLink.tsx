import type { CSSProperties } from "react";
import Link from "next/link";

/** Nine is enough to read as a stream without the staggered delays visibly repeating. */
export const PARTICLES = [0, 1, 2, 3, 4, 5, 6, 7, 8];

/** Floats over the plan and launches the shopping split, which is its own page now. */
export default function ShopLink({ slug, lists }: { slug: string; lists: number }) {
  return (
    <Link className="fab launch" href={`/trips/${slug}/shop`}>
      <span className="exhaust" aria-hidden="true">
        {PARTICLES.map((i) => (
          <i key={i} style={{ "--i": i } as CSSProperties} />
        ))}
      </span>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2c3.2 2.4 5 6 5 10v3l2 2.5V21l-3.4-1.4h-7.2L5 21v-3.5L7 15v-3c0-4 1.8-7.6 5-10Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      <span className="fab-t">
        Who buys what
        <b>{lists} lists</b>
      </span>
    </Link>
  );
}

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";

/** Nine is enough to read as a stream without the staggered delays visibly repeating. */
const PARTICLES = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export const ROCKET = (
  <>
    <path
      d="M12 2c3.2 2.4 5 6 5 10v3l2 2.5V21l-3.4-1.4h-7.2L5 21v-3.5L7 15v-3c0-4 1.8-7.6 5-10Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="10" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </>
);

export const ARROW = (
  <g fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M10 5 3 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 12h7a11 11 0 0 1 11 11" strokeLinecap="round" />
  </g>
);

export const COINS = (
  <g fill="none" stroke="currentColor" strokeWidth="1.6">
    <ellipse cx="12" cy="6.5" rx="7" ry="3" />
    <path d="M5 6.5v11c0 1.7 3.1 3 7 3s7-1.3 7-3v-11" strokeLinecap="round" />
    <path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" strokeLinecap="round" />
  </g>
);

/**
 * The floating capsules. `launch` sits bottom-right and goes forward; `back` sits
 * top-left and returns. Every page in the chain uses the same two corners, so the
 * way out is always in the same place.
 */
export default function Fab({
  href,
  label,
  sub,
  icon,
  variant,
}: {
  href: string;
  label: string;
  sub: string;
  icon: ReactNode;
  variant: "launch" | "back";
}) {
  return (
    <Link className={`fab ${variant}`} href={href}>
      <span className={variant === "launch" ? "exhaust" : "trail"} aria-hidden="true">
        {PARTICLES.map((i) => (
          <i key={i} style={{ "--i": i } as CSSProperties} />
        ))}
      </span>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {icon}
      </svg>
      <span className="fab-t">
        {label}
        <b>{sub}</b>
      </span>
    </Link>
  );
}

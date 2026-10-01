import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

const BG = "#0A0E10";
const INK = "#EAF0F2";
const STONE = "#63727A";
const RULE = "#1F282C";
const GLACIER = "#5FC9E8";
const BLAZE = "#FF5A45";

// ponytail: fetched at build, falls back to the bundled Geist if Google Fonts is unreachable.
async function archivo(): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch("https://fonts.googleapis.com/css2?family=Archivo:wght@800")).text();
    const url = /src: url\((.+?)\)/.exec(css)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** The ridge from Le Buet up to the summit and over: a skyline, not a survey. */
const RIDGE = "0,250 120,190 190,215 300,110 360,150 430,40 520,130 600,90 720,200 800,170 900,250";

export async function ogCard({
  kicker,
  title,
  accent,
  tail,
  line,
  stats = [],
}: {
  kicker: string;
  title: string;
  accent?: string;
  tail?: string;
  line: string;
  stats?: { value: string; label: string }[];
}) {
  const font = await archivo();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: BG,
          color: INK,
          padding: "64px 72px",
          position: "relative",
          fontFamily: "Geist",
        }}
      >
        <svg
          width="560"
          height="156"
          viewBox="0 0 900 250"
          style={{ position: "absolute", right: 0, bottom: 0, opacity: 0.9 }}
        >
          <polygon points={`${RIDGE} 900,250 0,250`} fill="#12181B" />
          <polyline points={RIDGE} fill="none" stroke={GLACIER} strokeWidth="3" />
          <circle cx="430" cy="40" r="9" fill={BLAZE} />
        </svg>

        <div style={{ display: "flex", gap: 8 }}>
          {[1, 0.6, 0.3].map((o) => (
            <div key={o} style={{ width: 22, height: 22, background: BLAZE, opacity: o }} />
          ))}
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: GLACIER,
          }}
        >
          {kicker}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            marginTop: 14,
            fontSize: 78,
            lineHeight: 1,
            fontFamily: font ? "Archivo" : "Geist",
            textTransform: "uppercase",
            letterSpacing: -1,
          }}
        >
          <span>{title}</span>
          {accent && <span style={{ color: BLAZE }}>{accent}</span>}
          {tail && <span>{tail}</span>}
        </div>

        <div style={{ marginTop: 22, fontSize: 28, color: STONE, maxWidth: 1000 }}>{line}</div>

        {stats.length > 0 && (
          <div style={{ display: "flex", marginTop: "auto", gap: 0 }}>
            {stats.slice(0, 3).map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "14px 30px 14px 0",
                  marginRight: 30,
                  borderRight: `1px solid ${RULE}`,
                }}
              >
                <span style={{ fontSize: 40, color: GLACIER }}>{s.value}</span>
                <span
                  style={{ fontSize: 18, color: STONE, letterSpacing: 3, textTransform: "uppercase" }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: font ? [{ name: "Archivo", data: font, weight: 800, style: "normal" }] : undefined,
    },
  );
}

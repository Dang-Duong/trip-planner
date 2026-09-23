import { isOp, MAX_OPS, toEntries, type Op, type TripState } from "@/lib/sync-ops";

// Ticks change under us constantly — never let a CDN answer a GET from cache.
export const dynamic = "force-dynamic";

// Vercel's Upstash integration injects KV_*; a hand-made Upstash database uses its own
// names. Accept either, and treat "neither" as "run local-only" rather than an error.
const URL_ = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

const SLUG = /^[a-z0-9-]{1,64}$/;

type Cmd = (string | number)[];

async function pipeline(cmds: Cmd[]): Promise<unknown[]> {
  const res = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`upstash ${res.status}`);

  const out = (await res.json()) as { result?: unknown; error?: string }[];
  const failed = out.find((r) => r.error);
  if (failed) throw new Error(failed.error);
  return out.map((r) => r.result);
}

const keys = (slug: string) => [`trip:${slug}:shop`, `trip:${slug}:money`] as const;

/** The two reads that answer every request, appended after any writes in the same trip. */
const readCmds = (slug: string): Cmd[] => {
  const [shop, money] = keys(slug);
  return [
    ["SMEMBERS", shop],
    ["HVALS", money],
  ];
};

function readState(results: unknown[]): TripState {
  const [shop, money] = results.slice(-2);
  return {
    shop: Array.isArray(shop) ? shop.map(String) : [],
    money: toEntries(
      (Array.isArray(money) ? money : []).map((v) => {
        try {
          return JSON.parse(String(v));
        } catch {
          return null; // a hand-edited or truncated field shouldn't take the page down
        }
      }),
    ),
  };
}

function writeCmds(slug: string, ops: Op[]): Cmd[] {
  const [shopKey, moneyKey] = keys(slug);
  return ops.map((op) => {
    if (op.k === "tick") return [op.on ? "SADD" : "SREM", shopKey, op.id];
    if (op.k === "clear") return ["DEL", shopKey];
    if (op.k === "put") return ["HSET", moneyKey, op.entry.id, JSON.stringify(op.entry)];
    return ["HDEL", moneyKey, op.id];
  });
}

const noStore = () =>
  Response.json({ error: "store not configured" }, { status: 503 });

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  if (!SLUG.test(slug)) return Response.json({ error: "bad slug" }, { status: 400 });
  if (!URL_ || !TOKEN) return noStore();

  try {
    return Response.json(readState(await pipeline(readCmds(slug))));
  } catch {
    return Response.json({ error: "store unreachable" }, { status: 502 });
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  if (!SLUG.test(slug)) return Response.json({ error: "bad slug" }, { status: 400 });
  if (!URL_ || !TOKEN) return noStore();

  let ops: unknown;
  try {
    ({ ops } = (await req.json()) as { ops?: unknown });
  } catch {
    return Response.json({ error: "bad body" }, { status: 400 });
  }

  // A public write endpoint: cap the batch and check every op before it reaches Redis.
  if (!Array.isArray(ops) || ops.length > MAX_OPS || !ops.every(isOp)) {
    return Response.json({ error: "bad ops" }, { status: 400 });
  }

  try {
    // Writes and the two reads travel as one pipeline, so the response already reflects
    // this client's ops and it never has to wait a poll to see its own tick.
    const results = await pipeline([...writeCmds(slug, ops as Op[]), ...readCmds(slug)]);
    return Response.json(readState(results));
  } catch {
    return Response.json({ error: "store unreachable" }, { status: 502 });
  }
}

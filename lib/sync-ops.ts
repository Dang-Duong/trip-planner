/**
 * The unit of change the API, the client cache and the offline outbox all speak.
 *
 * Ops rather than whole documents, because fourteen people tick at once: two clients
 * that each PUT their own copy of the list would take turns clobbering each other,
 * while `tick` and `put` land as one Redis command each and commute.
 *
 * Every op is idempotent — replaying the outbox after a timeout can only be a no-op.
 */
export type Op =
  | { k: "tick"; id: string; on: boolean }
  | { k: "clear" }
  | { k: "put"; entry: Entry }
  | { k: "drop"; id: string };

/** Anything stored by id — in practice an `Expense`. */
export type Entry = { id: string } & Record<string, unknown>;

export type TripState = { shop: string[]; money: Entry[] };

export const EMPTY_STATE: TripState = { shop: [], money: [] };

export const MAX_OPS = 200;
export const MAX_ENTRY_BYTES = 2000;

export function applyOps(state: TripState, ops: readonly Op[]): TripState {
  if (ops.length === 0) return state;

  const shop = new Set(state.shop);
  const money = new Map(state.money.map((e) => [e.id, e]));

  for (const op of ops) {
    if (op.k === "tick") {
      if (op.on) shop.add(op.id);
      else shop.delete(op.id);
    } else if (op.k === "clear") {
      shop.clear();
    } else if (op.k === "put") {
      money.set(op.entry.id, op.entry);
    } else {
      money.delete(op.id);
    }
  }

  return { shop: [...shop], money: [...money.values()] };
}

/**
 * MoneyView hands over a whole array, so turn "before" and "after" into per-receipt
 * ops. Without this, one person adding a receipt while another marks a transfer paid
 * would overwrite whichever write landed second.
 */
export function diffEntries(prev: readonly Entry[], next: readonly Entry[]): Op[] {
  const before = new Map(prev.map((e) => [e.id, JSON.stringify(e)]));
  const ops: Op[] = [];
  const kept = new Set<string>();

  for (const entry of next) {
    kept.add(entry.id);
    if (before.get(entry.id) !== JSON.stringify(entry)) ops.push({ k: "put", entry });
  }
  for (const entry of prev) {
    if (!kept.has(entry.id)) ops.push({ k: "drop", id: entry.id });
  }
  return ops;
}

/** Only things carrying a string id can be addressed by an op. */
export function toEntries(raw: unknown): Entry[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (e): e is Entry => !!e && typeof e === "object" && typeof (e as Entry).id === "string",
  );
}

const id = (v: unknown) => typeof v === "string" && v.length > 0 && v.length <= 64;

/** The route handler is a public endpoint, so nothing gets to Redis unvalidated. */
export function isOp(v: unknown): v is Op {
  if (!v || typeof v !== "object") return false;
  const op = v as Record<string, unknown>;
  switch (op.k) {
    case "tick":
      return id(op.id) && typeof op.on === "boolean";
    case "clear":
      return true;
    case "drop":
      return id(op.id);
    case "put": {
      const entry = op.entry as Entry | undefined;
      if (!entry || typeof entry !== "object" || !id(entry.id)) return false;
      return JSON.stringify(entry).length <= MAX_ENTRY_BYTES;
    }
    default:
      return false;
  }
}

// BREAKAWAY: deals board — remove at platform launch
//
// Server-side deal loader. The "database" is content/deals/*.json — one
// file per deal, read with fs at BUILD time (every page in this group is
// fully static, so no runtime fs access happens on Vercel). Files whose
// names start with "_" (schema, template) are ignored. No fetch calls,
// no backend, no auth. See DEALS_BREAKAWAY.md.

import fs from "node:fs";
import path from "node:path";
import configRaw from "@/content/deals-config.json";
import type { Deal, DealsConfig, DealStatus } from "./deal-shared";

export * from "./deal-shared";

const DEALS_DIR = path.join(process.cwd(), "content", "deals");

const STATUS_ORDER: Record<DealStatus, number> = {
  available: 0,
  pending: 1,
  sold: 2
};

// Skips anything malformed enough to be missing an id/address instead of
// crashing the build — a founder-edited file should never take the site down.
function isDeal(entry: unknown): entry is Deal {
  if (typeof entry !== "object" || entry === null) return false;
  const candidate = entry as Record<string, unknown>;
  return typeof candidate.id === "string" && typeof candidate.address === "string";
}

export function getDeals(): Deal[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(DEALS_DIR);
  } catch {
    return [];
  }
  const deals: Deal[] = [];
  for (const file of files) {
    if (!file.endsWith(".json") || file.startsWith("_")) continue;
    try {
      const parsed: unknown = JSON.parse(
        fs.readFileSync(path.join(DEALS_DIR, file), "utf8")
      );
      if (isDeal(parsed)) deals.push(parsed);
    } catch {
      // Malformed JSON in one deal file must not break the board.
    }
  }
  return deals.sort((a, b) => {
    const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (byStatus !== 0) return byStatus;
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  });
}

export function getDeal(id: string): Deal | undefined {
  return getDeals().find((deal) => deal.id === id);
}

export function getDealsConfig(): DealsConfig {
  const { phone, email, headline, subhead, repo } = configRaw;
  return { phone, email, headline, subhead, repo };
}

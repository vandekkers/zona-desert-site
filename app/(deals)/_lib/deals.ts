// BREAKAWAY: deals board — remove at platform launch
//
// Data access for the standalone /deals board. The "database" is
// content/deals.json, imported at build time — every commit to that file
// triggers a Vercel rebuild, which regenerates these fully static pages.
// No fetch calls, no backend, no auth. See DEALS_BREAKAWAY.md.

import dealsRaw from "@/content/deals.json";
import configRaw from "@/content/deals-config.json";

export type DealStatus = "available" | "pending" | "sold";

export interface Deal {
  id: string;
  status: DealStatus;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  arv: number;
  estRehab: number;
  estRent: number;
  beds: number;
  baths: number;
  sqft: number;
  lotSqft: number;
  yearBuilt: number;
  description: string;
  highlights: string[];
  photos: string[];
  closeBy?: string;
  featured?: boolean;
}

export interface DealsConfig {
  phone: string;
  email: string;
  headline: string;
  subhead: string;
}

const STATUS_ORDER: Record<DealStatus, number> = {
  available: 0,
  pending: 1,
  sold: 2
};

// The first entry of deals.json is a schema cheat-sheet object for Van,
// not a deal — this guard skips it (and anything else malformed enough
// to be missing an id/address) instead of crashing the build.
function isDeal(entry: unknown): entry is Deal {
  if (typeof entry !== "object" || entry === null) return false;
  const candidate = entry as Record<string, unknown>;
  return typeof candidate.id === "string" && typeof candidate.address === "string";
}

export function getDeals(): Deal[] {
  return (dealsRaw as unknown[]).filter(isDeal).sort((a, b) => {
    const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (byStatus !== 0) return byStatus;
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
  });
}

export function getDeal(id: string): Deal | undefined {
  return getDeals().find((deal) => deal.id === id);
}

export function getDealsConfig(): DealsConfig {
  const { phone, email, headline, subhead } = configRaw;
  return { phone, email, headline, subhead };
}

// Brand fonts are loaded once in the root layout as CSS variables; the
// repo idiom applies them via inline style (see app/__owner-access,
// components/ZonaAgentChat).
export const sora = {
  fontFamily: "var(--font-sora), system-ui, sans-serif",
  fontWeight: 600
} as const;

export const inter = {
  fontFamily: "var(--font-inter), system-ui, sans-serif"
} as const;

export function money(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

export function formatCloseBy(closeBy: string): string {
  const date = new Date(`${closeBy}T00:00:00`);
  if (Number.isNaN(date.getTime())) return closeBy;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

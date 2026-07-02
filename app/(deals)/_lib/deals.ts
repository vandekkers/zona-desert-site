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
  propertyType?: string;
  occupancy?: string;
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

// Investor math for the deal panel. Shares are % of ARV so the
// price/rehab/spread bar always sums to ~100 when the spread is positive.
export function dealMath(deal: Deal) {
  const allIn = deal.price + deal.estRehab;
  const spread = deal.arv - allIn;
  const shareOfArv = (part: number) =>
    deal.arv > 0 ? Math.max(0, Math.min(100, Math.round((part / deal.arv) * 100))) : 0;
  return {
    allIn,
    spread,
    priceShare: shareOfArv(deal.price),
    rehabShare: shareOfArv(deal.estRehab),
    spreadShare: shareOfArv(spread),
    pricePerSqft: deal.sqft > 0 ? Math.round(deal.price / deal.sqft) : null,
    arvPerSqft: deal.sqft > 0 ? Math.round(deal.arv / deal.sqft) : null,
    // Monthly rent as % of price — the "1% rule" number, one decimal.
    rentToPrice: deal.price > 0 ? Math.round((deal.estRent / deal.price) * 1000) / 10 : null
  };
}

export function googleMapsHref(deal: Deal): string {
  const query = encodeURIComponent(
    `${deal.address}, ${deal.city}, ${deal.state} ${deal.zip}`
  );
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

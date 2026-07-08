"use client";

// SITE V2 — search / sort / filter for the deal board. Client island, but
// SSR-safe: its initial render (default order, no filters) produces every
// card in the server HTML, so SEO and address anchors are unaffected;
// interactivity layers on after hydration. Dataset is small and already
// public, so all filtering is instant and client-side.

import { useMemo, useState } from "react";
import { ListingCardV2 } from "./ListingCardV2";
import type { Deal } from "../_lib/deal-shared";
import { dealStrategies, flipMath, rentalMath } from "../_lib/deal-shared";

type SortKey = "featured" | "price-asc" | "price-desc" | "cap-desc" | "spread-desc";
type StrategyKey = "any" | "rental" | "flip";
type PriceKey = "any" | "u50" | "50-100" | "100-200" | "200+";
type BedsKey = "any" | "1" | "2" | "3" | "4";

const DEFAULTS = {
  query: "",
  sort: "featured" as SortKey,
  strategy: "any" as StrategyKey,
  price: "any" as PriceKey,
  beds: "any" as BedsKey
};

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "cap-desc", label: "Highest Cap Rate" },
  { value: "spread-desc", label: "Biggest Spread" }
];
const STRATEGY_OPTIONS: Array<{ value: StrategyKey; label: string }> = [
  { value: "any", label: "Any Strategy" },
  { value: "rental", label: "Rental" },
  { value: "flip", label: "Flip" }
];
const PRICE_OPTIONS: Array<{ value: PriceKey; label: string }> = [
  { value: "any", label: "Any Price" },
  { value: "u50", label: "Under $50k" },
  { value: "50-100", label: "$50k – $100k" },
  { value: "100-200", label: "$100k – $200k" },
  { value: "200+", label: "$200k+" }
];
const BEDS_OPTIONS: Array<{ value: BedsKey; label: string }> = [
  { value: "any", label: "Any Beds" },
  { value: "1", label: "1+ Beds" },
  { value: "2", label: "2+ Beds" },
  { value: "3", label: "3+ Beds" },
  { value: "4", label: "4+ Beds" }
];

function priceInRange(price: number, key: PriceKey): boolean {
  switch (key) {
    case "u50":
      return price < 50000;
    case "50-100":
      return price >= 50000 && price < 100000;
    case "100-200":
      return price >= 100000 && price < 200000;
    case "200+":
      return price >= 200000;
    default:
      return true;
  }
}

const ChevronIcon = (
  <svg
    className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function Select<T extends string>({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <div className="relative">
      <label className="sr-only">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        aria-label={label}
        className="w-full cursor-pointer appearance-none rounded-[10px] border border-zona-navy/[0.12] bg-zona-sand py-2.5 pl-3 pr-8 text-[13.5px] font-medium text-zona-navy outline-none transition hover:border-zona-navy/25 focus:border-zona-purple-mid focus:bg-white focus:shadow-[0_0_0_3px_rgba(112,37,182,0.12)]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {ChevronIcon}
    </div>
  );
}

export function DealsExplorer({ deals }: { deals: Deal[] }) {
  const [query, setQuery] = useState(DEFAULTS.query);
  const [sort, setSort] = useState<SortKey>(DEFAULTS.sort);
  const [strategy, setStrategy] = useState<StrategyKey>(DEFAULTS.strategy);
  const [price, setPrice] = useState<PriceKey>(DEFAULTS.price);
  const [beds, setBeds] = useState<BedsKey>(DEFAULTS.beds);

  // Precompute a search haystack + sort keys per deal, once.
  const enriched = useMemo(
    () =>
      deals.map((deal, index) => {
        const rm = rentalMath(deal);
        const fm = flipMath(deal);
        const strategies = dealStrategies(deal);
        const haystack = [
          deal.address,
          deal.city,
          deal.state,
          deal.zip,
          deal.propertyType ?? "",
          ...strategies
        ]
          .join(" ")
          .toLowerCase();
        return {
          deal,
          index,
          strategies,
          haystack,
          cap: rm?.capRatePct ?? -Infinity,
          spread: fm.spread
        };
      }),
    [deals]
  );

  const filtered = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const rows = enriched.filter((row) => {
      if (terms.length && !terms.every((t) => row.haystack.includes(t))) return false;
      if (strategy !== "any" && !row.strategies.includes(strategy)) return false;
      if (!priceInRange(row.deal.price, price)) return false;
      if (beds !== "any" && row.deal.beds < Number(beds)) return false;
      return true;
    });
    const sorted = [...rows];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.deal.price - b.deal.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.deal.price - a.deal.price);
        break;
      case "cap-desc":
        sorted.sort((a, b) => b.cap - a.cap);
        break;
      case "spread-desc":
        sorted.sort((a, b) => b.spread - a.spread);
        break;
      default:
        sorted.sort((a, b) => a.index - b.index); // incoming featured order
    }
    return sorted.map((row) => row.deal);
  }, [enriched, query, sort, strategy, price, beds]);

  const isFiltered =
    query.trim() !== "" ||
    sort !== DEFAULTS.sort ||
    strategy !== DEFAULTS.strategy ||
    price !== DEFAULTS.price ||
    beds !== DEFAULTS.beds;

  function clearAll() {
    setQuery(DEFAULTS.query);
    setSort(DEFAULTS.sort);
    setStrategy(DEFAULTS.strategy);
    setPrice(DEFAULTS.price);
    setBeds(DEFAULTS.beds);
  }

  return (
    <div>
      {/* Control bar — discrete white card matching the design system */}
      <div className="flex flex-col gap-2.5 rounded-2xl border border-zona-navy/[0.07] bg-white p-2.5 shadow-card sm:flex-row sm:items-center sm:gap-2">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city, ZIP, or address"
            aria-label="Search deals"
            className="w-full rounded-[10px] border border-transparent bg-zona-sand py-2.5 pl-9 pr-3 text-[14px] text-zona-navy outline-none transition placeholder:text-slate-400 focus:border-zona-purple-mid focus:bg-white focus:shadow-[0_0_0_3px_rgba(112,37,182,0.12)]"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <Select label="Sort deals" value={sort} onChange={setSort} options={SORT_OPTIONS} />
          <Select
            label="Filter by strategy"
            value={strategy}
            onChange={setStrategy}
            options={STRATEGY_OPTIONS}
          />
          <Select label="Filter by price" value={price} onChange={setPrice} options={PRICE_OPTIONS} />
          <Select label="Filter by beds" value={beds} onChange={setBeds} options={BEDS_OPTIONS} />
        </div>
      </div>

      {/* Result count + clear */}
      <div className="mb-8 mt-2.5 flex items-center justify-between px-1 text-[13px]">
        <span className="text-slate-500">
          {filtered.length === deals.length
            ? `${deals.length} ${deals.length === 1 ? "deal" : "deals"}`
            : `${filtered.length} of ${deals.length} ${deals.length === 1 ? "deal" : "deals"}`}
        </span>
        {isFiltered && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 font-semibold text-zona-purple-mid transition hover:text-zona-purple-deep"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zona-navy/20 bg-white p-10 text-center">
          <p className="text-slate-600">No deals match those filters.</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-3 inline-flex items-center gap-1.5 rounded-[10px] border-2 border-zona-purple-mid px-5 py-2 text-[14px] font-semibold text-zona-purple-mid transition hover:bg-zona-purple-mid/[0.08]"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((deal) => (
            <ListingCardV2 key={deal.id} deal={deal} />
          ))}
        </div>
      )}
    </div>
  );
}

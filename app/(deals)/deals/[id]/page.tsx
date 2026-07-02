// BREAKAWAY: deals board — remove at platform launch

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactButtons } from "../../_components/ContactButtons";
import { DealGallery } from "../../_components/DealGallery";
import { StatusBadge } from "../../_components/StatusBadge";
import {
  formatCloseBy,
  getDeal,
  getDeals,
  getDealsConfig,
  money,
  sora
} from "../../_lib/deals";

// Fully static: every deal page is prerendered from content/deals.json at
// build time, and unknown ids 404 without any runtime data access.
export const dynamicParams = false;

export function generateStaticParams() {
  return getDeals().map((deal) => ({ id: deal.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const deal = getDeal(params.id);
  return {
    title: deal
      ? `${deal.address}, ${deal.city} ${deal.state} | Zona Deals`
      : "Deal | Zona Deals",
    robots: { index: false, follow: false }
  };
}

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const deal = getDeal(params.id);
  if (!deal) notFound();
  const config = getDealsConfig();

  const stats = [
    { label: "Asking Price", value: money(deal.price) },
    { label: "ARV", value: money(deal.arv) },
    { label: "Est. Rehab", value: money(deal.estRehab) },
    { label: "Est. Rent", value: `${money(deal.estRent)}/mo` },
    { label: "Price / Sqft", value: `$${Math.round(deal.price / deal.sqft)}` }
  ];

  const facts = [
    `${deal.beds} bd`,
    `${deal.baths} ba`,
    `${deal.sqft.toLocaleString("en-US")} sqft`,
    `${deal.lotSqft.toLocaleString("en-US")} sqft lot`,
    `Built ${deal.yearBuilt}`
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 md:pt-10 lg:pb-14">
      <Link
        href="/deals"
        className="text-sm font-semibold text-zona-purple-mid hover:text-zona-purple-deep"
      >
        ← All deals
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <DealGallery photos={deal.photos} alt={`${deal.address}, ${deal.city}`} />

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={deal.status} />
              {deal.closeBy && deal.status === "available" && (
                <span className="text-sm font-semibold text-zona-orange">
                  Close by {formatCloseBy(deal.closeBy)}
                </span>
              )}
            </div>
            <h1 className="text-2xl text-zona-navy md:text-4xl" style={sora}>
              {deal.address}
            </h1>
            <p className="text-base text-slate-500">
              {deal.city}, {deal.state} {deal.zip}
            </p>
            <p className="text-sm font-semibold text-slate-600">{facts.join(" · ")}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-1 text-lg font-bold text-zona-navy">{stat.value}</p>
              </div>
            ))}
          </div>

          {deal.highlights.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg text-zona-navy" style={sora}>
                Why this deal
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {deal.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 rounded-2xl bg-white p-3 text-sm text-slate-700"
                  >
                    <span className="mt-0.5 font-bold text-zona-purple-mid" aria-hidden>
                      ✓
                    </span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-3">
            <h2 className="text-lg text-zona-navy" style={sora}>
              The rundown
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-slate-700">
              {deal.description}
            </p>
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Asking Price
              </p>
              <p className="text-3xl font-bold text-zona-navy">{money(deal.price)}</p>
            </div>
            <ContactButtons deal={deal} config={config} layout="stack" />
            <p className="text-xs text-slate-500">
              Deals move fast — call or text for the quickest answer.
            </p>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto w-full max-w-6xl">
          <ContactButtons deal={deal} config={config} layout="row" />
        </div>
      </div>
    </div>
  );
}

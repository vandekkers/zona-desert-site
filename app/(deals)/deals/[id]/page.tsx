// BREAKAWAY: deals board — remove at platform launch

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactButtons } from "../../_components/ContactButtons";
import { DealGallery } from "../../_components/DealGallery";
import { ShareButton } from "../../_components/ShareButton";
import { StatusBadge } from "../../_components/StatusBadge";
import {
  dealMath,
  formatCloseBy,
  getDeal,
  getDeals,
  getDealsConfig,
  googleMapsHref,
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
  if (!deal) {
    return { title: "Deal | Zona Deals", robots: { index: false, follow: false } };
  }
  const title = `${deal.address}, ${deal.city} ${deal.state} — ${money(deal.price)}`;
  const description = `${deal.beds} bd · ${deal.baths} ba · ${deal.sqft.toLocaleString(
    "en-US"
  )} sqft · ARV ${money(deal.arv)} · Off-market from Zona Desert Property Solutions.`;
  return {
    title: `${title} | Zona Deals`,
    description,
    robots: { index: false, follow: false },
    // Open Graph so texted/shared links unfurl with the photo + numbers.
    openGraph: {
      title,
      description,
      images: deal.photos.length > 0 ? [{ url: deal.photos[0] }] : undefined
    }
  };
}

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const deal = getDeal(params.id);
  if (!deal) notFound();
  const config = getDealsConfig();
  const math = dealMath(deal);

  const factChips = [
    `${deal.beds} beds`,
    `${deal.baths} baths`,
    `${deal.sqft.toLocaleString("en-US")} sqft`
  ];

  const propertyFacts: Array<{ label: string; value: string }> = [
    ...(deal.propertyType ? [{ label: "Property type", value: deal.propertyType }] : []),
    { label: "Bedrooms", value: String(deal.beds) },
    { label: "Bathrooms", value: String(deal.baths) },
    { label: "Interior", value: `${deal.sqft.toLocaleString("en-US")} sqft` },
    { label: "Lot size", value: `${deal.lotSqft.toLocaleString("en-US")} sqft` },
    { label: "Year built", value: String(deal.yearBuilt) },
    ...(deal.occupancy ? [{ label: "Occupancy", value: deal.occupancy }] : []),
    { label: "ZIP", value: deal.zip }
  ];

  const metricChips = [
    ...(math.pricePerSqft !== null ? [`${money(math.pricePerSqft)}/sqft`] : []),
    ...(math.arvPerSqft !== null ? [`ARV ${money(math.arvPerSqft)}/sqft`] : []),
    `Est. rent ${money(deal.estRent)}/mo`,
    ...(math.rentToPrice !== null ? [`Rent / price ${math.rentToPrice}%`] : [])
  ];

  const positiveSpread = math.spread >= 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 md:pt-8 lg:pb-16">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/deals"
          className="text-sm font-semibold text-zona-purple-mid hover:text-zona-purple-deep"
        >
          ← All deals
        </Link>
      </div>

      <DealGallery photos={deal.photos} alt={`${deal.address}, ${deal.city}`} />

      <div className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-10">
          {/* Price-first header, Zillow-style */}
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={deal.status} />
              {deal.closeBy && deal.status === "available" && (
                <span className="text-sm font-semibold text-zona-orange">
                  Close by {formatCloseBy(deal.closeBy)}
                </span>
              )}
            </div>
            <p className="text-4xl font-bold tracking-tight text-zona-navy md:text-5xl">
              {money(deal.price)}
            </p>
            <div>
              <h1 className="text-xl text-zona-navy md:text-2xl" style={sora}>
                {deal.address}
              </h1>
              <p className="text-base text-slate-500">
                {deal.city}, {deal.state} {deal.zip}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {factChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-700"
                >
                  {chip}
                </span>
              ))}
            </div>
          </header>

          {/* Deal math */}
          <section className="space-y-4">
            <h2 className="text-lg text-zona-navy" style={sora}>
              Deal math
            </h2>
            <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
              <dl className="space-y-2 text-sm">
                <div className="flex items-baseline justify-between">
                  <dt className="text-slate-600">Asking price</dt>
                  <dd className="font-semibold text-zona-navy">{money(deal.price)}</dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="text-slate-600">Est. rehab</dt>
                  <dd className="font-semibold text-zona-navy">+ {money(deal.estRehab)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-slate-200 pt-2">
                  <dt className="text-slate-600">All-in</dt>
                  <dd className="font-semibold text-zona-navy">{money(math.allIn)}</dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="text-slate-600">After-repair value</dt>
                  <dd className="font-semibold text-zona-navy">{money(deal.arv)}</dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="font-semibold text-slate-700">Projected spread</dt>
                  <dd
                    className={`rounded-full px-3 py-1 text-sm font-bold ${
                      positiveSpread ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                    }`}
                  >
                    {positiveSpread ? "" : "−"}
                    {money(Math.abs(math.spread))}
                  </dd>
                </div>
              </dl>

              {positiveSpread && deal.arv > 0 && (
                <div className="space-y-2">
                  <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="bg-zona-purple-deep"
                      style={{ width: `${math.priceShare}%` }}
                    />
                    <div className="bg-zona-amber" style={{ width: `${math.rehabShare}%` }} />
                    <div className="bg-green-600" style={{ width: `${math.spreadShare}%` }} />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-zona-purple-deep" aria-hidden />
                      Price
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-zona-amber" aria-hidden />
                      Rehab
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-green-600" aria-hidden />
                      Spread
                    </span>
                    <span className="ml-auto text-slate-500">of {money(deal.arv)} ARV</span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {metricChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Property facts */}
          <section className="space-y-4">
            <h2 className="text-lg text-zona-navy" style={sora}>
              Property facts
            </h2>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 sm:grid-cols-4">
              {propertyFacts.map((fact) => (
                <div key={fact.label} className="bg-white p-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-zona-navy">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Highlights */}
          {deal.highlights.length > 0 && (
            <section className="space-y-4">
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
            </section>
          )}

          {/* Description */}
          <section className="space-y-3">
            <h2 className="text-lg text-zona-navy" style={sora}>
              About this deal
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-slate-700">
              {deal.description}
            </p>
          </section>

          {/* Location */}
          <section className="space-y-4">
            <h2 className="text-lg text-zona-navy" style={sora}>
              Location
            </h2>
            <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
              <div>
                <p className="text-sm font-semibold text-zona-navy">{deal.address}</p>
                <p className="text-sm text-slate-500">
                  {deal.city}, {deal.state} {deal.zip}
                </p>
              </div>
              <a
                href={googleMapsHref(deal)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center rounded-full border border-zona-purple-mid px-4 py-2 text-sm font-semibold text-zona-purple-mid transition hover:bg-zona-purple-mid/10"
              >
                Open in Google Maps →
              </a>
            </div>
          </section>
        </div>

        {/* Sticky contact rail (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Asking Price
              </p>
              <p className="text-3xl font-bold text-zona-navy">{money(deal.price)}</p>
              {deal.closeBy && deal.status === "available" && (
                <p className="mt-1 text-sm font-semibold text-zona-orange">
                  Close by {formatCloseBy(deal.closeBy)}
                </p>
              )}
            </div>
            <ContactButtons deal={deal} config={config} layout="stack" />
            <ShareButton title={`${deal.address}, ${deal.city} — ${money(deal.price)}`} />
            <p className="text-xs text-slate-500">
              Deals move fast — call or text for the quickest answer.
            </p>
          </div>
        </aside>
      </div>

      {/* Sticky contact bar (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto w-full max-w-6xl">
          <ContactButtons deal={deal} config={config} layout="row" />
        </div>
      </div>
    </div>
  );
}

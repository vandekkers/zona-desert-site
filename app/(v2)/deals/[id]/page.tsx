// BREAKAWAY: deals board — remove at platform launch

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactButtons } from "../../_components/ContactButtons";
import { DealGallery } from "../../_components/DealGallery";
import { DownloadPhotosButton } from "../../_components/DownloadPhotosButton";
import { NumbersTabs } from "../../_components/NumbersTabs";
import { OfferComposer } from "../../_components/OfferComposer";
import { ShareButton } from "../../_components/ShareButton";
import { StatusBadge } from "../../_components/StatusBadge";
import {
  dealStrategies,
  financedScenario,
  flipMath,
  formatCloseBy,
  getDeal,
  getDeals,
  getDealsConfig,
  googleMapsHref,
  money,
  rentalMath,
  sora
} from "../../_lib/deals";
import type { Deal, FinancedScenario, FlipMath, RentalMath } from "../../_lib/deals";

// Fully static: every deal page is prerendered from content/deals/*.json at
// build time, and unknown ids 404 without any runtime data access.
export const dynamicParams = false;

export function generateStaticParams() {
  return getDeals().map((deal) => ({ id: deal.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const deal = getDeal(params.id);
  if (!deal) {
    return { title: "Deal | Zona Desert" };
  }
  const rm = rentalMath(deal);
  const fm = flipMath(deal);
  const numbers = [
    rm?.capRatePct != null ? `${rm.capRatePct}% cap` : null,
    `ARV ${money(deal.arv)}`,
    `spread ${money(fm.spread)}`
  ]
    .filter(Boolean)
    .join(" · ");
  const title = `${deal.address}, ${deal.city} ${deal.state} — ${money(deal.price)}`;
  const description = `${deal.beds} bd · ${deal.baths} ba · ${deal.sqft.toLocaleString(
    "en-US"
  )} sqft · ${numbers} · Off-market from Zona Desert Property Solutions.`;
  return {
    title: `${title} | Zona Desert`,
    description,
    // Open Graph so texted/shared links unfurl with the photo + numbers.
    openGraph: {
      title,
      description,
      images: deal.photos.length > 0 ? [{ url: deal.photos[0] }] : undefined
    }
  };
}

function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-zona-navy">{value}</p>
      {hint && <p className="mt-0.5 text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

function RentalPanel({
  deal,
  rm,
  fin
}: {
  deal: Deal;
  rm: RentalMath;
  fin: FinancedScenario;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatTile
          label="Cap rate"
          value={rm.capRatePct != null ? `${rm.capRatePct}%` : "—"}
          hint="on asking"
        />
        <StatTile
          label="Cap @ all-in"
          value={rm.capRateAllInPct != null ? `${rm.capRateAllInPct}%` : "—"}
          hint="price + rehab"
        />
        <StatTile label="NOI" value={`${money(rm.noi)}/yr`} />
        <StatTile label="Cash flow" value={`${money(rm.cashFlowMonthly)}/mo`} hint="unlevered" />
        <StatTile label="GRM" value={rm.grm != null ? String(rm.grm) : "—"} />
        <StatTile
          label="Rent / price"
          value={rm.rentToPricePct != null ? `${rm.rentToPricePct}%` : "—"}
          hint="1% rule"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Income & expense waterfall */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
          <p className="mb-3 text-sm font-semibold text-zona-navy">Income & expenses (annual)</p>
          <dl className="space-y-2 text-sm">
            <div className="flex items-baseline justify-between">
              <dt className="text-slate-600">Gross rent</dt>
              <dd className="font-semibold text-zona-navy">{money(rm.grossAnnual)}</dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-slate-600">Vacancy ({rm.vacancyPct}%)</dt>
              <dd className="font-semibold text-slate-500">− {money(rm.vacancyAnnual)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-slate-200 pt-2">
              <dt className="text-slate-600">Effective gross income</dt>
              <dd className="font-semibold text-zona-navy">{money(rm.effectiveGross)}</dd>
            </div>
            {rm.expenses.map((line) => (
              <div key={line.label} className="flex items-baseline justify-between">
                <dt className="text-slate-600">
                  {line.label}
                  {line.assumed && <span className="ml-1 text-[10px] text-slate-400">est.</span>}
                </dt>
                <dd className="font-semibold text-slate-500">− {money(line.annual)}</dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between border-t border-slate-200 pt-2">
              <dt className="font-semibold text-slate-700">Net operating income</dt>
              <dd className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-800">
                {money(rm.noi)}
              </dd>
            </div>
            {rm.expenseRatioPct != null && (
              <p className="pt-1 text-right text-[11px] text-slate-400">
                {rm.expenseRatioPct}% expense ratio
              </p>
            )}
          </dl>
        </div>

        {/* Financed scenario */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
          <p className="mb-1 text-sm font-semibold text-zona-navy">Financed scenario</p>
          <p className="mb-3 text-xs text-slate-500">
            {fin.downPct}% down · {fin.ratePct}% rate · {fin.termYears}-yr · ~{fin.closingPct}%
            closing — assumptions, run your own numbers.
          </p>
          <dl className="space-y-2 text-sm">
            <div className="flex items-baseline justify-between">
              <dt className="text-slate-600">Down payment</dt>
              <dd className="font-semibold text-zona-navy">{money(fin.downPayment)}</dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-slate-600">Loan amount</dt>
              <dd className="font-semibold text-zona-navy">{money(fin.loanAmount)}</dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-slate-600">P&I payment</dt>
              <dd className="font-semibold text-zona-navy">{money(fin.monthlyPI)}/mo</dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-slate-600">Cash to work the deal</dt>
              <dd className="font-semibold text-zona-navy">{money(fin.cashInvested)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-slate-200 pt-2">
              <dt className="font-semibold text-slate-700">Cash flow after debt</dt>
              <dd
                className={`rounded-full px-3 py-1 text-sm font-bold ${
                  fin.cashFlowMonthly >= 0
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {money(fin.cashFlowMonthly)}/mo
              </dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-slate-600">Cash-on-cash</dt>
              <dd className="font-semibold text-zona-navy">
                {fin.cashOnCashPct != null ? `${fin.cashOnCashPct}%` : "—"}
              </dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-slate-600">DSCR</dt>
              <dd className="font-semibold text-zona-navy">{fin.dscr ?? "—"}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        {rm.usedDefaults && (
          <span>
            Items marked <span className="font-semibold">est.</span> use standard underwriting
            defaults, not stated figures.
          </span>
        )}
        {deal.rental?.section8 && (
          <span className="font-semibold text-zona-purple-deep">Section 8 friendly area</span>
        )}
        {deal.rental?.currentlyRented && (
          <span>
            Currently rented
            {deal.rental.leaseEnds ? ` — lease ends ${deal.rental.leaseEnds}` : ""}.
          </span>
        )}
      </div>
    </div>
  );
}

function FlipPanel({ deal, fm }: { deal: Deal; fm: FlipMath }) {
  const positiveSpread = fm.spread >= 0;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatTile label="Spread" value={money(fm.spread)} hint="ARV − all-in" />
        <StatTile
          label="Flip ROI"
          value={fm.flipRoiPct != null ? `${fm.flipRoiPct}%` : "—"}
          hint="spread / all-in"
        />
        <StatTile
          label="% of ARV"
          value={fm.pctOfArv != null ? `${fm.pctOfArv}%` : "—"}
          hint="all-in vs ARV"
        />
        <StatTile
          label="Price / sqft"
          value={fm.pricePerSqft != null ? money(fm.pricePerSqft) : "—"}
        />
        <StatTile label="ARV / sqft" value={fm.arvPerSqft != null ? money(fm.arvPerSqft) : "—"} />
        <StatTile
          label="Rehab / sqft"
          value={fm.rehabPerSqft != null ? money(fm.rehabPerSqft) : "—"}
        />
      </div>

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
            <dd className="font-semibold text-zona-navy">{money(fm.allIn)}</dd>
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
              {money(fm.spread)}
            </dd>
          </div>
        </dl>

        {positiveSpread && deal.arv > 0 && (
          <div className="space-y-2">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="bg-zona-purple-deep" style={{ width: `${fm.priceShare}%` }} />
              <div className="bg-zona-amber" style={{ width: `${fm.rehabShare}%` }} />
              <div className="bg-green-600" style={{ width: `${fm.spreadShare}%` }} />
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
      </div>
    </div>
  );
}

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const deal = getDeal(params.id);
  if (!deal) notFound();
  const config = getDealsConfig();
  const strategies = dealStrategies(deal);
  const rm = rentalMath(deal);
  const fm = flipMath(deal);
  const fin = rm ? financedScenario(deal, rm) : null;

  const showRental = strategies.includes("rental") && rm !== null && fin !== null;
  const showFlip = strategies.includes("flip") || !showRental;

  const tabLabels: string[] = [];
  const tabPanels: React.ReactNode[] = [];
  if (showRental && rm && fin) {
    tabLabels.push("Rental analysis");
    tabPanels.push(<RentalPanel key="rental" deal={deal} rm={rm} fin={fin} />);
  }
  if (showFlip) {
    tabLabels.push("Flip analysis");
    tabPanels.push(<FlipPanel key="flip" deal={deal} fm={fm} />);
  }

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

  const termRows: Array<{ label: string; value: string }> = deal.terms
    ? [
        ...(deal.terms.emd ? [{ label: "EMD to lock it", value: money(deal.terms.emd) }] : []),
        ...(deal.terms.closeMethod
          ? [{ label: "Close method", value: deal.terms.closeMethod }]
          : []),
        ...(deal.terms.access ? [{ label: "Access", value: deal.terms.access }] : []),
        ...(deal.terms.titleCompany
          ? [{ label: "Title company", value: deal.terms.titleCompany }]
          : [])
      ]
    : [];

  const railMetrics: Array<{ label: string; value: string }> = [
    ...(rm?.capRatePct != null ? [{ label: "Cap rate", value: `${rm.capRatePct}%` }] : []),
    ...(rm ? [{ label: "NOI", value: `${money(rm.noi)}/yr` }] : []),
    { label: "Spread", value: money(fm.spread) },
    { label: "ARV", value: money(deal.arv) }
  ].slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-32 pt-6 md:pt-8 lg:pb-16">
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
          {/* Price-first header */}
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={deal.status} />
              {strategies.map((strategy) => (
                <span
                  key={strategy}
                  className="rounded-full border border-zona-purple-mid/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zona-purple-deep"
                >
                  {strategy === "rental" ? "Rental play" : "Flip candidate"}
                </span>
              ))}
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
                  className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-card"
                >
                  {chip}
                </span>
              ))}
            </div>
          </header>

          {/* The numbers */}
          <section className="space-y-4">
            <h2 className="text-lg text-zona-navy" style={sora}>
              The numbers
            </h2>
            <NumbersTabs labels={tabLabels}>{tabPanels}</NumbersTabs>
          </section>

          {/* Deal terms */}
          {termRows.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg text-zona-navy" style={sora}>
                Deal terms
              </h2>
              <dl
                className={`grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 ${
                  termRows.length >= 4
                    ? "sm:grid-cols-4"
                    : termRows.length === 3
                      ? "sm:grid-cols-3"
                      : "sm:grid-cols-2"
                }`}
              >
                {termRows.map((row) => (
                  <div key={row.label} className="bg-white p-4">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {row.label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-zona-navy">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

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

          {/* Comps */}
          {deal.comps && deal.comps.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg text-zona-navy" style={sora}>
                Comps backing the ARV
              </h2>
              <ul className="space-y-2">
                {deal.comps.map((comp) => (
                  <li
                    key={comp.address}
                    className="flex flex-wrap items-baseline justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-zona-navy">
                        {comp.url ? (
                          <a
                            href={comp.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zona-purple-mid hover:text-zona-purple-deep"
                          >
                            {comp.address} ↗
                          </a>
                        ) : (
                          comp.address
                        )}
                      </p>
                      {comp.note && <p className="text-xs text-slate-500">{comp.note}</p>}
                    </div>
                    <p className="text-sm font-bold text-zona-navy">{money(comp.price)}</p>
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
                className="inline-flex w-fit items-center rounded-[10px] border-2 border-zona-purple-mid px-4 py-2 text-sm font-semibold text-zona-purple-mid transition hover:bg-zona-purple-mid/10"
              >
                Open in Google Maps →
              </a>
            </div>
          </section>
        </div>

        {/* Sticky action rail (desktop) */}
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
            {railMetrics.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {railMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl bg-zona-off-white p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      {metric.label}
                    </p>
                    <p className="text-sm font-bold text-zona-navy">{metric.value}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-2">
              <OfferComposer deal={deal} config={config} />
              <ContactButtons deal={deal} config={config} layout="row" />
            </div>
            <div className="space-y-2 border-t border-slate-200 pt-4">
              <ShareButton title={`${deal.address}, ${deal.city} — ${money(deal.price)}`} />
              <DownloadPhotosButton photos={deal.photos} dealId={deal.id} />
            </div>
            <p className="text-xs text-slate-500">
              Deals move fast — call or text for the quickest answer. Numbers are estimates;
              verify everything yourself.
            </p>
          </div>
        </aside>
      </div>

      {/* Sticky action bar (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex w-full max-w-6xl gap-2">
          <div className="flex-1">
            <OfferComposer deal={deal} config={config} />
          </div>
          <a
            href={`tel:${config.phone}`}
            className="flex flex-1 items-center justify-center rounded-[10px] border-2 border-zona-purple-mid px-4 py-3 text-sm font-semibold text-zona-purple-mid"
          >
            Call
          </a>
          <a
            href={`sms:${config.phone}?&body=${encodeURIComponent(
              `Hi — I'm interested in ${deal.address}, ${deal.city}. Is it still available?`
            )}`}
            className="flex flex-1 items-center justify-center rounded-[10px] border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
          >
            Text
          </a>
        </div>
      </div>
    </div>
  );
}

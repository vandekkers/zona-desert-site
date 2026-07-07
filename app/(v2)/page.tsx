// SITE V2 — zonadesert.com landing page. Buyer-first: every major surface
// routes to the deal board. Stats and deal cards are computed from
// content/deals/*.json at build time — nothing here is invented.

import type { Metadata } from "next";
import Link from "next/link";
import { ListingCardV2 } from "./_components/ListingCardV2";
import { SellQuickStart } from "./_components/SellQuickStart";
import { boardStats, getDeals, getDealsConfig, moneyCompact } from "./_lib/deals";

export const metadata: Metadata = {
  title: "Zona Desert | Real Estate Deals For Serious Investors",
  description:
    "Vetted deals with the numbers already run — most off-market, all underwritten. Sellers get a real cash offer in 24 hours."
};

const ArrowIcon = (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CheckIcon = (
  <span className="mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-green-800/10 text-green-800">
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
);

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div
      className={`mb-3.5 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.08em] ${
        light ? "text-zona-amber" : "text-zona-purple-deep"
      }`}
    >
      <span className={`h-[1.5px] w-[18px] ${light ? "bg-zona-amber" : "bg-zona-purple-mid"}`} />
      {children}
    </div>
  );
}

export default function LandingPage() {
  const deals = getDeals();
  const config = getDealsConfig();
  const stats = boardStats(deals);
  const gridDeals = deals.filter((deal) => deal.status !== "sold").slice(0, 6);

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1200px] px-5 pb-10 pt-8 lg:px-8 lg:pt-12">
        <div className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col justify-center py-2 lg:py-6">
            <Eyebrow>Underwritten · On &amp; Off Market · Nationwide</Eyebrow>
            <h1 className="mb-5 font-display text-[42px] font-semibold leading-[1.04] tracking-[-0.025em] text-zona-navy sm:text-[54px] lg:text-[64px] lg:leading-[1.02]">
              Real Estate,{" "}
              <em className="bg-[linear-gradient(120deg,#FE642D_0%,#FEA91E_70%)] bg-clip-text not-italic text-transparent">
                Reimagined
              </em>{" "}
              For The Serious Investor.
            </h1>
            <p className="mb-7 max-w-[480px] text-[17px] leading-relaxed text-slate-600 lg:text-lg">
              Vetted deals with the numbers already run — most off-market, all underwritten.
              Sellers get a real cash offer in 24 hours.
            </p>
            <div className="mb-9 flex flex-wrap items-center gap-3">
              <Link
                href="/deals"
                className="inline-flex items-center gap-2.5 rounded-[10px] bg-zona-purple-deep px-8 py-4 text-[16.5px] font-semibold text-white shadow-btn transition hover:bg-[#3D1570] hover:shadow-btn-hover"
              >
                Browse Live Deals
                {ArrowIcon}
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 rounded-[10px] px-6 py-4 text-[15.5px] font-semibold text-zona-navy transition hover:text-zona-purple-deep"
              >
                Sell Your Property →
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-9 gap-y-4 border-t border-zona-navy/[0.08] pt-5">
              <div className="flex flex-col gap-1">
                <span className="font-display text-[26px] font-semibold leading-none tracking-[-0.015em] text-zona-navy">
                  {stats.live}
                </span>
                <span className="text-[11px] uppercase tracking-[0.07em] text-slate-400">
                  Live Deals
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display text-[26px] font-semibold leading-none tracking-[-0.015em] text-zona-navy">
                  {moneyCompact(stats.totalArv)}
                  <span className="ml-0.5 text-sm text-zona-purple-mid">ARV</span>
                </span>
                <span className="text-[11px] uppercase tracking-[0.07em] text-slate-400">
                  On The Board
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display text-[26px] font-semibold leading-none tracking-[-0.015em] text-zona-navy">
                  24<span className="ml-0.5 text-sm text-zona-purple-mid">hr</span>
                </span>
                <span className="text-[11px] uppercase tracking-[0.07em] text-slate-400">
                  Offer Turnaround
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display text-[26px] font-semibold leading-none tracking-[-0.015em] text-zona-navy">
                  100<span className="ml-0.5 text-sm text-zona-purple-mid">%</span>
                </span>
                <span className="text-[11px] uppercase tracking-[0.07em] text-slate-400">
                  Underwritten
                </span>
              </div>
            </div>
          </div>

          {/* Hero photo — a portal to the board, not a listing */}
          <Link
            href="/deals"
            className="group relative isolate block min-h-[420px] overflow-hidden rounded-[20px] bg-zona-navy shadow-hero-photo lg:min-h-[540px]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.02]"
              style={{ backgroundImage: "url(/brand-v2/hero-az.jpg)" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(254,169,30,0.10)_0%,rgba(74,25,136,0.14)_55%,rgba(14,23,42,0.6)_100%)]" />

            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.05em] text-zona-navy backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-zona-orange" />
              The Board Is Live
            </span>

            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-[14px] bg-white/95 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur transition group-hover:bg-white sm:p-5">
              <div>
                <p className="font-display text-[17px] font-semibold leading-tight text-zona-navy">
                  {stats.live} {stats.live === 1 ? "Deal" : "Deals"} Available Now
                </p>
                <p className="mt-0.5 text-[12.5px] text-slate-500">
                  Cap rates, spreads, comps, and terms — on every listing.
                </p>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-zona-purple-deep text-white shadow-btn transition group-hover:bg-[#3D1570]">
                {ArrowIcon}
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── AUDIENCE STRIP ───────────────────────────────────── */}
      <div className="border-y border-zona-navy/[0.06] bg-white">
        <div className="mx-auto flex w-full max-w-[1200px] items-center gap-6 overflow-x-auto px-5 py-5 lg:gap-8 lg:px-8">
          <span className="whitespace-nowrap border-r border-zona-navy/[0.08] pr-6 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400 lg:pr-7">
            Built For
          </span>
          <div className="flex flex-1 items-center gap-8 font-display text-base font-semibold tracking-[0.01em] text-zona-navy/40 lg:gap-12">
            <span className="whitespace-nowrap">LANDLORDS</span>
            <span className="text-xs font-normal text-zona-navy/15">/</span>
            <span className="whitespace-nowrap">FLIPPERS</span>
            <span className="text-xs font-normal text-zona-navy/15">/</span>
            <span className="whitespace-nowrap">BRRRR INVESTORS</span>
            <span className="text-xs font-normal text-zona-navy/15">/</span>
            <span className="whitespace-nowrap">AGENTS</span>
            <span className="text-xs font-normal text-zona-navy/15">/</span>
            <span className="whitespace-nowrap">WHOLESALERS</span>
          </div>
        </div>
      </div>

      {/* ── FEATURED DEALS — first section after the fold ────── */}
      {gridDeals.length > 0 && (
        <section className="px-5 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto w-full max-w-[1200px]">
            <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Eyebrow>Live Now</Eyebrow>
                <h2 className="font-display text-[32px] font-semibold leading-[1.1] tracking-[-0.018em] text-zona-navy lg:text-[40px]">
                  Fresh Inventory. Real Numbers.
                </h2>
              </div>
              <Link
                href="/deals"
                className="text-[15px] font-semibold text-zona-purple-mid transition-colors hover:text-zona-purple-deep"
              >
                See The Full Board →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gridDeals.map((deal) => (
                <ListingCardV2 key={deal.id} deal={deal} />
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link
                href="/deals"
                className="inline-flex items-center gap-2.5 rounded-[10px] bg-zona-purple-deep px-8 py-4 text-[16.5px] font-semibold text-white shadow-btn transition hover:bg-[#3D1570] hover:shadow-btn-hover"
              >
                See All {stats.live} Live {stats.live === 1 ? "Deal" : "Deals"}
                {ArrowIcon}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── WHY ZONA ─────────────────────────────────────────── */}
      <section className="bg-white px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            <div>
              <Eyebrow>Why Zona</Eyebrow>
              <h2 className="max-w-[720px] font-display text-[32px] font-semibold leading-[1.1] tracking-[-0.018em] text-zona-navy lg:text-[40px]">
                Built For Operators Who Move On Real Deals.
              </h2>
            </div>
            <p className="max-w-[480px] text-[16px] leading-relaxed text-slate-600">
              Every deal is underwritten before it hits the board. The numbers you need are
              already on the page.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                num: "01 / Pipeline",
                heading: "Sourced Direct — On & Off Market",
                body: "Direct-to-seller, agent, and wholesaler pipelines. Most of it never touches the MLS.",
                metaLabel: "Current inventory",
                metaValue: `${stats.live} live ${stats.live === 1 ? "deal" : "deals"}`
              },
              {
                num: "02 / Underwriting",
                heading: "The Numbers, Run Before You Arrive",
                body: "Cap rate, NOI, rehab, spread, and sold comps — with every assumption labeled.",
                metaLabel: "Underwriting",
                metaValue: "On every deal"
              },
              {
                num: "03 / Speed",
                heading: "Terms Up Front, Close In Days",
                body: "EMD and close method posted. Call, text, or submit an offer from the listing.",
                metaLabel: "Offer turnaround",
                metaValue: "24 hours"
              }
            ].map((card) => (
              <div
                key={card.num}
                className="flex flex-col gap-3.5 rounded-2xl border border-zona-navy/[0.06] bg-white p-6 transition duration-150 hover:-translate-y-0.5 hover:border-zona-purple-deep/25 hover:shadow-[0_12px_28px_rgba(74,25,136,0.1)] lg:p-7"
              >
                <span className="font-display text-[13px] font-semibold tracking-[0.03em] text-zona-purple-mid">
                  {card.num}
                </span>
                <h3 className="font-display text-[21px] font-semibold leading-tight tracking-[-0.015em] text-zona-navy">
                  {card.heading}
                </h3>
                <p className="text-[14.5px] leading-relaxed text-slate-600">{card.body}</p>
                <div className="mt-1.5 flex justify-between border-t border-dashed border-zona-navy/[0.08] pt-3.5 text-xs text-slate-400">
                  <span>{card.metaLabel}</span>
                  <b className="font-semibold text-zona-navy">{card.metaValue}</b>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="relative overflow-hidden rounded-3xl bg-zona-navy p-8 text-white sm:p-11 lg:p-14">
            <div className="pointer-events-none absolute -right-28 -top-28 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(254,169,30,0.45)_0%,transparent_70%)]" />
            <div className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(74,25,136,0.65)_0%,transparent_70%)]" />

            <div className="relative z-10 mb-10 max-w-[640px]">
              <Eyebrow light>How It Works</Eyebrow>
              <h2 className="mb-3.5 font-display text-[30px] font-semibold leading-[1.1] tracking-[-0.018em] lg:text-[36px]">
                Three Steps. Real Offer In 24 Hours.
              </h2>
              <p className="text-[16px] leading-relaxed text-white/70">
                No tours, no listings, no lender chains.
              </p>
            </div>

            <div className="relative z-10 grid gap-8 md:grid-cols-3 md:gap-0">
              {[
                {
                  num: "STEP 01",
                  heading: "Submit Your Property",
                  body: "Address, beds, condition. Two minutes, from your phone.",
                  time: "~ 2 min"
                },
                {
                  num: "STEP 02",
                  heading: "We Run The Numbers",
                  body: "Comps, rehab scope, rent potential — a real cash offer, not an estimate.",
                  time: "~ 24 hr"
                },
                {
                  num: "STEP 03",
                  heading: "Close On Your Timeline",
                  body: "Pick the date. Clear title, transparent terms, vetted buyers.",
                  time: "Days, not months"
                }
              ].map((step, index) => (
                <div
                  key={step.num}
                  className={`md:px-9 ${index === 0 ? "md:pl-0" : ""} ${
                    index === 2 ? "md:pr-0" : ""
                  } ${index < 2 ? "md:border-r md:border-white/10" : ""}`}
                >
                  <span className="mb-4 inline-block rounded-full border border-white/[0.18] px-2.5 py-1 font-display text-xs font-semibold tracking-[0.05em] text-zona-amber">
                    {step.num}
                  </span>
                  <h3 className="mb-2.5 font-display text-[21px] font-semibold tracking-[-0.015em] text-white">
                    {step.heading}
                  </h3>
                  <p className="text-[14.5px] leading-relaxed text-white/65">{step.body}</p>
                  <p className="mt-4 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-zona-amber">
                    {step.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SELLER INTAKE ────────────────────────────────────── */}
      <section className="bg-white px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div>
            <Eyebrow>For Sellers</Eyebrow>
            <h2 className="mb-4 font-display text-[32px] font-semibold leading-[1.1] tracking-[-0.018em] text-zona-navy lg:text-[40px]">
              Need To Sell Fast? Get A Real Offer.
            </h2>
            <p className="max-w-[480px] text-[16px] leading-relaxed text-slate-600">
              Two minutes to submit. Reviewed by a person, backed by vetted cash buyers.
            </p>
            <div className="my-7 flex flex-col gap-3.5">
              <div className="flex items-start gap-3 text-[15px] leading-normal text-zona-navy">
                {CheckIcon}
                <span>
                  <b className="font-semibold">No obligation, no credit pull</b> — and never a
                  public listing.
                </span>
              </div>
              <div className="flex items-start gap-3 text-[15px] leading-normal text-zona-navy">
                {CheckIcon}
                <span>
                  <b className="font-semibold">Pick your closing date</b> — fast, or when
                  you&apos;re ready.
                </span>
              </div>
              <div className="flex items-start gap-3 text-[15px] leading-normal text-zona-navy">
                {CheckIcon}
                <span>
                  <b className="font-semibold">Any condition, any situation</b> — we structure
                  around it.
                </span>
              </div>
            </div>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 rounded-[10px] border-2 border-zona-purple-mid px-6 py-3 text-[15px] font-semibold text-zona-purple-mid transition hover:bg-zona-purple-mid/[0.08]"
            >
              Start My Submission →
            </Link>
          </div>

          <SellQuickStart config={config} />
        </div>
      </section>

      {/* ── CLOSING CTA ──────────────────────────────────────── */}
      <section className="px-5 py-16 lg:px-8 lg:py-20">
        <div className="relative mx-auto grid w-full max-w-[1200px] gap-8 overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#4A1988_0%,#7025B6_50%,#FE642D_130%)] p-9 text-white sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:p-16">
          <div className="pointer-events-none absolute -right-10 -top-10 h-[280px] w-[280px] bg-[radial-gradient(circle,rgba(254,169,30,0.4)_0%,transparent_70%)]" />
          <div className="relative z-10">
            <h2 className="mb-3.5 font-display text-[30px] font-semibold leading-[1.1] tracking-[-0.018em] lg:text-[38px]">
              The market moves fast. Your deal should too.
            </h2>
            <p className="max-w-[440px] text-[15.5px] leading-relaxed text-white/80">
              The board is live, the numbers are run, and the terms are posted.
            </p>
          </div>
          <div className="relative z-10 flex flex-col items-stretch gap-3">
            <Link
              href="/deals"
              className="inline-flex items-center justify-center gap-2.5 rounded-[10px] bg-white px-6 py-4 text-[16px] font-semibold text-zona-purple-deep shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition hover:bg-zona-sand"
            >
              Browse Live Deals
              {ArrowIcon}
            </Link>
            <Link
              href="/sell"
              className="inline-flex items-center justify-center rounded-[10px] border border-white/30 px-6 py-3.5 text-[15.5px] font-semibold text-white transition hover:bg-white/10"
            >
              Get My Offer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

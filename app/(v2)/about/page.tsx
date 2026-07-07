// SITE V2 — about page, carrying the platform-era positioning forward
// with the v2 design language and live board stats.

import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "../_components/PageIntro";
import { boardStats, getDeals, moneyCompact } from "../_lib/deals";

export const metadata: Metadata = {
  title: "About Zona Desert",
  description:
    "Who we are and why serious investors trust Zona Desert for underwritten, private-market inventory."
};

const VALUES = [
  {
    num: "01 / Sourcing",
    title: "Sourcing First",
    body: "Boots-on-ground canvassing, direct-to-seller campaigns, and agent referrals. Inventory starts with real relationships, not scraped lists."
  },
  {
    num: "02 / Underwriting",
    title: "Data-Backed Underwriting",
    body: "Every deal ships with the numbers — rent comps, rehab scope, cap rate, spread, and exit scenarios — so you can decide in minutes, not weeks."
  },
  {
    num: "03 / Alignment",
    title: "Aligned Incentives",
    body: "We only win when investors close great deals. Expect transparency, speed, and clear communication — the assumptions are printed on the page."
  }
];

export default function AboutPage() {
  const stats = boardStats(getDeals());

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-14 lg:px-8 lg:py-20">
      <PageIntro
        eyebrow="About Us"
        title="Building The Private-Market Standard For Serious Operators."
        lede="Zona Desert pairs a hands-on acquisitions operation with disciplined underwriting, so investors can evaluate creative deals in minutes — and sellers get real offers instead of estimates."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {VALUES.map((value) => (
          <div
            key={value.num}
            className="flex flex-col gap-3.5 rounded-2xl border border-zona-navy/[0.06] bg-white p-6 transition duration-150 hover:-translate-y-0.5 hover:border-zona-purple-deep/25 hover:shadow-[0_12px_28px_rgba(74,25,136,0.1)] lg:p-7"
          >
            <span className="font-display text-[13px] font-semibold tracking-[0.03em] text-zona-purple-mid">
              {value.num}
            </span>
            <h2 className="font-display text-[21px] font-semibold leading-tight tracking-[-0.015em] text-zona-navy">
              {value.title}
            </h2>
            <p className="text-[14.5px] leading-relaxed text-slate-600">{value.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-zona-navy p-8 text-white lg:p-10">
        <div className="flex flex-wrap gap-x-10 gap-y-4">
          <div>
            <p className="font-display text-[28px] font-semibold leading-none">{stats.live}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.07em] text-white/50">Live Deals</p>
          </div>
          <div>
            <p className="font-display text-[28px] font-semibold leading-none">
              {moneyCompact(stats.totalArv)}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.07em] text-white/50">
              ARV On The Board
            </p>
          </div>
          <div>
            <p className="font-display text-[28px] font-semibold leading-none">24hr</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.07em] text-white/50">
              Offer Turnaround
            </p>
          </div>
        </div>
        <Link
          href="/deals"
          className="inline-flex items-center gap-2 rounded-[10px] bg-white px-6 py-3 text-[15px] font-semibold text-zona-purple-deep transition hover:bg-zona-sand"
        >
          See The Board →
        </Link>
      </div>
    </div>
  );
}

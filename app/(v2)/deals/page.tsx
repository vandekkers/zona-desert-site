// SITE V2 — the deal board, now a first-class page of the public site.
// Fed by content/deals/*.json at build time; managed from /deal-desk.

import type { Metadata } from "next";
import { DealsExplorer } from "../_components/DealsExplorer";
import { PageIntro } from "../_components/PageIntro";
import { boardStats, getDeals, getDealsConfig, moneyCompact } from "../_lib/deals";

export const metadata: Metadata = {
  title: "Live Deals | Zona Desert",
  description:
    "Investment properties with full underwriting — cap rate, NOI, rehab budget, spread, comps, and terms on every listing. Most off-market, some on-market."
};

export default function DealsBoardPage() {
  const deals = getDeals();
  const config = getDealsConfig();
  const stats = boardStats(deals);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-14 lg:px-8 lg:py-20">
      <div className="mb-10 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
        <PageIntro
          eyebrow="The Board"
          title={config.headline}
          lede={config.subhead}
        />
        {stats.live > 0 && (
          <div className="flex shrink-0 gap-8 border-t border-zona-navy/[0.08] pt-4 lg:border-none lg:pt-0">
            <div>
              <p className="font-display text-[26px] font-semibold leading-none text-zona-navy">
                {stats.live}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.07em] text-slate-400">
                Available Now
              </p>
            </div>
            <div>
              <p className="font-display text-[26px] font-semibold leading-none text-zona-navy">
                {moneyCompact(stats.totalArv)}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.07em] text-slate-400">
                Combined ARV
              </p>
            </div>
          </div>
        )}
      </div>

      {deals.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zona-navy/20 bg-white p-10 text-center text-slate-500">
          Nothing on the board right now — check back soon, or{" "}
          <a href="/buyers" className="font-semibold text-zona-purple-mid">
            join the buyers list
          </a>{" "}
          to hear first.
        </p>
      ) : (
        <DealsExplorer deals={deals} />
      )}
    </div>
  );
}

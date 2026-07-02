// BREAKAWAY: deals board — remove at platform launch

import type { Metadata } from "next";
import { DealCard } from "../_components/DealCard";
import { getDeals, getDealsConfig, sora } from "../_lib/deals";

export const metadata: Metadata = {
  title: "Off-Market Deals | Zona Desert Property Solutions",
  description:
    "Under-contract off-market properties from Zona Desert Property Solutions.",
  robots: { index: false, follow: false }
};

export default function DealsBoardPage() {
  const deals = getDeals();
  const config = getDealsConfig();
  const availableCount = deals.filter((deal) => deal.status === "available").length;

  return (
    <div>
      <section className="bg-zona-navy text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-14 md:py-20">
          <p className="text-xs uppercase tracking-[0.35em] text-zona-amber md:text-sm">
            Zona Desert Property Solutions
          </p>
          <h1 className="max-w-3xl text-3xl leading-tight md:text-5xl" style={sora}>
            {config.headline}
          </h1>
          <p className="max-w-2xl text-base text-slate-300 md:text-lg">{config.subhead}</p>
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold">
            <span className="h-2 w-2 rounded-full bg-zona-amber" aria-hidden />
            {availableCount === 1 ? "1 deal available now" : `${availableCount} deals available now`}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 md:py-14">
        {deals.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Nothing on the board right now — check back soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

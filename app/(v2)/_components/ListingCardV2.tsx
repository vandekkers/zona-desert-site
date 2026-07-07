// SITE V2 — deal card per the marketing kit: photo with warm gradient
// overlay, price burned into the image, strategy tag, white body with
// address + stats. Shadow-lift hover, 16px radius, no pill buttons.

import Link from "next/link";
import type { Deal } from "../_lib/deal-shared";
import { dealStrategies, flipMath, formatCloseBy, money, moneyCompact, rentalMath } from "../_lib/deal-shared";

function statusTag(deal: Deal): { label: string; dark: boolean } | null {
  if (deal.status === "pending") return { label: "Sale Pending", dark: true };
  if (deal.status === "sold") return { label: "Sold", dark: true };
  if (deal.featured) return { label: "Featured", dark: true };
  return { label: "Live", dark: false };
}

function headlineMetric(deal: Deal): string | null {
  const strategies = dealStrategies(deal);
  if (strategies.includes("rental")) {
    const rm = rentalMath(deal);
    if (rm?.capRatePct != null) return `${rm.capRatePct}% cap rate`;
  }
  const fm = flipMath(deal);
  if (fm.spread > 0) return `${moneyCompact(fm.spread)} spread`;
  return null;
}

export function ListingCardV2({ deal }: { deal: Deal }) {
  const sold = deal.status === "sold";
  const cover = deal.photos[0];
  const tag = statusTag(deal);
  const strategies = dealStrategies(deal);
  const metric = headlineMetric(deal);

  return (
    <Link
      href={`/deals/${deal.id}`}
      className={`group block overflow-hidden rounded-2xl border border-zona-navy/[0.06] bg-white transition duration-150 hover:-translate-y-[3px] hover:shadow-lift ${
        sold ? "opacity-70" : ""
      }`}
    >
      <div className="relative h-[220px] overflow-hidden bg-zona-navy">
        {cover ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={`${deal.address}, ${deal.city}`}
              loading="lazy"
              className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.04] ${
                sold ? "grayscale" : ""
              }`}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(254,169,30,0.18)_0%,rgba(14,23,42,0)_30%,rgba(14,23,42,0.55)_100%)]" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Photos Coming Soon
          </div>
        )}
        {tag && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.05em] ${
              tag.dark ? "bg-zona-navy text-white" : "bg-white/95 text-zona-navy"
            }`}
          >
            {tag.label}
          </span>
        )}
        <span className="absolute bottom-3 left-3.5 font-display text-[22px] font-semibold tracking-[-0.01em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">
          {money(deal.price)}
        </span>
        <span className="absolute bottom-3.5 right-3.5 rounded-md bg-zona-amber/95 px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-[#5C2C00]">
          {strategies.includes("rental") && strategies.includes("flip")
            ? "Rental + Flip"
            : strategies.includes("rental")
              ? "Rental"
              : "Flip"}
        </span>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-4 pt-3.5 sm:px-[18px]">
        <div>
          <p className="font-display text-[17px] font-semibold leading-tight tracking-[-0.01em] text-zona-navy">
            {deal.address}
          </p>
          <p className="mt-0.5 text-[12.5px] text-slate-400">
            {deal.city}, {deal.state} {deal.zip}
          </p>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-zona-navy/[0.07] pt-2.5 text-[13px] text-slate-600">
          <span>
            <b className="font-semibold text-zona-navy">{deal.beds}</b> bed
          </span>
          <span>
            <b className="font-semibold text-zona-navy">{deal.baths}</b> bath
          </span>
          <span>
            <b className="font-semibold text-zona-navy">{deal.sqft.toLocaleString("en-US")}</b> sf
          </span>
          {metric && !sold && (
            <span className="ml-auto font-semibold text-zona-purple-mid">{metric}</span>
          )}
          {deal.closeBy && deal.status === "available" && !metric && (
            <span className="ml-auto font-semibold text-zona-orange">
              Close by {formatCloseBy(deal.closeBy)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

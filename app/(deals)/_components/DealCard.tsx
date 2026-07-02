// BREAKAWAY: deals board — remove at platform launch

import Link from "next/link";
import type { Deal } from "../_lib/deals";
import { formatCloseBy, money } from "../_lib/deals";
import { StatusBadge } from "./StatusBadge";

export function DealCard({ deal }: { deal: Deal }) {
  const sold = deal.status === "sold";
  const cover = deal.photos[0];

  return (
    <Link
      href={`/deals/${deal.id}`}
      className={`group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
        sold ? "opacity-70" : ""
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {cover ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={`${deal.address}, ${deal.city}`}
              loading="lazy"
              className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.03] ${
                sold ? "grayscale" : ""
              }`}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zona-navy text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
            Photos coming soon
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <StatusBadge status={deal.status} />
          {deal.featured && !sold && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zona-purple-deep">
              Featured
            </span>
          )}
        </div>
      </div>
      <div className="space-y-2 p-5">
        <p className="text-2xl font-bold text-zona-navy">{money(deal.price)}</p>
        <div>
          <p className="text-base font-semibold text-slate-900">{deal.address}</p>
          <p className="text-sm text-slate-500">
            {deal.city}, {deal.state} {deal.zip}
          </p>
        </div>
        <p className="text-sm text-slate-600">
          {deal.beds} bd · {deal.baths} ba · {deal.sqft.toLocaleString("en-US")} sqft
        </p>
        {deal.closeBy && deal.status === "available" && (
          <p className="text-xs font-semibold text-zona-orange">
            Close by {formatCloseBy(deal.closeBy)}
          </p>
        )}
      </div>
    </Link>
  );
}

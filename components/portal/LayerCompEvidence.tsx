// Layer 3 (Comp Evidence) — comparable sales table.
//
// Per blueprint §5 Layer 3: street_block (sanitized at backend
// portal_view.py boundary), sold_price, sale_date, distance, beds,
// baths, sqft, sale_type. Empty/null comps render a placeholder card
// rather than hiding the layer entirely (UX continuity).

import type { PublicComp } from "@/lib/types";
import { formatCurrency, formatDate, formatNumber } from "@/lib/portalFormatters";

interface Props {
  comps: PublicComp[] | null;
}

const EM_DASH = "—";

function formatBaths(value: number | null): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return EM_DASH;
  }
  // Bathrooms allow half-bath increments; show 1 decimal when fractional.
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatDistance(value: number | null): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return EM_DASH;
  }
  return `${value.toFixed(1)} mi`;
}

function formatSaleType(value: string | null): string {
  if (!value) return EM_DASH;
  // Replace underscores; title-case each word.
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function LayerCompEvidence({ comps }: Props) {
  return (
    <section
      aria-labelledby="comp-evidence-title"
      className="rounded-2xl border border-zona-purple-mid/15 bg-white p-6 shadow-sm md:p-8"
    >
      <h2
        id="comp-evidence-title"
        className="text-2xl text-zona-navy md:text-3xl"
        style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
      >
        Comparable Sales
      </h2>
      <p
        className="mt-2 text-base text-zona-navy/70"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Recent home sales near your property used to evaluate your offer.
      </p>

      {comps && comps.length > 0 ? (
        <div className="mt-6 overflow-x-auto">
          <table
            className="w-full min-w-[720px] border-collapse text-left text-sm"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <thead>
              <tr className="border-b border-zona-navy/15 text-xs uppercase tracking-wider text-zona-navy/60">
                <th className="py-3 pr-4 font-medium">Street Block</th>
                <th className="py-3 pr-4 font-medium">Sold Price</th>
                <th className="py-3 pr-4 font-medium">Sold Date</th>
                <th className="py-3 pr-4 font-medium">Beds</th>
                <th className="py-3 pr-4 font-medium">Baths</th>
                <th className="py-3 pr-4 font-medium">Sqft</th>
                <th className="py-3 pr-4 font-medium">Distance</th>
                <th className="py-3 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {comps.map((comp, idx) => (
                <tr
                  key={`${comp.street_block}-${idx}`}
                  className={
                    idx % 2 === 0
                      ? "bg-zona-off-white/40 text-zona-navy"
                      : "text-zona-navy"
                  }
                >
                  <td className="py-3 pr-4" style={{ fontWeight: 500 }}>
                    {comp.street_block}
                  </td>
                  <td className="py-3 pr-4">{formatCurrency(comp.sold_price)}</td>
                  <td className="py-3 pr-4">{formatDate(comp.sale_date)}</td>
                  <td className="py-3 pr-4">
                    {formatNumber(comp.beds)}
                  </td>
                  <td className="py-3 pr-4">{formatBaths(comp.baths)}</td>
                  <td className="py-3 pr-4">{formatNumber(comp.sqft)}</td>
                  <td className="py-3 pr-4">{formatDistance(comp.distance_miles)}</td>
                  <td className="py-3">{formatSaleType(comp.sale_type)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className="mt-6 rounded-xl border border-zona-amber/30 bg-zona-amber/5 p-5 text-base text-zona-navy/80"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Comparable sales data is still being gathered. Your offer reflects
          current market conditions in your area.
        </div>
      )}
    </section>
  );
}

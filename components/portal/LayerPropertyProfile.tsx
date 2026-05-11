// Layer 4 (Property Profile) — combined property_facts + exit_strategy.
//
// Per backend schema docstring (apps/api/app/schemas/public_offer.py
// lines 38-42), this layer spans BOTH:
//   * PublicPropertyFacts (year_built, bedrooms, bathrooms, sqft,
//     lot_size, repair_level)
//   * PublicExitStrategy  (arv_estimate_low, arv_estimate_high,
//     estimated_rental_monthly)
//
// Null handling:
//   - propertyFacts == null AND exitStrategy == null → return null
//     (parent dispatch hides the layer entirely)
//   - propertyFacts == null → hide Layer 4 entirely (no facts to show)
//   - exitStrategy == null → hide 4b only (Valuation Range subsection)
//   - Individual field null → render em-dash (preserve grid layout)

import type { PublicExitStrategy, PublicPropertyFacts } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/portalFormatters";

interface Props {
  propertyFacts: PublicPropertyFacts | null;
  exitStrategy: PublicExitStrategy | null;
}

const EM_DASH = "—";

function formatBathrooms(value: string | null): string {
  if (!value) return EM_DASH;
  const num = Number(value);
  if (!Number.isFinite(num)) return EM_DASH;
  return Number.isInteger(num) ? String(num) : num.toFixed(1);
}

function formatLotSize(value: string | null): string {
  if (!value) return EM_DASH;
  const num = Number(value);
  if (!Number.isFinite(num)) return EM_DASH;
  return `${new Intl.NumberFormat("en-US").format(num)} sqft`;
}

function formatArvRange(
  low: string | null,
  high: string | null
): string | null {
  const lowFmt = formatCurrency(low);
  const highFmt = formatCurrency(high);
  if (lowFmt === EM_DASH && highFmt === EM_DASH) return null;
  if (lowFmt === EM_DASH) return `Approx. ${highFmt}`;
  if (highFmt === EM_DASH) return `Approx. ${lowFmt}`;
  return `${lowFmt} – ${highFmt}`;
}

interface CellProps {
  label: string;
  value: string;
}

function FactCell({ label, value }: CellProps) {
  return (
    <div>
      <p
        className="text-xs uppercase tracking-wider text-zona-navy/60"
        style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
      >
        {label}
      </p>
      <p
        className="mt-1 text-xl text-zona-navy"
        style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
      >
        {value}
      </p>
    </div>
  );
}

export function LayerPropertyProfile({ propertyFacts, exitStrategy }: Props) {
  if (!propertyFacts) return null;

  const arvText = exitStrategy
    ? formatArvRange(exitStrategy.arv_estimate_low, exitStrategy.arv_estimate_high)
    : null;
  const rentalText = exitStrategy
    ? formatCurrency(exitStrategy.estimated_rental_monthly)
    : EM_DASH;
  const showValuationSection =
    !!exitStrategy && (arvText !== null || rentalText !== EM_DASH);

  return (
    <section
      aria-labelledby="property-profile-title"
      className="rounded-2xl border border-zona-purple-mid/15 bg-white p-6 shadow-sm md:p-8"
    >
      <h2
        id="property-profile-title"
        className="text-2xl text-zona-navy md:text-3xl"
        style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
      >
        Your Property
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-y-6 gap-x-4 md:grid-cols-6 md:gap-x-6">
        <FactCell label="Year Built" value={formatNumber(propertyFacts.year_built)} />
        <FactCell label="Bedrooms" value={formatNumber(propertyFacts.bedrooms)} />
        <FactCell label="Bathrooms" value={formatBathrooms(propertyFacts.bathrooms)} />
        <FactCell label="Square Feet" value={formatNumber(propertyFacts.sqft)} />
        <FactCell label="Lot Size" value={formatLotSize(propertyFacts.lot_size)} />
        <FactCell label="Condition" value={propertyFacts.repair_level ?? EM_DASH} />
      </div>

      {showValuationSection ? (
        <div className="mt-8 border-t border-zona-navy/10 pt-6">
          <h3
            className="text-xs uppercase tracking-[0.3em] text-zona-purple-mid"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
          >
            Valuation Range
          </h3>
          <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-baseline md:gap-8">
            {arvText ? (
              <p
                className="text-lg text-zona-navy md:text-xl"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
              >
                ARV: {arvText}
              </p>
            ) : null}
            {rentalText !== EM_DASH ? (
              <p
                className="text-lg text-zona-navy md:text-xl"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
              >
                Monthly Rental: {rentalText} / mo
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}

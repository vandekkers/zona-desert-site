import type { PublicListingDetail } from "@/lib/types";

// Phase 5.5.b — Deal Data tab content.
//
// Server component. Investor analysis surface: financials breakdown,
// cap rate, exit strategies, rehab level, structure / seller-finance.
//
// reserve_price is NEVER in the DTO — the backend schema strips it
// per AGENTS.md §10.9 + the public_listings privacy-regression test.
// This panel has no way to render what isn't in the response payload.

function formatCurrency(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return `$${Math.round(value).toLocaleString()}`;
}

function formatPercent(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${value.toFixed(2)}%`;
}

function formatMonths(months: number | null | undefined): string {
  if (months == null || !Number.isFinite(months)) return "—";
  if (months >= 12 && months % 12 === 0) {
    const years = months / 12;
    return `${years} ${years === 1 ? "year" : "years"}`;
  }
  return `${months} months`;
}

// Aligns with the Phase 4.4 StrategyName vocabulary + 5.1.api rehab
// taxonomy. The display labels are friendly versions of the canonical
// snake_case enum values that flow through the public DTO.
const EXIT_STRATEGY_LABELS: Record<string, string> = {
  fix_and_flip: "Fix and Flip",
  rental_hold: "Rental Hold",
  brrrr: "BRRRR",
  wholetail: "Wholetail"
};

const REHAB_LEVEL_LABELS: Record<string, string> = {
  turnkey: "Turnkey",
  light: "Light",
  moderate: "Moderate",
  heavy_plus: "Heavy +"
};

function formatExitStrategy(strategy: string): string {
  return (
    EXIT_STRATEGY_LABELS[strategy.toLowerCase()] ??
    strategy
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

function formatRehabLevel(level: string | null | undefined): string {
  if (!level) return "—";
  return (
    REHAB_LEVEL_LABELS[level.toLowerCase()] ??
    level
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

interface DealDataPanelProps {
  listing: PublicListingDetail;
}

export default function DealDataPanel({ listing }: DealDataPanelProps) {
  const financials = listing.financials ?? {
    estimated_rent: null,
    taxes: null,
    insurance: null,
    hoa: null,
    other_expenses: null
  };
  const structure = listing.structure ?? { cash_price: null, seller_finance: null };
  const exitStrategies = (listing.exit_strategies ?? []).filter(
    (s) => s && s.trim().length > 0
  );

  const financialRows = [
    { label: "Estimated Monthly Rent", value: financials.estimated_rent },
    { label: "Property Taxes (annual)", value: financials.taxes },
    { label: "Insurance (annual)", value: financials.insurance },
    { label: "HOA (annual)", value: financials.hoa },
    { label: "Other Expenses (annual)", value: financials.other_expenses }
  ];
  const financialsAllNull = financialRows.every(({ value }) => value == null);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">Financials</h2>
        {financialsAllNull ? (
          <p className="mt-4 text-sm text-slate-500">
            Detailed financials for this property aren&apos;t available yet. Reach out to request
            the full deal pack.
          </p>
        ) : (
          <dl className="mt-6 divide-y divide-slate-100">
            {financialRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-3 text-sm sm:text-base"
              >
                <dt className="font-medium text-slate-600">{row.label}</dt>
                <dd className="font-semibold text-slate-900">{formatCurrency(row.value)}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between py-3 text-sm sm:text-base">
              <dt className="font-medium text-slate-600">Cap Rate</dt>
              <dd className="font-semibold text-slate-900">{formatPercent(listing.cap_rate)}</dd>
            </div>
          </dl>
        )}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">Strategy Fit</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Best-Fit Exit Strategies
            </p>
            {exitStrategies.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {exitStrategies.map((strategy) => (
                  <span
                    key={strategy}
                    className="rounded-full bg-zona-purple/10 px-3 py-1 text-xs font-semibold text-zona-purple"
                  >
                    {formatExitStrategy(strategy)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No strategies listed yet.</p>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Rehab Level
            </p>
            <p className="mt-3 text-lg font-semibold text-slate-900">
              {formatRehabLevel(listing.rehab_level)}
            </p>
            {listing.rehab_level ? (
              <p className="mt-1 text-xs text-slate-500">
                Aligns with buyer rehab-tolerance bucket for matching.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">Deal Structure</h2>
        <div className="mt-6 space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Cash Price
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {formatCurrency(structure.cash_price ?? listing.price ?? null)}
            </p>
          </div>

          {structure.seller_finance ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-zona-purple">
                Seller Finance Available
              </p>
              <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-semibold text-slate-500">Down Payment</dt>
                  <dd className="mt-1 text-lg font-semibold text-slate-900">
                    {formatCurrency(structure.seller_finance.down_payment)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate-500">Interest Rate</dt>
                  <dd className="mt-1 text-lg font-semibold text-slate-900">
                    {formatPercent(structure.seller_finance.interest_rate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate-500">Term</dt>
                  <dd className="mt-1 text-lg font-semibold text-slate-900">
                    {formatMonths(structure.seller_finance.term_months)}
                  </dd>
                </div>
              </dl>
              {structure.seller_finance.notes ? (
                <p className="mt-4 whitespace-pre-line text-sm text-slate-600">
                  {structure.seller_finance.notes}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// Shared formatter helpers for the public offer portal (Phase 4.5.h.ui).
// Backend Decimal columns serialize as JSON strings via Pydantic V2; UI
// coerces at the presentation boundary. All helpers degrade to em-dash
// on null / non-finite / unparseable input.

const EM_DASH = "—";

export function formatCurrency(value: string | null | undefined): string {
  if (value === null || value === undefined || value === "") return EM_DASH;
  const num = Number(value);
  if (!Number.isFinite(num)) return EM_DASH;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(num);
}

export function formatNumber(
  value: number | null | undefined,
  suffix?: string
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return EM_DASH;
  }
  const formatted = new Intl.NumberFormat("en-US").format(value);
  return suffix ? `${formatted}${suffix}` : formatted;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return EM_DASH;
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return EM_DASH;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

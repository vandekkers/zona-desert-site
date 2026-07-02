// BREAKAWAY: deals board — remove at platform launch

import type { DealStatus } from "../_lib/deals";

const STYLES: Record<DealStatus, { label: string; className: string }> = {
  available: { label: "Available", className: "bg-zona-purple-deep text-white" },
  pending: { label: "Sale Pending", className: "bg-zona-amber text-zona-navy" },
  sold: { label: "Sold", className: "bg-zona-navy/70 text-white" }
};

export function StatusBadge({ status }: { status: DealStatus }) {
  const style = STYLES[status];
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${style.className}`}
    >
      {style.label}
    </span>
  );
}

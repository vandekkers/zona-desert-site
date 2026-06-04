import Link from "next/link";

import type { PublicListingDetail } from "@/lib/types";

// Phase 5.5.b — Bid & Buy tab content.
//
// Server component. Shows pricing + timeline + bidding rules.
//
// CTAs are STUBBED in this slice — they route toward the buyer auth
// flow (5.9) with the listing slug + intended action preserved in the
// query string. The real bid submission flow lands in 5.6 and the
// Buy Now + Stripe deposit flow in 5.7.
//
// Hardcoded business-rule constants are surfaced as user-facing copy
// rather than mutable config so the seller portal always reflects the
// canonical contract. The values are mirrored from AGENTS.md §12:
// min bid increment $500, 10-min late-bid extension, $250 deposit,
// 3-hour deposit window, bidding closes 48h before inspection.

const MIN_BID_INCREMENT_USD = 500;
const DEPOSIT_USD = 250;
const DEPOSIT_WINDOW_HOURS = 3;
const LATE_BID_EXTENSION_MIN = 10;
const BIDDING_CLOSES_BEFORE_INSPECTION_HOURS = 48;

function formatCurrency(value: number | null | undefined): string | null {
  if (value == null || !Number.isFinite(value)) return null;
  return `$${Math.round(value).toLocaleString()}`;
}

function formatDeadline(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
  });
}

// SOLD / UNDER_CONTRACT / RELISTED / EXPIRED — the listing is no longer
// open for new bids. We keep the panel visible for transparency but
// disable the CTAs with a contextual note.
function isTerminalState(status: string | null | undefined): {
  closed: boolean;
  note: string | null;
} {
  if (!status) return { closed: false, note: null };
  const normalized = status.toLowerCase();
  if (normalized === "sold") return { closed: true, note: "This property has sold." };
  if (normalized === "under_contract")
    return { closed: true, note: "This property is currently under contract." };
  if (normalized === "awaiting_deposit")
    return {
      closed: true,
      note: "The winning bidder is in the deposit window. Bidding is paused."
    };
  if (normalized === "expired")
    return { closed: true, note: "Bidding for this listing has ended." };
  return { closed: false, note: null };
}

interface BidBuyPanelProps {
  listing: PublicListingDetail;
}

export default function BidBuyPanel({ listing }: BidBuyPanelProps) {
  const startingBid = formatCurrency(listing.starting_bid);
  const buyNowPrice = formatCurrency(listing.buy_now_price);
  const askingPrice = formatCurrency(listing.price);
  const biddingClosesFormatted = formatDeadline(listing.bidding_closes_at);
  const { closed, note: terminalNote } = isTerminalState(listing.status);

  const listingSlug = listing.slug ?? String(listing.id);
  const bidHref = `/sign-in?return=/listings&listing=${encodeURIComponent(listingSlug)}&action=bid`;
  const buyNowHref = `/sign-in?return=/listings&listing=${encodeURIComponent(
    listingSlug
  )}&action=buy-now`;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pricing</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold text-slate-500">Starting Bid</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{startingBid ?? "—"}</p>
            <p className="mt-1 text-xs text-slate-500">
              Minimum increment ${MIN_BID_INCREMENT_USD.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Buy Now</p>
            <p className="mt-1 text-3xl font-bold text-zona-purple">{buyNowPrice ?? "—"}</p>
            <p className="mt-1 text-xs text-slate-500">Skip the auction. Lock the deal today.</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Asking</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{askingPrice ?? "—"}</p>
            <p className="mt-1 text-xs text-slate-500">Reference target price.</p>
          </div>
        </div>
        {!startingBid && !buyNowPrice && !askingPrice ? (
          <p className="mt-4 text-sm text-slate-500">Price on request.</p>
        ) : null}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Bidding Timeline
        </p>
        {biddingClosesFormatted ? (
          <p className="mt-4 text-2xl font-semibold text-slate-900">
            Bidding closes {biddingClosesFormatted}
          </p>
        ) : (
          <p className="mt-4 text-lg text-slate-600">
            Bidding timeline TBD — check back soon or reach out for the latest.
          </p>
        )}
        <ul className="mt-6 space-y-3 text-sm text-slate-600">
          <li className="flex gap-3">
            <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zona-purple" />
            <span>
              Any bid placed within the final {LATE_BID_EXTENSION_MIN} minutes extends bidding by
              another {LATE_BID_EXTENSION_MIN} minutes to keep the auction fair.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zona-purple" />
            <span>
              Bidding closes {BIDDING_CLOSES_BEFORE_INSPECTION_HOURS} hours before inspection so
              buyers have time to confirm their decision.
            </span>
          </li>
        </ul>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Deposit & Commitment
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-slate-500">Bidder Deposit</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              ${DEPOSIT_USD.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Held to confirm the winning bid. Refunded if you don&apos;t win.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Deposit Window</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {DEPOSIT_WINDOW_HOURS} hours
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Winning bidder commits the deposit within {DEPOSIT_WINDOW_HOURS} hours of close.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/30 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-zona-purple">
          Next Steps
        </p>
        <p className="mt-3 text-2xl font-semibold text-slate-900">
          {closed ? "Bidding is closed" : "Sign in to bid or buy now"}
        </p>
        {terminalNote ? (
          <p className="mt-2 text-sm font-semibold text-zona-orange">{terminalNote}</p>
        ) : (
          <p className="mt-2 text-sm text-slate-500">
            We&apos;ll verify your account with a quick sign-in. You&apos;ll return right back to
            this listing with your action ready to confirm.
          </p>
        )}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {closed ? (
            <>
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-2xl bg-slate-200 px-6 py-4 text-base font-semibold text-slate-500"
              >
                Place Bid
              </button>
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-2xl bg-slate-200 px-6 py-4 text-base font-semibold text-slate-500"
              >
                Buy Now
              </button>
            </>
          ) : (
            <>
              <Link
                href={bidHref}
                className="w-full rounded-2xl border-2 border-zona-purple bg-white px-6 py-4 text-center text-base font-semibold text-zona-purple shadow-sm transition hover:-translate-y-0.5 hover:bg-zona-purple/5"
              >
                Sign in to Place Bid
              </Link>
              <Link
                href={buyNowHref}
                className="w-full rounded-2xl bg-zona-purple px-6 py-4 text-center text-base font-semibold text-white shadow-lg shadow-zona-purple/30 transition hover:-translate-y-0.5 hover:bg-zona-purple/90"
              >
                Sign in to Buy Now
              </Link>
            </>
          )}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Buyer accounts unlock bidding, deposit, and Buy Now — coming soon. Until then, you can
          still get the deal pack and talk to us about this property.
        </p>
      </div>
    </div>
  );
}

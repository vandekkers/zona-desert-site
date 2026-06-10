import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import type { Metadata } from "next";

import { fetchPublicListing } from "@/lib/publicApi";
import type { PublicListingDetail } from "@/lib/types";

// Phase 5.5.c — Zona Agent chat widget mounts as a client-only island.
// Dynamic import with ssr:false keeps the SSR HTML free of the chat
// bundle so marketing surfaces (status, hero, pricing) are never
// blocked by it. Widget failure NEVER breaks the listing page.
const ZonaAgentChat = dynamic(() => import("@/components/ZonaAgentChat"), {
  ssr: false
});

// Phase 5.5.a — Public Listing Foundation.
//
// Blueprint-locked nested URL: zonadesert.com/listings/[state]/[city]/[slug].
// state + city URL segments are SEO/readability only; the slug is the
// globally-unique lookup key (enforced at the backend ORM layer via
// Listing.public_slug UNIQUE). A future polish PR may add canonical
// redirect when state/city in the URL don't match the listing's actual
// state/city — out of scope here.
//
// SSR Server Component (no "use client") — marketing pages MUST be
// crawlable for SEO. generateMetadata derives title + description from
// the real backend data so the served HTML carries unique meta per
// listing.
//
// Base shell ONLY — 3-tab Overview/Bid&Buy/Deal Data interface, full
// photo carousel, OG/Twitter cards, Zona Agent chatbox, live bidding,
// Buy Now + Stripe deposit all land in subsequent 5.5.b+ slices.

interface RouteParams {
  state: string;
  city: string;
  slug: string;
}

interface PageProps {
  params: RouteParams;
}

const FALLBACK_HERO = "/hero-bg.png";

function formatCurrency(value: number | null | undefined): string | null {
  if (value == null || !Number.isFinite(value)) return null;
  return `$${Math.round(value).toLocaleString()}`;
}

function formatStatusLabel(status: string | null | undefined): string {
  if (!status) return "Live";
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildAddressLine(listing: PublicListingDetail): string {
  if (listing.street_address && listing.street_address.trim()) {
    return listing.street_address.trim();
  }
  return listing.title;
}

function buildLocaleLine(listing: PublicListingDetail): string {
  const parts = [listing.city, listing.state].filter((p): p is string =>
    Boolean(p && p.trim())
  );
  return parts.join(", ");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const listing = await fetchPublicListing(params.slug);
  if (!listing) {
    return {
      title: "Listing not found | Zona Desert",
      description: "This listing is no longer available."
    };
  }
  const locale = buildLocaleLine(listing);
  const descriptionRaw = (listing.description ?? "").trim();
  const description = descriptionRaw
    ? `${locale ? `${locale} • ` : ""}${descriptionRaw.slice(0, 140)}${descriptionRaw.length > 140 ? "…" : ""}`
    : `Investor-ready opportunity${locale ? ` in ${locale}` : ""} on Zona Desert.`;
  return {
    title: `${listing.title} | Zona Desert`,
    description
  };
}

export default async function PublicListingDetailPage({ params }: PageProps) {
  const listing = await fetchPublicListing(params.slug);
  if (!listing) {
    notFound();
  }

  const heroSrc = listing.photos?.[0]?.trim() || listing.thumbnail_url?.trim() || FALLBACK_HERO;
  const addressLine = buildAddressLine(listing);
  const localeLine = buildLocaleLine(listing);
  const statusLabel = formatStatusLabel(listing.status);

  const startingBid = formatCurrency(listing.starting_bid);
  const buyNow = formatCurrency(listing.buy_now_price);
  const askingPrice = formatCurrency(listing.price);

  const keyFacts: Array<{ label: string; value: string }> = [];
  if (listing.beds != null) keyFacts.push({ label: "Beds", value: String(listing.beds) });
  if (listing.baths != null) keyFacts.push({ label: "Baths", value: String(listing.baths) });
  if (listing.sqft != null) keyFacts.push({ label: "Sq Ft", value: listing.sqft.toLocaleString() });
  if (listing.lot_size != null) keyFacts.push({ label: "Lot Size", value: `${listing.lot_size.toLocaleString()} sqft` });
  if (listing.rehab_level) keyFacts.push({ label: "Rehab Level", value: formatStatusLabel(listing.rehab_level) });

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-16">
      <div className="space-y-3">
        <Link
          href="/listings"
          className="inline-flex items-center text-sm font-semibold text-zona-purple hover:underline"
        >
          ← Back to all listings
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-zona-purple/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zona-purple">
            {statusLabel}
          </span>
          {localeLine ? (
            <span className="text-sm font-semibold text-slate-500">{localeLine}</span>
          ) : null}
        </div>
        <h1 className="text-4xl font-semibold text-slate-900">{addressLine}</h1>
        {localeLine ? (
          <p className="text-lg text-slate-600">{localeLine}</p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative h-72 w-full sm:h-96">
          <Image
            src={heroSrc}
            alt={addressLine}
            fill
            priority
            sizes="(min-width: 1024px) 64rem, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pricing</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold text-slate-500">Starting Bid</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{startingBid ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Buy Now</p>
            <p className="mt-1 text-3xl font-bold text-zona-purple">{buyNow ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Asking</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{askingPrice ?? "—"}</p>
          </div>
        </div>
        {!startingBid && !buyNow && !askingPrice ? (
          <p className="mt-4 text-sm text-slate-500">Price on request.</p>
        ) : null}
      </div>

      {keyFacts.length > 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Key Facts</h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {keyFacts.map((fact) => (
              <div key={fact.label} className="border-l-2 border-slate-100 pl-4">
                <dt className="text-xs font-semibold text-slate-500">{fact.label}</dt>
                <dd className="mt-1 text-lg font-semibold text-slate-900">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {listing.description ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">About this property</h2>
          <p className="mt-4 whitespace-pre-line text-slate-600">{listing.description}</p>
        </div>
      ) : null}

      <ZonaAgentChat slug={params.slug} listingLabel={addressLine} />
    </div>
  );
}

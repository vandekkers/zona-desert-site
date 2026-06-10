import Link from "next/link";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import BidBuyPanel from "@/components/listings/BidBuyPanel";
import DealDataPanel from "@/components/listings/DealDataPanel";
import ListingTabs from "@/components/listings/ListingTabs";
import OverviewPanel from "@/components/listings/OverviewPanel";
import { fetchPublicListing } from "@/lib/publicApi";
import type { PublicListingDetail } from "@/lib/types";

// Phase 5.5.c — Zona Agent chat widget mounts as a client-only island.
// Dynamic import with ssr:false keeps the SSR HTML free of the chat and
// blocked by it. Widget failure NEVER breaks the listing page.
const ZonaAgentChat = dynamic(() => import("@/components/ZonaAgentChat"), {
  ssr: false
});


// Phase 5.5.b — Public Listing 3-Tab Interface.
//
// Blueprint-locked nested URL: zonadesert.com/listings/[state]/[city]/[slug].
// state + city URL segments are SEO/readability only; the slug is the
// globally-unique lookup key.
//
// SSR Server Component (no "use client"). All three tab panels render
// server-side so search engines see the full listing payload in the
// initial HTML. The `ListingTabs` client island toggles visibility only;
// disabling JavaScript still leaves the Overview panel visible.
//
// generateMetadata now ships full OG + Twitter Card meta for richer
// previews when listings are shared. og:image falls back to the local
// hero asset when a listing has no photos so social cards never break.
//
// Out of scope for this slice (later 5.5.c / 5.6 / 5.7 / 5.9):
//   * Zona Agent chatbox
//   * Live bid submission + websocket pricing
//   * Buy Now + Stripe deposit flow
//   * Buyer authentication / registration

interface RouteParams {
  state: string;
  city: string;
  slug: string;
}

interface PageProps {
  params: RouteParams;
}

const FALLBACK_HERO = "/hero-bg.png";
const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://zonadesert.com").replace(
  /\/+$/,
  ""
);

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

function resolveOgImage(listing: PublicListingDetail): string {
  const firstPhoto = listing.photos?.find((src) => src && src.trim().length > 0);
  const thumbnail = listing.thumbnail_url?.trim();
  if (firstPhoto) return firstPhoto;
  if (thumbnail) return thumbnail;
  return `${SITE_ORIGIN}${FALLBACK_HERO}`;
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
  const title = `${listing.title} | Zona Desert`;
  const ogImage = resolveOgImage(listing);
  const url = `${SITE_ORIGIN}/listings/${encodeURIComponent(params.state)}/${encodeURIComponent(
    params.city
  )}/${encodeURIComponent(params.slug)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Zona Desert",
      type: "website",
      images: [
        {
          url: ogImage,
          alt: buildAddressLine(listing)
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage]
    }
  };
}

export default async function PublicListingDetailPage({ params }: PageProps) {
  const listing = await fetchPublicListing(params.slug);
  if (!listing) {
    notFound();
  }

  const addressLine = buildAddressLine(listing);
  const localeLine = buildLocaleLine(listing);
  const statusLabel = formatStatusLabel(listing.status);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-12 sm:py-16">
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
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{addressLine}</h1>
        {localeLine ? <p className="text-lg text-slate-600">{localeLine}</p> : null}
      </div>

      <ListingTabs
        overview={
          <OverviewPanel
            listing={listing}
            addressLine={addressLine}
            localeLine={localeLine}
          />
        }
        bidBuy={<BidBuyPanel listing={listing} />}
        dealData={<DealDataPanel listing={listing} />}
      />
      <ZonaAgentChat slug={params.slug} listingLabel={addressLine} />
    </div>
  );
}

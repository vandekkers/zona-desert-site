import Image from "next/image";

import ListingPhotoGallery from "@/components/ListingPhotoGallery";
import type { PublicListingDetail } from "@/lib/types";

// Phase 5.5.b — Overview tab content.
//
// Server component: rendered at the page level so the full content
// ships in the initial SSR HTML (crawlable). The only client island
// in this tree is the existing `ListingPhotoGallery` lightbox.

const FALLBACK_HERO = "/hero-bg.png";

function formatStatusLabel(status: string | null | undefined): string {
  if (!status) return "Live";
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

interface OverviewPanelProps {
  listing: PublicListingDetail;
  addressLine: string;
  localeLine: string;
}

export default function OverviewPanel({ listing, addressLine, localeLine }: OverviewPanelProps) {
  const photos = (listing.photos ?? []).filter((src) => src && src.trim().length > 0);
  const heroSrc = photos[0] || listing.thumbnail_url?.trim() || FALLBACK_HERO;

  const keyFacts: Array<{ label: string; value: string }> = [];
  if (listing.beds != null) keyFacts.push({ label: "Beds", value: String(listing.beds) });
  if (listing.baths != null) keyFacts.push({ label: "Baths", value: String(listing.baths) });
  if (listing.sqft != null)
    keyFacts.push({ label: "Sq Ft", value: listing.sqft.toLocaleString() });
  if (listing.lot_size != null)
    keyFacts.push({ label: "Lot Size", value: `${listing.lot_size.toLocaleString()} sqft` });
  if (listing.rehab_level)
    keyFacts.push({ label: "Rehab Level", value: formatStatusLabel(listing.rehab_level) });

  const highlights = (listing.highlights ?? []).filter((h) => h && h.trim().length > 0);

  return (
    <div className="space-y-8">
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

      {photos.length > 1 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Photos</h2>
          <p className="mt-1 text-sm text-slate-500">Tap any image for a full-size view.</p>
          <div className="mt-6">
            <ListingPhotoGallery photos={photos} title={addressLine} />
          </div>
        </div>
      ) : photos.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Additional photos coming soon.
        </div>
      ) : null}

      {keyFacts.length > 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Key Facts</h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {keyFacts.map((fact) => (
              <div key={fact.label} className="border-l-2 border-slate-100 pl-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-lg font-semibold text-slate-900">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {listing.street_address || localeLine ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Location</h2>
          <div className="mt-4 space-y-1 text-slate-700">
            {listing.street_address ? (
              <p className="text-lg font-semibold">{listing.street_address}</p>
            ) : null}
            {localeLine ? <p className="text-sm text-slate-500">{localeLine}</p> : null}
          </div>
        </div>
      ) : null}

      {listing.description ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">About this property</h2>
          <p className="mt-4 whitespace-pre-line text-slate-600">{listing.description}</p>
        </div>
      ) : null}

      {highlights.length > 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Highlights</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3 text-slate-700">
                <span
                  aria-hidden
                  className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-zona-purple"
                />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

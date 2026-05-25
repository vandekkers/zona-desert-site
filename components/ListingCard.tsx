import Link from "next/link";
import Image from "next/image";
import { ListingCard } from "@/lib/types";

interface Props {
  listing: ListingCard;
}

// Phase 5.5.a — slug-ify state + city for the nested URL segments.
// Backend listing slug is globally unique; state + city are SEO /
// readability only (the detail route fetches by slug alone). Slugify
// is lowercase + non-alphanumeric → "-" + collapse dupes + trim "-".
function slugifySegment(value: string | null | undefined): string {
  if (!value) return "unknown";
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || "unknown";
}

export function buildListingDetailHref(listing: ListingCard): string {
  const stateSlug = slugifySegment(listing.state);
  const citySlug = slugifySegment(listing.city);
  return `/listings/${stateSlug}/${citySlug}/${listing.slug}`;
}

export function ListingCardGrid({ listing }: Props) {
  const displayTitle = listing.address || listing.title;
  return (
    <Link
      href={buildListingDetailHref(listing)}
      className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
        <Image
          src={listing.thumbnailUrl || "/hero-bg.png"}
          alt={displayTitle}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
            {listing.marketStatus === "on-market" ? "On-Market" : "Off-Market"}
          </span>
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div>
          <p className="text-xs font-semibold text-zona-purple">{listing.city}, {listing.state}</p>
          <p className="text-lg font-semibold text-slate-900">{displayTitle}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500">Asking:</p>
          <p className="text-2xl font-bold text-slate-900">${listing.price.toLocaleString()}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1">Est. Rent {listing.estRent ? `$${listing.estRent.toLocaleString()}` : "—"}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">Cap Rate {listing.capRate ? `${listing.capRate}%` : "—"}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">ARV {listing.arv ? `$${listing.arv.toLocaleString()}` : "—"}</span>
        </div>
      </div>
    </Link>
  );
}

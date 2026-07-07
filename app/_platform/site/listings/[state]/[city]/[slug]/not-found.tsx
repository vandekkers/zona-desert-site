import Link from "next/link";

// Phase 5.5.a — branded 404 for the public listing detail route.
//
// Dispatched by notFound() in the nested route's Server Component
// when fetchPublicListing(slug) returns null. Reasons include: the
// listing slug doesn't exist, the listing is in a hidden lifecycle
// state (DRAFT / EXPIRED), or the row is soft-deleted.

export default function ListingNotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center space-y-6 px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zona-purple">
        Listing unavailable
      </p>
      <h1 className="text-3xl font-semibold text-slate-900">
        We couldn&apos;t find that listing
      </h1>
      <p className="text-slate-600">
        It may have sold, been taken off the market, or never existed at this
        address. Browse our current investor-ready opportunities below.
      </p>
      <Link
        href="/listings"
        className="rounded-full bg-zona-purple px-6 py-3 text-sm font-semibold text-white transition hover:bg-zona-purple-deep"
      >
        Back to Listings
      </Link>
    </div>
  );
}

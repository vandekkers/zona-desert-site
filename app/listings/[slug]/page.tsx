import Image from "next/image";
import { fetchListing } from "@/lib/api";
import { ListingDetail } from "@/lib/types";
import type { Metadata } from "next";
import ListingCallToAction from "@/components/ListingCallToAction";

interface ListingDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ListingDetailPageProps): Promise<Metadata> {
  const listing = await fetchListing(params.slug);
  return {
    title: `${listing.title} | Zona Desert`,
    description: `${listing.city}, ${listing.state} • ${listing.description.slice(0, 140)}...`
  };
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const listing: ListingDetail = await fetchListing(params.slug);
  const photos = listing.photos?.length ? listing.photos : [listing.thumbnailUrl ?? "/hero-bg.png"];

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-16">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zona-purple">Featured deal</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">{listing.title}</h1>
        <p className="text-slate-600">
          {listing.city}, {listing.state}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {photos.map((photo, index) => (
              <div key={photo + index} className="relative h-64 w-full overflow-hidden rounded-3xl">
                <Image
                  src={photo}
                  alt={`${listing.title} photo ${index + 1}`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Deal notes</h2>
            <p className="mt-3 text-slate-600">{listing.description}</p>
            {listing.highlights && (
              <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-slate-600">
                {listing.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Pricing</p>
            <p className="mt-2 text-4xl font-bold text-slate-900">${listing.price.toLocaleString()}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>Est. rent: {listing.estRent ? `$${listing.estRent.toLocaleString()}` : "—"}</p>
              <p>Cap rate: {listing.capRate ? `${listing.capRate}%` : "—"}</p>
              <p>Cash-on-cash: {listing.financials?.cashOnCash ? `${Math.round(listing.financials.cashOnCash * 100)}%` : "—"}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2 text-sm text-slate-600">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Deal structure</p>
            <p className="text-base font-semibold text-slate-900 capitalize">{listing.structure?.type ?? "Cash"}</p>
            {listing.structure?.type === "seller-finance" && (
              <ul className="mt-2 space-y-1">
                <li>Down payment: {listing.structure.downPayment ? `${listing.structure.downPayment * 100}%` : "TBD"}</li>
                <li>Rate: {listing.structure.interestRate ? `${listing.structure.interestRate}%` : "TBD"}</li>
                <li>Term: {listing.structure.termMonths ? `${listing.structure.termMonths} months` : "Flexible"}</li>
              </ul>
            )}
          </div>

          <ListingCallToAction slug={listing.slug} />
        </aside>
      </div>
    </div>
  );
}

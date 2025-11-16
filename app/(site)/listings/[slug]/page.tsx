import { fetchListing } from "@/lib/api";
import { ListingDetail } from "@/lib/types";
import type { Metadata } from "next";
import ListingCallToAction from "@/components/ListingCallToAction";
import ListingPhotoGallery from "@/components/ListingPhotoGallery";

interface ListingDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ListingDetailPageProps): Promise<Metadata> {
  const listing = await fetchListing(params.slug);
  return {
    title: `${listing.address || listing.title} | Zona Desert`,
    description: `${listing.city}, ${listing.state} • ${listing.description.slice(0, 140)}...`
  };
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const listing: ListingDetail = await fetchListing(params.slug);
  const displayTitle = listing.address || listing.title;
  const photos = listing.photos?.length ? listing.photos : [listing.thumbnailUrl ?? "/hero-bg.png"];
  const spreadValue =
    listing.financials?.arv && listing.price ? listing.financials.arv - listing.price : undefined;
  const stats = [
    { label: "Beds", value: listing.beds ? listing.beds.toString() : "—" },
    { label: "Baths", value: listing.baths ? listing.baths.toString() : "—" },
    { label: "Sq Ft", value: listing.sqft ? listing.sqft.toLocaleString() : "—" },
    { label: "Year Built", value: listing.yearBuilt ? listing.yearBuilt.toString() : "—" },
    { label: "Rehab Level", value: listing.rehabLevel ?? "TBD" },
    {
      label: "Est. Repair Cost",
      value: listing.estRepairCost ? `$${listing.estRepairCost.toLocaleString()}` : "—"
    },
    { label: "Price", value: `$${listing.price.toLocaleString()}` },
    {
      label: "ARV",
      value: listing.financials?.arv ? `$${listing.financials.arv.toLocaleString()}` : "—"
    },
    { label: "Spread", value: typeof spreadValue === "number" && spreadValue > 0 ? `$${spreadValue.toLocaleString()}` : "—" },
    {
      label: "Est. Rent",
      value: listing.estRent ? `$${listing.estRent.toLocaleString()}` : "—"
    },
    { label: "Cap Rate", value: listing.capRate ? `${listing.capRate}%` : "—" },
    {
      label: "Tenant Status",
      value: listing.tenantStatus ?? "TBD"
    }
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-16">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3 text-xs font-semibold text-zona-purple">
          <span className="rounded-full bg-zona-purple/10 px-3 py-1 text-zona-purple">
            {listing.marketStatus === "on-market" ? "On-Market" : "Off-Market"}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            {listing.tenantStatus?.toLowerCase().includes("vacant") ? "Vacant" : "Occupied"}
          </span>
        </div>
        <h1 className="text-4xl font-semibold text-slate-900">{displayTitle}</h1>
        <p className="text-lg text-slate-600">
          {listing.zip ? `${listing.zip} ` : ""}
          {listing.city}, {listing.state}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[3fr,1.1fr]">
        <div className="space-y-8">
          <ListingPhotoGallery photos={photos} title={displayTitle} />

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Key Stats</h2>
            <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="border-l-2 border-slate-100 pl-4">
                  <dt className="text-xs font-semibold text-slate-500">{stat.label}</dt>
                  <dd className="mt-1 text-lg font-semibold text-slate-900">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Deal Summary</h2>
            <p className="mt-3 text-slate-600">{listing.description}</p>
            {listing.highlights && (
              <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-slate-600">
                {listing.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            )}
          </div>

          {listing.comps?.length ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Comparable Sales</h2>
                  <p className="text-sm text-slate-500">Recent transactions investors are underwriting against.</p>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Private + MLS Sources</p>
              </div>
              <div className="mt-6 space-y-4">
                {listing.comps.map((comp) => (
                  <div key={`${comp.address}-${comp.soldDate}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{comp.address}</p>
                        <p className="text-sm text-slate-500">
                          {comp.city}, {comp.state}
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-slate-900">${comp.soldPrice.toLocaleString()}</p>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                      {comp.beds && <span>{comp.beds} Beds</span>}
                      {comp.baths && <span>{comp.baths} Baths</span>}
                      {comp.sqft && <span>{comp.sqft.toLocaleString()} Sq Ft</span>}
                      {comp.distanceMiles && <span>{comp.distanceMiles} mi away</span>}
                      <span>Sold {new Date(comp.soldDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Pricing Snapshot</p>
            <p className="mt-2 text-4xl font-bold text-slate-900">${listing.price.toLocaleString()}</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Est. Rent:</span>
                <span>{listing.estRent ? `$${listing.estRent.toLocaleString()}` : "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cap Rate:</span>
                <span>{listing.capRate ? `${listing.capRate}%` : "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cash-On-Cash:</span>
                <span>
                  {listing.financials?.cashOnCash ? `${Math.round(listing.financials.cashOnCash * 100)}%` : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Deal Structure:</span>
                <span className="capitalize">{listing.structure?.type ?? "Cash"}</span>
              </div>
            </div>
          </div>

          <ListingCallToAction slug={listing.slug} />
        </aside>
      </div>
    </div>
  );
}

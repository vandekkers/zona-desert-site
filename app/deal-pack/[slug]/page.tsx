import Image from "next/image";
import Link from "next/link";
import { getListingBySlug } from "@/lib/mockData";

interface Props {
  params: { slug: string };
}

export default function DealPackPage({ params }: Props) {
  const listing = getListingBySlug(params.slug);
  const stats = [
    { label: "Beds", value: listing.beds ? listing.beds.toString() : "N/A" },
    { label: "Baths", value: listing.baths ? listing.baths.toString() : "N/A" },
    { label: "Sq Ft", value: listing.sqft ? listing.sqft.toLocaleString() : "N/A" },
    { label: "Est. Rent", value: listing.estRent ? `$${listing.estRent.toLocaleString()}` : "N/A" },
    { label: "ARV", value: listing.arv ? `$${listing.arv.toLocaleString()}` : "N/A" },
    { label: "Price", value: `$${listing.price.toLocaleString()}` }
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-16">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.3em] text-zona-purple">Deal Pack</p>
        <h1 className="text-3xl font-semibold text-slate-900">{listing.address || listing.title}</h1>
        <p className="text-sm text-slate-600">
          {listing.zip ? `${listing.zip} ` : ""}
          {listing.city}, {listing.state}
        </p>
        <p className="text-sm text-slate-500">
          Review the snapshot below and download the PDF. Questions? Email{" "}
          <a href="mailto:info@zonadesert.com" className="text-zona-purple underline">
            info@zonadesert.com
          </a>
          .
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-3xl rounded-[32px] border border-slate-200 bg-white shadow-lg shadow-slate-300/40">
          <div className="flex h-full flex-col gap-6 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Zona Desert</p>
              <h2 className="text-2xl font-semibold text-slate-900">{listing.address || listing.title}</h2>
              <p className="text-sm text-slate-600">
                {listing.zip ? `${listing.zip} ` : ""}
                {listing.city}, {listing.state}
              </p>
            </div>
            <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-slate-100">
              <Image
                src={listing.thumbnailUrl || "/hero-bg.png"}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{stat.label}</p>
                  <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="flex-1 overflow-auto rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Summary</p>
              <p className="mt-2 text-sm text-slate-600">
                {listing.description ||
                  "This is placeholder listing copy. Update once live data populates the deal pack view."}
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Highlights</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {(listing.highlights || []).map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
            <p className="text-center text-[11px] text-slate-400">
              Preview generated from mock data. Download for PDF format.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href={`/api/deal-pack/${listing.slug}?download=1`}
          download
          className="rounded-full bg-zona-purple px-6 py-3 text-sm font-semibold text-white shadow shadow-zona-purple/30"
        >
          Download PDF
        </a>
        <Link
          href={`/listings/${listing.slug}`}
          className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700"
        >
          Back To Listing
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ListingCard } from "@/lib/types";

interface Props {
  listing: ListingCard;
}

export function ListingCardGrid({ listing }: Props) {
  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
        <Image
          src={listing.thumbnailUrl || "/hero-bg.png"}
          alt={listing.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {listing.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div>
          <p className="text-xs font-semibold text-zona-purple">{listing.city}, {listing.state}</p>
          <p className="text-lg font-semibold text-slate-900">{listing.title}</p>
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

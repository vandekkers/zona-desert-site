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
          <p className="text-xs uppercase tracking-wide text-zona-purple">{listing.city}, {listing.state}</p>
          <p className="text-lg font-semibold text-slate-900">{listing.title}</p>
        </div>
        <p className="text-2xl font-bold text-slate-900">${listing.price.toLocaleString()}</p>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Est. rent {listing.estRent ? `$${listing.estRent.toLocaleString()}` : "—"}</span>
          <span>Cap rate {listing.capRate ? `${listing.capRate}%` : "—"}</span>
        </div>
      </div>
    </Link>
  );
}

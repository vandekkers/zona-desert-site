import { Metadata } from "next";
import { fetchListings } from "@/lib/api";
import ListingFilters from "@/components/ListingFilters";
import { ListingCardGrid } from "@/components/ListingCard";
import { ListingQueryParams } from "@/lib/types";

export const metadata: Metadata = {
  title: "Browse Off-Market Deals | Zona Desert",
  description: "Search exclusive off-market investment properties across the Southwest."
};

interface ListingsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params: ListingQueryParams = {
    q: typeof searchParams.q === "string" ? searchParams.q : undefined,
    state: typeof searchParams.state === "string" ? searchParams.state : undefined,
    city: typeof searchParams.city === "string" ? searchParams.city : undefined,
    min_price: searchParams.min_price ? Number(searchParams.min_price) : undefined,
    max_price: searchParams.max_price ? Number(searchParams.max_price) : undefined,
    tags: Array.isArray(searchParams.tags)
      ? (searchParams.tags as string[])
      : searchParams.tags
        ? [searchParams.tags as string]
        : undefined
  };

  const { items, total } = await fetchListings(params);

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-16">
      <div className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-zona-purple">Zona desert marketplace</p>
        <h1 className="text-4xl font-semibold text-slate-900">Browse exclusive listings</h1>
        <p className="text-slate-600">{total} opportunities ready for offers. Tap filters to zero in on your buy box.</p>
      </div>

      <ListingFilters
        defaultValues={{
          q: params.q,
          state: params.state,
          city: params.city,
          min_price: params.min_price?.toString(),
          max_price: params.max_price?.toString(),
          tags: params.tags
        }}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((listing) => (
          <ListingCardGrid key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}

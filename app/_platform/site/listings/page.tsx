import { Metadata } from "next";
import { fetchListings } from "@/lib/api";
import ListingFilters from "@/components/ListingFilters";
import { ListingCardGrid } from "@/components/ListingCard";
import { ListingQueryParams } from "@/lib/types";

export const metadata: Metadata = {
  title: "Browse Investor-Ready Deals | Zona Desert",
  description: "Search private-market investment properties across the country."
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
    beds_min: searchParams.beds_min ? Number(searchParams.beds_min) : undefined,
    baths_min: searchParams.baths_min ? Number(searchParams.baths_min) : undefined,
    property_type: typeof searchParams.property_type === "string" ? searchParams.property_type : undefined,
    tenant_status: typeof searchParams.tenant_status === "string" ? searchParams.tenant_status : undefined,
    strategy: typeof searchParams.strategy === "string" ? searchParams.strategy : undefined,
    min_cap_rate: searchParams.min_cap_rate ? Number(searchParams.min_cap_rate) : undefined,
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
        <p className="text-sm uppercase tracking-[0.2em] text-zona-purple">Zona Desert Marketplace</p>
        <h1 className="text-4xl font-semibold text-slate-900">Browse Investor-Ready Listings</h1>
        <p className="text-slate-600">{total} opportunities ready for offers. Use filters to dial in your buy box.</p>
      </div>

      <ListingFilters
        defaultValues={{
          q: params.q,
          state: params.state,
          city: params.city,
          min_price: params.min_price?.toString(),
          max_price: params.max_price?.toString(),
          beds_min: params.beds_min?.toString(),
          baths_min: params.baths_min?.toString(),
          property_type: params.property_type,
          tenant_status: params.tenant_status,
          strategy: params.strategy,
          min_cap_rate: params.min_cap_rate?.toString(),
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

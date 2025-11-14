import Image from "next/image";
import Link from "next/link";
import { fetchListings } from "@/lib/api";
import { ListingCardGrid } from "@/components/ListingCard";

export default async function HomePage() {
  const { items } = await fetchListings();

  return (
    <div>
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <Image
          src="/hero-bg.png"
          alt="Zona Desert"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-32">
          <p className="text-sm uppercase tracking-[0.4em] text-zona-purple">Investor-Ready Platform</p>
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
            Zona Desert Is The Investor-First Marketplace For Creative Real Estate Deals Nationwide.
          </h1>
          <p className="max-w-2xl text-lg text-slate-200 md:text-xl">
            Browse vetted rentals, flips, and creative finance opportunities sourced from top agents, trusted wholesalers, and our in-house acquisitions team.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/listings"
              className="rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              Browse Deals
            </Link>
            <Link
              href="/buyers/join"
              className="rounded-full border border-white/40 px-6 py-3 text-base font-semibold text-white"
            >
              Join Buyers List
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zona-purple">Featured Deals</p>
            <h2 className="text-3xl font-semibold text-slate-900">Curated Investment Opportunities. Updated Frequently.</h2>
          </div>
          <Link href="/listings" className="text-sm font-semibold text-zona-purple">
            See All Listings →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map((listing) => (
            <ListingCardGrid key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-3">
          {[
            {
              title: "Creative Finance Ready",
              body: "Seller finance, novations, wraps, and other creative structures are clearly packaged for fast approvals."
            },
            {
              title: "Nationwide Private-Market Pipeline",
              body: "Inventory feeds in from agents and wholesalers across major metros, plus our internal sourcing desk."
            },
            {
              title: "Serious Buyers Only",
              body: "Fully vetted investors get first look on investor-ready deals before we widen distribution."
            }
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-zona-purple">{item.title}</p>
              <p className="mt-3 text-base text-slate-200">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

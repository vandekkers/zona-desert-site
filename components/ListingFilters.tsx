"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

interface ListingFiltersProps {
  defaultValues?: {
    q?: string;
    state?: string;
    city?: string;
    min_price?: string;
    max_price?: string;
    beds_min?: string;
    baths_min?: string;
    property_type?: string;
    tenant_status?: string;
    strategy?: string;
    min_cap_rate?: string;
    tags?: string[];
  };
}

const propertyTypeOptions = ["", "Single Family", "Small Multifamily", "Large Multifamily", "Townhome", "Condo", "Land", "Portfolio"];
const tenantStatusOptions = ["", "Vacant", "Tenant-Occupied", "Either"];
const bedBathOptions = ["", "1+", "2+", "3+", "4+", "5+"];
const capRateOptions = ["", "5", "6", "7", "8", "9", "10"];
const strategyFocusOptions = ["", "Turnkey", "Value-Add", "BRRRR", "Short-Term", "Mid-Term", "Portfolio", "Creative Finance"];
const tagFilters = ["investor-ready", "private-market", "seller-finance", "portfolio", "luxury", "mid-term"];

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function ListingFilters({ defaultValues = {} }: ListingFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<string[]>(defaultValues.tags || []);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setSelectedTags(defaultValues.tags || []);
  }, [defaultValues.tags]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    selectedTags.forEach((tag) => formData.append("tags", tag));

    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      if (!value) return;
      params.set(key, String(value));
    });
    if (selectedTags.length) {
      params.delete("tags");
      selectedTags.forEach((tag) => params.append("tags", tag));
    }

    router.push(`/listings${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function handleReset() {
    router.push("/listings");
    setSelectedTags([]);
    setIsMobileOpen(false);
  }

  const mobileVisible = isMobileOpen ? "block" : "hidden";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur md:p-6">
      <button
        type="button"
        onClick={() => setIsMobileOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 md:hidden"
        aria-expanded={isMobileOpen}
      >
        Filter Listings
        <span className={`transition-transform ${isMobileOpen ? "rotate-180" : ""}`}>
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 7l5 6 5-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div className={`${mobileVisible} md:block`}>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4 md:pt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="q" className="text-xs font-semibold text-slate-600">
                Search
              </label>
              <input
                id="q"
                name="q"
                defaultValue={defaultValues.q || searchParams.get("q") || ""}
                className="rounded-xl border border-slate-200 px-3 py-2 focus:border-zona-purple focus:outline-none"
                placeholder="Keyword, address, notes"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="state" className="text-xs font-semibold text-slate-600">
                State
              </label>
              <input
                id="state"
                name="state"
                defaultValue={defaultValues.state || searchParams.get("state") || ""}
                className="rounded-xl border border-slate-200 px-3 py-2 uppercase focus:border-zona-purple focus:outline-none"
                placeholder="AZ"
                maxLength={2}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="city" className="text-xs font-semibold text-slate-600">
                City
              </label>
              <input
                id="city"
                name="city"
                defaultValue={defaultValues.city || searchParams.get("city") || ""}
                className="rounded-xl border border-slate-200 px-3 py-2 focus:border-zona-purple focus:outline-none"
                placeholder="Phoenix"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="min_price" className="text-xs font-semibold text-slate-600">
                Min Price
              </label>
              <input
                id="min_price"
                name="min_price"
                type="number"
                defaultValue={defaultValues.min_price || searchParams.get("min_price") || ""}
                className="rounded-xl border border-slate-200 px-3 py-2 focus:border-zona-purple focus:outline-none"
                placeholder="250000"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="max_price" className="text-xs font-semibold text-slate-600">
                Max Price
              </label>
              <input
                id="max_price"
                name="max_price"
                type="number"
                defaultValue={defaultValues.max_price || searchParams.get("max_price") || ""}
                className="rounded-xl border border-slate-200 px-3 py-2 focus:border-zona-purple focus:outline-none"
                placeholder="1500000"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="strategy" className="text-xs font-semibold text-slate-600">
                Strategy Focus
              </label>
              <select
                id="strategy"
                name="strategy"
                defaultValue={defaultValues.strategy || searchParams.get("strategy") || ""}
                className="rounded-xl border border-slate-200 px-3 py-2 focus:border-zona-purple focus:outline-none"
              >
                {strategyFocusOptions.map((option) => (
                  <option key={option} value={option ? option.toLowerCase().replace(/\s+/g, "-") : ""}>
                    {option || "Any Strategy"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="beds_min" className="text-xs font-semibold text-slate-600">
                Beds (Min)
              </label>
              <select
                id="beds_min"
                name="beds_min"
                defaultValue={defaultValues.beds_min || searchParams.get("beds_min") || ""}
                className="rounded-xl border border-slate-200 px-3 py-2 focus:border-zona-purple focus:outline-none"
              >
                {bedBathOptions.map((value) => (
                  <option key={value} value={value ? value.replace("+", "") : ""}>
                    {value || "Any"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="baths_min" className="text-xs font-semibold text-slate-600">
                Baths (Min)
              </label>
              <select
                id="baths_min"
                name="baths_min"
                defaultValue={defaultValues.baths_min || searchParams.get("baths_min") || ""}
                className="rounded-xl border border-slate-200 px-3 py-2 focus:border-zona-purple focus:outline-none"
              >
                {bedBathOptions.map((value) => (
                  <option key={value} value={value ? value.replace("+", "") : ""}>
                    {value || "Any"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="property_type" className="text-xs font-semibold text-slate-600">
                Property Type
              </label>
              <select
                id="property_type"
                name="property_type"
                defaultValue={defaultValues.property_type || searchParams.get("property_type") || ""}
                className="rounded-xl border border-slate-200 px-3 py-2 focus:border-zona-purple focus:outline-none"
              >
                {propertyTypeOptions.map((option) => (
                  <option key={option || "any"} value={option ? option.toLowerCase().replace(/\s+/g, "-") : ""}>
                    {option || "Any"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="tenant_status" className="text-xs font-semibold text-slate-600">
                Tenant Status
              </label>
              <select
                id="tenant_status"
                name="tenant_status"
                defaultValue={defaultValues.tenant_status || searchParams.get("tenant_status") || ""}
                className="rounded-xl border border-slate-200 px-3 py-2 focus:border-zona-purple focus:outline-none"
              >
                {tenantStatusOptions.map((option) => (
                  <option key={option || "any"} value={option ? option.toLowerCase().replace(/\s+/g, "-") : ""}>
                    {option || "Any"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="min_cap_rate" className="text-xs font-semibold text-slate-600">
                Minimum Cap Rate
              </label>
              <select
                id="min_cap_rate"
                name="min_cap_rate"
                defaultValue={defaultValues.min_cap_rate || searchParams.get("min_cap_rate") || ""}
                className="rounded-xl border border-slate-200 px-3 py-2 focus:border-zona-purple focus:outline-none"
              >
                {capRateOptions.map((value) => (
                  <option key={value || "any"} value={value}>
                    {value ? `${value}%+` : "Any"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="tags" className="text-xs font-semibold text-slate-600">
                Deal Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tagFilters.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      selectedTags.includes(tag)
                        ? "border-zona-purple bg-zona-purple text-white"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    {formatLabel(tag)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="rounded-full bg-zona-purple px-5 py-2 text-sm font-semibold text-white">
              Apply Filters
            </button>
            <button type="button" className="text-sm font-semibold text-slate-500" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

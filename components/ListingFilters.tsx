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
    tags?: string[];
  };
}

const strategyTags = ["turnkey", "value-add", "brrrr", "short-term", "portfolio", "luxury"];

export default function ListingFilters({ defaultValues = {} }: ListingFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<string[]>(defaultValues.tags || []);
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
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="q" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
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
          <label htmlFor="state" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            State
          </label>
          <input
            id="state"
            name="state"
            defaultValue={defaultValues.state || searchParams.get("state") || ""}
            className="rounded-xl border border-slate-200 px-3 py-2 focus:border-zona-purple focus:outline-none"
            placeholder="AZ"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="city" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
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
          <label htmlFor="min_price" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Min price
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
          <label htmlFor="max_price" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Max price
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
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Strategy</span>
          <div className="flex flex-wrap gap-2">
            {strategyTags.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize transition ${
                  selectedTags.includes(tag)
                    ? "border-zona-purple bg-zona-purple text-white"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="submit" className="rounded-full bg-zona-purple px-5 py-2 text-sm font-semibold text-white">
          Apply Filters
        </button>
        <button type="button" className="text-sm text-slate-500" onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
}

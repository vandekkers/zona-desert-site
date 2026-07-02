"use client";

// BREAKAWAY: deals board — remove at platform launch
//
// Client island: main photo + thumbnail strip, tap a thumbnail to swap.
// Plain <img> by design — photo entries are founder-edited JSON (local
// paths or arbitrary https URLs) and must never break the build.

import { useState } from "react";

interface Props {
  photos: string[];
  alt: string;
}

export function DealGallery({ photos, alt }: Props) {
  const [active, setActive] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-3xl bg-zona-navy text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
        Photos coming soon
      </div>
    );
  }

  const photo = photos[Math.min(active, photos.length - 1)];

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-3xl bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt={alt} className="aspect-[16/10] w-full object-cover" />
      </div>
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((thumb, index) => (
            <button
              key={`${thumb}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Photo ${index + 1} of ${photos.length}`}
              className={`shrink-0 overflow-hidden rounded-xl border-2 transition ${
                index === active
                  ? "border-zona-purple-mid"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumb} alt="" loading="lazy" className="h-16 w-24 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

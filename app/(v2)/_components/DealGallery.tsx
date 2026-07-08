"use client";

// BREAKAWAY: deals board — remove at platform launch
//
// Client island: Zillow-style photo mosaic (desktop) / main image + thumb
// strip (mobile), with a full-screen lightbox — tap any photo to open,
// arrows/Escape/backdrop to navigate and close.
// Plain <img> by design — photo entries are founder-edited JSON (local
// paths or arbitrary https URLs) and must never break the build.

import { useEffect, useState } from "react";

interface Props {
  photos: string[];
  alt: string;
}

export function DealGallery({ photos, alt }: Props) {
  const [mobileIndex, setMobileIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  // Portrait photos (common for phone walkthroughs) are letterboxed on a
  // dark backdrop instead of being center-cropped into landscape frames —
  // cropping made them look "zoomed in". Detected per image at load time.
  const [portraits, setPortraits] = useState<Record<number, boolean>>({});

  const count = photos.length;

  const markPortrait = (index: number, el: HTMLImageElement | null) => {
    if (!el || !el.complete || el.naturalWidth === 0) return;
    const isPortrait = el.naturalHeight > el.naturalWidth;
    setPortraits((prev) => (prev[index] === isPortrait ? prev : { ...prev, [index]: isPortrait }));
  };

  const fitClass = (index: number) => (portraits[index] ? "object-contain" : "object-cover");

  useEffect(() => {
    if (lightbox === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % count));
      if (event.key === "ArrowLeft")
        setLightbox((i) => (i === null ? i : (i - 1 + count) % count));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, count]);

  if (count === 0) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-3xl bg-zona-navy text-sm font-semibold uppercase tracking-[0.3em] text-white/60 md:aspect-[21/9]">
        Photos coming soon
      </div>
    );
  }

  // Mosaic geometry adapts to photo count so no cell is ever left empty:
  // 5+ photos → main + 4 side cells; 3-4 → main + 2 side cells (+N overlay);
  // 2 → main + one tall side cell; 1 → single wide image.
  const sideSlots = count >= 5 ? 4 : count >= 3 ? 2 : count - 1;
  const mosaicSide = photos.slice(1, 1 + sideSlots);
  const extraCount = count - 1 - sideSlots;
  const containerShape =
    sideSlots === 4
      ? "md:aspect-[8/3] md:grid-cols-4 md:grid-rows-2"
      : sideSlots > 0
        ? "md:aspect-[2/1] md:grid-cols-3 md:grid-rows-2"
        : "md:aspect-[21/9] md:grid-cols-1";

  return (
    <>
      {/* Desktop mosaic */}
      <div className={`hidden overflow-hidden rounded-3xl md:grid md:gap-2 ${containerShape}`}>
        <button
          type="button"
          onClick={() => setLightbox(0)}
          aria-label={`Open photo 1 of ${count}`}
          className={`group relative block h-full w-full bg-zona-navy ${
            sideSlots > 0 ? "col-span-2 row-span-2" : ""
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[0]}
            alt={alt}
            ref={(el) => markPortrait(0, el)}
            onLoad={(e) => markPortrait(0, e.currentTarget)}
            className={`absolute inset-0 h-full w-full transition duration-300 group-hover:brightness-95 ${fitClass(0)}`}
          />
        </button>
        {mosaicSide.map((photo, i) => {
          const index = i + 1;
          const isLastCell = i === mosaicSide.length - 1 && extraCount > 0;
          return (
            <button
              key={`${photo}-${index}`}
              type="button"
              onClick={() => setLightbox(index)}
              aria-label={`Open photo ${index + 1} of ${count}`}
              className={`group relative block h-full w-full ${
                sideSlots === 1 ? "row-span-2" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:brightness-95"
              />
              {isLastCell && (
                <span className="absolute inset-0 flex items-center justify-center bg-zona-navy/60 text-lg font-semibold text-white">
                  +{extraCount} {extraCount === 1 ? "photo" : "photos"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile: main image (tap to open lightbox) + thumb strip */}
      <div className="space-y-3 md:hidden">
        <button
          type="button"
          onClick={() => setLightbox(mobileIndex)}
          aria-label={`Open photo ${mobileIndex + 1} of ${count}`}
          className="relative block w-full overflow-hidden rounded-3xl bg-zona-navy"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[Math.min(mobileIndex, count - 1)]}
            alt={alt}
            ref={(el) => markPortrait(Math.min(mobileIndex, count - 1), el)}
            onLoad={(e) => markPortrait(Math.min(mobileIndex, count - 1), e.currentTarget)}
            className={`aspect-[16/10] w-full ${fitClass(Math.min(mobileIndex, count - 1))}`}
          />
          <span className="absolute bottom-3 right-3 rounded-full bg-zona-navy/70 px-3 py-1 text-xs font-semibold text-white">
            {Math.min(mobileIndex, count - 1) + 1} / {count}
          </span>
        </button>
        {count > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {photos.map((thumb, index) => (
              <button
                key={`${thumb}-${index}`}
                type="button"
                onClick={() => setMobileIndex(index)}
                aria-label={`Photo ${index + 1} of ${count}`}
                className={`shrink-0 overflow-hidden rounded-xl border-2 transition ${
                  index === mobileIndex
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

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${lightbox + 1} of ${count}`}
          className="fixed inset-0 z-[60] flex flex-col bg-zona-navy/95"
          onClick={() => setLightbox(null)}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="text-sm font-semibold">
              {lightbox + 1} / {count}
            </span>
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close photos"
              className="rounded-full border border-white/30 px-4 py-1.5 text-sm font-semibold hover:bg-white/10"
            >
              Close ✕
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6">
            {/* Viewport-based size caps: percentage heights silently fail
                inside nested flex on some browsers (iOS Safari), which let
                the photo render at natural size — top visible, bottom cut
                off. svh/vw constraints hold everywhere, for any aspect
                ratio, and m-auto keeps the photo dead-centered. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[lightbox]}
              alt={`${alt} — photo ${lightbox + 1}`}
              onClick={(event) => event.stopPropagation()}
              className="m-auto block h-auto w-auto max-h-[80svh] max-w-[94vw] rounded-xl object-contain sm:max-h-[84vh] sm:max-w-[88vw]"
            />
            {count > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={(event) => {
                    event.stopPropagation();
                    setLightbox((lightbox - 1 + count) % count);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-xl font-semibold text-white hover:bg-white/20"
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={(event) => {
                    event.stopPropagation();
                    setLightbox((lightbox + 1) % count);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-xl font-semibold text-white hover:bg-white/20"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

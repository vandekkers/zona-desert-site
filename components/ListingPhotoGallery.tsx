"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface ListingPhotoGalleryProps {
  photos: string[];
  title: string;
}

export default function ListingPhotoGallery({ photos, title }: ListingPhotoGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const showPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isModalOpen) return;
      if (event.key === "Escape") closeModal();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "ArrowLeft") showPrev();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal, isModalOpen, showNext, showPrev]);

  function openModal(index: number) {
    setActiveIndex(index);
    setIsModalOpen(true);
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {photos.map((photo, index) => (
          <button
            key={`${photo}-${index}`}
            type="button"
            onClick={() => openModal(index)}
            className="group relative h-64 w-full overflow-hidden rounded-3xl focus:outline-none focus:ring-2 focus:ring-zona-purple"
          >
            <Image
              src={photo}
              alt={`${title} photo ${index + 1}`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 p-4">
          <button className="absolute right-4 top-4 text-white" onClick={closeModal} aria-label="Close gallery">
            <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            onClick={showPrev}
            aria-label="Previous photo"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            onClick={showNext}
            aria-label="Next photo"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="relative h-[70vh] w-full max-w-5xl">
            <Image
              src={photos[activeIndex]}
              alt={`${title} photo ${activeIndex + 1}`}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="rounded-3xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}

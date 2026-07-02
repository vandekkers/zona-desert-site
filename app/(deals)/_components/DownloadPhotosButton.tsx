"use client";

// BREAKAWAY: deals board — remove at platform launch
//
// Downloads every deal photo to the visitor's device. The ONLY fetch()
// in the deals group — it fetches the deal's own image URLs client-side
// to turn them into downloadable blobs (cross-origin images ignore the
// <a download> attribute otherwise). No API/backend calls.

import { useState } from "react";

interface Props {
  photos: string[];
  dealId: string;
}

export function DownloadPhotosButton({ photos, dealId }: Props) {
  const [state, setState] = useState<"idle" | "working" | "done" | "error">("idle");

  async function downloadAll() {
    if (state === "working" || photos.length === 0) return;
    setState("working");
    let failures = 0;
    for (let i = 0; i < photos.length; i++) {
      try {
        const response = await fetch(photos[i]);
        if (!response.ok) throw new Error(String(response.status));
        const blob = await response.blob();
        const extension = blob.type.split("/")[1]?.split("+")[0] || "jpg";
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${dealId}-${i + 1}.${extension}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        // Small gap so browsers treat these as separate user-initiated saves.
        await new Promise((resolve) => setTimeout(resolve, 350));
      } catch {
        failures++;
      }
    }
    setState(failures === photos.length ? "error" : "done");
    setTimeout(() => setState("idle"), 3000);
  }

  const label =
    state === "working"
      ? "Downloading…"
      : state === "done"
        ? "Saved ✓"
        : state === "error"
          ? "Couldn't download"
          : `Download photos (${photos.length})`;

  return (
    <button
      type="button"
      onClick={downloadAll}
      disabled={state === "working" || photos.length === 0}
      className="flex w-full items-center justify-center rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60"
    >
      {label}
    </button>
  );
}

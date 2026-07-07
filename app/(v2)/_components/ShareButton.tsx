"use client";

// BREAKAWAY: deals board — remove at platform launch
//
// Native share sheet where available (the texted-link flow this board is
// built for), clipboard fallback elsewhere. No storage APIs.

import { useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user dismissed the sheet — nothing to do
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — button just stays inert
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="flex w-full items-center justify-center rounded-[10px] border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
    >
      {copied ? "Link copied ✓" : "Share this deal"}
    </button>
  );
}

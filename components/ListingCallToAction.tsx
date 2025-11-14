"use client";

import { useState } from "react";

export default function ListingCallToAction({ slug }: { slug: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const ctas = [
    {
      label: "Request Deal Pack",
      helper: "Full underwriting, photos, and comps in one PDF."
    },
    {
      label: "Submit Offer / LOI",
      helper: "Share terms and proof of funds to lock the opportunity."
    },
    {
      label: "Talk To Our Team",
      helper: "Ask questions about structure, rehab, or boots-on-ground."
    }
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-md">
      <p className="text-sm font-semibold text-zona-purple">Next Steps</p>
      <p className="mt-3 text-lg font-semibold">Ready To Dive Deeper?</p>
      <div className="mt-6 space-y-4">
        {ctas.map((cta) => (
          <button
            key={cta.label}
            className="w-full rounded-2xl border border-white/20 px-4 py-3 text-left text-sm font-semibold hover:bg-white/10"
            onClick={() => setMessage(`${cta.label} request captured for ${slug}. We'll follow up shortly.`)}
          >
            <div>{cta.label}</div>
            <p className="text-xs font-normal text-white/70">{cta.helper}</p>
          </button>
        ))}
      </div>
      {message && <p className="mt-4 text-xs text-zona-purple">{message}</p>}
      <p className="mt-4 text-xs text-white/60">Forms will post to zona-admin endpoints once wired.</p>
    </div>
  );
}

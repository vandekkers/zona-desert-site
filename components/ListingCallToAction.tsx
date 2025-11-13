"use client";

import { useState } from "react";

export default function ListingCallToAction({ slug }: { slug: string }) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-md">
      <p className="text-sm uppercase tracking-[0.3em] text-zona-purple">Next steps</p>
      <p className="mt-3 text-lg font-semibold">Ready to dive deeper?</p>
      <div className="mt-6 space-y-3">
        {["Request Deal Pack", "Submit Offer / LOI", "Talk to Our Team"].map((cta) => (
          <button
            key={cta}
            className="w-full rounded-full border border-white/20 px-4 py-3 text-left text-sm font-semibold hover:bg-white/10"
            onClick={() => setMessage(`${cta} request captured for ${slug}. We'll follow up shortly.`)}
          >
            {cta}
          </button>
        ))}
      </div>
      {message && <p className="mt-4 text-xs text-zona-purple">{message}</p>}
      <p className="mt-4 text-xs text-white/60">Forms will post to zona-admin endpoints once wired.</p>
    </div>
  );
}

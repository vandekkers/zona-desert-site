// BREAKAWAY: deals board — remove at platform launch
//
// Owner-only deal builder. This path is deliberately NOT in the
// middleware BYPASS_PREFIXES, so the existing owner-access cookie wall
// gates it: Van (logged in at /__owner-access) sees the form; everyone
// else is rewritten to the public board. No new auth code.

import type { Metadata } from "next";
import { DealDeskForm } from "../_components/DealDeskForm";
import { getDeals, getDealsConfig, sora } from "../_lib/deals";

export const metadata: Metadata = {
  title: "Deal Desk | Zona Desert",
  robots: { index: false, follow: false }
};

export default function DealDeskPage() {
  const config = getDealsConfig();
  const deals = getDeals();
  // Baked in at build time — setting the env var + redeploying flips it,
  // and every gateway commit triggers a rebuild anyway.
  const gatewayReady = Boolean(process.env.GITHUB_DEALS_TOKEN);
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
      <p className="text-xs uppercase tracking-[0.35em] text-zona-purple-mid">Owner tools</p>
      <h1 className="mt-2 text-2xl text-zona-navy md:text-3xl" style={sora}>
        Deal desk
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Build a deal below (or paste JSON from an AI assistant), review the live numbers, then
        commit it to GitHub with one click — the board updates itself about two minutes later.
        Photos upload separately to <code className="rounded bg-white px-1.5 py-0.5 text-xs">public/deals/&lt;id&gt;/</code>.
      </p>
      <div className="mt-8">
        <DealDeskForm config={config} deals={deals} gatewayReady={gatewayReady} />
      </div>
    </div>
  );
}

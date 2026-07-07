// SITE V2 — public site shell. Pure front end: pages in this group read
// content/deals/*.json at build time and compose contact via mail/SMS.
// No platform-backend calls (those routes are shelved in app/_platform/
// until platform launch — see SITE_V2.md).

import { SiteFooter } from "./_components/SiteFooter";
import { SiteHeader } from "./_components/SiteHeader";
import { getDeals, getDealsConfig } from "./_lib/deals";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const config = getDealsConfig();
  const liveDeals = getDeals().filter((deal) => deal.status === "available").length;

  return (
    <div className="flex min-h-screen flex-col bg-zona-sand text-zona-navy">
      <SiteHeader liveDeals={liveDeals} />
      <main className="flex-1">{children}</main>
      <SiteFooter config={config} />
    </div>
  );
}

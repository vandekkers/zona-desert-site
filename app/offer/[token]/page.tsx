import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPublicOffer } from "@/lib/publicApi";
import { OfferHero } from "@/components/portal/OfferHero";
import { LayerWhyZona } from "@/components/portal/LayerWhyZona";
import { LayerCompEvidence } from "@/components/portal/LayerCompEvidence";
import { LayerPropertyProfile } from "@/components/portal/LayerPropertyProfile";
import { LayerScoreBreakdown } from "@/components/portal/LayerScoreBreakdown";
import { StickyActionBar } from "@/components/portal/StickyActionBar";
import { TerminalState } from "@/components/portal/TerminalState";

// Token-gated content must never be indexed. Robots noindex/nofollow per
// blueprint §3.1 (Token-Based Access).
export const metadata: Metadata = {
  title: "Your Zona Desert Offer",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false
    }
  }
};

// Server Component — token fetch happens server-side (no CORS, never
// cached). Dispatch to the client OfferHero for the active-state
// countdown timer; terminal states render via TerminalState (no
// interactivity needed). Active state extends below the Hero with the
// blueprint Layer 2-5 sections (4.5.h.ui).
export default async function OfferPage({ params }: { params: { token: string } }) {
  const offer = await fetchPublicOffer(params.token);
  if (!offer) notFound();

  if (offer.status === "active") {
    return (
      <>
        <OfferHero offer={offer} />
        <div
          data-zona-gate="1"
          className="bg-zona-off-white pb-32 sm:pb-24"
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 sm:px-6">
            <LayerWhyZona />
            <LayerCompEvidence comps={offer.comps} />
            <LayerPropertyProfile
              propertyFacts={offer.property_facts}
              exitStrategy={offer.exit_strategy}
            />
            <LayerScoreBreakdown bucketScores={offer.offer?.bucket_scores ?? []} />
          </div>
        </div>
        <StickyActionBar
          token={params.token}
          targetOffer={offer.offer?.target_offer ?? "0"}
        />
      </>
    );
  }
  return <TerminalState offer={offer} />;
}

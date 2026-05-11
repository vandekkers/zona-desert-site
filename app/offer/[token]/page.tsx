import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPublicOffer } from "@/lib/publicApi";
import { OfferHero } from "@/components/portal/OfferHero";
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
// interactivity needed).
export default async function OfferPage({ params }: { params: { token: string } }) {
  const offer = await fetchPublicOffer(params.token);
  if (!offer) notFound();

  if (offer.status === "active") {
    return <OfferHero offer={offer} />;
  }
  return <TerminalState offer={offer} />;
}

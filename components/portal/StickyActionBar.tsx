"use client";

// StickyActionBar (Phase 4.5.i) — fixed bottom action surface that owns the
// 3-modal state for Accept / Counter / Contact. Rendered only when parent
// (app/offer/[token]/page.tsx) is in the active state — terminal states
// never mount this component.
//
// Visual hierarchy per blueprint §3.4 + §3.5:
//   - Accept   = PRIMARY (brand-purple-mid filled)
//   - Counter  = SECONDARY (brand-amber outlined)
//   - Contact  = TERTIARY (text-only navy link)
//
// Reading-width constrained (max-w-4xl) so the action bar mirrors the layer
// container width above it. Container has z-30 so the page content can
// scroll behind without bleeding through the top border + shadow.

import { useState } from "react";
import { AcceptOfferModal } from "./AcceptOfferModal";
import { CounterOfferModal } from "./CounterOfferModal";
import { ContactModal } from "./ContactModal";

interface Props {
  token: string;
  targetOffer: string;
}

type ActiveModal = "accept" | "counter" | "contact" | null;

export function StickyActionBar({ token, targetOffer }: Props) {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zona-navy/10 bg-zona-off-white/95 shadow-[0_-8px_24px_-12px_rgba(14,23,42,0.18)] backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setActiveModal("contact")}
              className="order-3 text-base text-zona-navy/75 transition hover:text-zona-navy sm:order-1 sm:py-2"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
            >
              Contact Zona
            </button>

            <div className="order-1 flex flex-col gap-3 sm:order-2 sm:flex-row sm:items-center sm:gap-3">
              <button
                type="button"
                onClick={() => setActiveModal("counter")}
                className="rounded-lg border-2 border-zona-amber bg-white px-5 py-2.5 text-base text-zona-navy shadow-sm transition hover:bg-zona-amber/10"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
              >
                Counter
              </button>
              <button
                type="button"
                onClick={() => setActiveModal("accept")}
                className="rounded-lg bg-zona-purple-mid px-6 py-2.5 text-base text-white shadow-sm transition hover:bg-zona-purple-deep"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
              >
                Accept Offer
              </button>
            </div>
          </div>
        </div>
      </div>

      <AcceptOfferModal
        open={activeModal === "accept"}
        token={token}
        targetOffer={targetOffer}
        onClose={() => setActiveModal(null)}
      />
      <CounterOfferModal
        open={activeModal === "counter"}
        token={token}
        onClose={() => setActiveModal(null)}
      />
      <ContactModal
        open={activeModal === "contact"}
        token={token}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
}

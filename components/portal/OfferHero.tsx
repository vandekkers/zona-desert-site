"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { PublicOfferResponse } from "@/lib/types";

interface Props {
  offer: PublicOfferResponse;
}

function formatCurrency(amount: string | null | undefined): string {
  if (!amount) return "—";
  const num = Number(amount);
  if (!Number.isFinite(num)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(num);
}

interface Remaining {
  expired: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeRemaining(expiresAtIso: string): Remaining {
  const now = Date.now();
  const expiresAt = new Date(expiresAtIso).getTime();
  const diffMs = expiresAt - now;
  if (!Number.isFinite(expiresAt) || diffMs <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { expired: false, days, hours, minutes, seconds };
}

function formatRemaining(r: Remaining): string {
  if (r.expired) return "This offer has just expired. Refresh to update.";
  if (r.days > 0) return `Offer expires in ${r.days}d ${r.hours}h ${r.minutes}m`;
  if (r.hours > 0) return `Offer expires in ${r.hours}h ${r.minutes}m ${r.seconds}s`;
  if (r.minutes > 0) return `Offer expires in ${r.minutes}m ${r.seconds}s`;
  return `Offer expires in ${r.seconds}s`;
}

export function OfferHero({ offer }: Props) {
  // SSR pass: compute once from props so initial markup matches hydration.
  // Client tick: refresh every second.
  const [remaining, setRemaining] = useState<Remaining>(() =>
    computeRemaining(offer.expires_at)
  );

  useEffect(() => {
    const tick = () => setRemaining(computeRemaining(offer.expires_at));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [offer.expires_at]);

  const targetOffer = offer.offer?.target_offer ?? null;
  // Phase 4.5.g foundation: backend doesn't yet expose property address on
  // the public response. Property address surfaces with Layer 4 work in
  // 4.5.h. Today the hero shows the headline + countdown only.
  // (Per Rule 10.21: prompt asserted address in Layer 1; surfacing as drift
  // because PublicOfferResponse contract has no address field.)

  return (
    <main
      data-zona-gate="1"
      className="flex min-h-screen flex-col bg-zona-off-white"
    >
      <header className="flex items-center justify-start px-6 py-6 md:px-12">
        <div className="relative h-10 w-32">
          <Image
            src="/brand/zona-logo-primary-dark.png"
            alt="Zona Desert"
            fill
            sizes="128px"
            className="object-contain object-left"
            priority
          />
        </div>
      </header>

      <section className="flex flex-1 items-center justify-center px-6 py-12 md:py-20">
        <div className="w-full max-w-3xl space-y-10 text-center">
          <div className="space-y-2">
            <p
              className="text-xs uppercase tracking-[0.3em] text-zona-purple-mid"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
            >
              Your Offer From Zona Desert
            </p>
            <p
              className="text-5xl text-zona-navy md:text-7xl"
              style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
            >
              {formatCurrency(targetOffer)}
            </p>
          </div>

          <div
            className="inline-flex items-center justify-center gap-2 rounded-full border border-zona-amber/40 bg-zona-amber/10 px-5 py-2"
            role="status"
            aria-live="polite"
          >
            <span
              className="text-sm text-zona-navy md:text-base"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
            >
              {formatRemaining(remaining)}
            </span>
          </div>

          <div className="pt-8">
            <a
              href="#offer-details"
              className="inline-flex flex-col items-center gap-1 text-zona-navy/60 transition hover:text-zona-purple-mid"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
              aria-label="Scroll for more details"
            >
              <span className="text-sm">More details below</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <div id="offer-details" />
    </main>
  );
}

import Image from "next/image";
import type { PublicOfferResponse } from "@/lib/types";

interface Props {
  offer: PublicOfferResponse;
}

const ZONA_CONTACT_EMAIL = "hello@zonadesert.com";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
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

function buildCopy(offer: PublicOfferResponse): {
  headline: string;
  detail: string | null;
  showContact: boolean;
} {
  switch (offer.status) {
    case "expired":
      return {
        headline: "This offer has expired.",
        detail: null,
        showContact: true
      };
    case "accepted": {
      const when = formatDate(offer.accepted_at);
      return {
        headline: "This offer has been accepted.",
        detail: when ? `Accepted on ${when}. We'll be in touch.` : "We'll be in touch.",
        showContact: false
      };
    }
    case "countered": {
      const when = formatDate(offer.countered_at);
      const amount = formatCurrency(offer.counter_amount);
      const datePart = when ? ` on ${when}` : "";
      return {
        headline: `Counter offer of ${amount} submitted${datePart}.`,
        detail: "We'll be in touch.",
        showContact: false
      };
    }
    case "revoked":
      return {
        headline: "This offer is no longer available.",
        detail: null,
        showContact: true
      };
    default:
      // Shouldn't reach here — page.tsx routes "active" to OfferHero.
      return {
        headline: "This offer is no longer available.",
        detail: null,
        showContact: true
      };
  }
}

export function TerminalState({ offer }: Props) {
  const { headline, detail, showContact } = buildCopy(offer);

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
        <div className="w-full max-w-2xl space-y-6 text-center">
          <h1
            className="text-3xl text-zona-navy md:text-4xl"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
          >
            {headline}
          </h1>
          {detail ? (
            <p
              className="text-base text-zona-navy/70 md:text-lg"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {detail}
            </p>
          ) : null}
          {showContact ? (
            <p
              className="text-base text-zona-navy/70 md:text-lg"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Reach us at{" "}
              <a
                href={`mailto:${ZONA_CONTACT_EMAIL}`}
                className="text-zona-purple-mid underline"
              >
                {ZONA_CONTACT_EMAIL}
              </a>
              .
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}

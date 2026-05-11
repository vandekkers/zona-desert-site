import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offer not found | Zona Desert",
  robots: {
    index: false,
    follow: false
  }
};

export default function OfferNotFound() {
  return (
    <main
      data-zona-gate="1"
      className="flex min-h-screen flex-col items-center justify-center bg-zona-off-white px-6 py-16"
    >
      <div className="w-full max-w-xl space-y-8 text-center">
        <div className="mx-auto h-16 w-16 relative">
          <Image
            src="/brand/zona-logo-icon.png"
            alt="Zona Desert"
            fill
            sizes="64px"
            className="object-contain"
            priority
          />
        </div>
        <h1
          className="text-3xl text-zona-navy"
          style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
        >
          This offer link isn&apos;t valid or has been removed.
        </h1>
        <p
          className="text-base text-zona-navy/70"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          If you believe this is a mistake, reach us at{" "}
          <a
            href="mailto:hello@zonadesert.com"
            className="text-zona-purple-mid underline"
          >
            hello@zonadesert.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}

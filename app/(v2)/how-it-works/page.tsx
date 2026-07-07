// SITE V2 — how it works, for both sides of the table.

import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "../_components/PageIntro";

export const metadata: Metadata = {
  title: "How It Works | Zona Desert",
  description:
    "How deals flow through Zona Desert — for sellers who need a real offer fast, and investors who want underwritten inventory."
};

const SELLER_STEPS = [
  {
    num: "STEP 01",
    title: "Submit Your Property",
    body: "Address, beds, condition. Two minutes, from your phone. Reviewed by a person — never an algorithm alone.",
    time: "~ 2 min"
  },
  {
    num: "STEP 02",
    title: "We Run The Numbers",
    body: "Comps, rehab scope, rent potential. You get a real cash offer grounded in the same underwriting our investors see.",
    time: "~ 24 hr"
  },
  {
    num: "STEP 03",
    title: "Close On Your Timeline",
    body: "Pick the date. Clear title, transparent terms, cash buyers already vetted.",
    time: "Days, not months"
  }
];

const INVESTOR_STEPS = [
  {
    num: "01",
    title: "Share Your Buy Box",
    body: "Where and what you buy — strategy, markets, budget, return floor. We source against it."
  },
  {
    num: "02",
    title: "Review Underwritten Drops",
    body: "Deal pages carry photos, the NOI waterfall, rehab scope, comps, and terms. Assumptions labeled."
  },
  {
    num: "03",
    title: "Act Fast",
    body: "Call, text, or submit an offer straight from the listing. EMD and close method are posted up front."
  }
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-14 lg:px-8 lg:py-20">
      <PageIntro
        eyebrow="Process"
        title="Exactly How Deals Flow Through Zona Desert."
        lede="Two sides, one standard: real numbers, straight answers, fast closings."
        center
      />

      {/* Sellers — navy panel */}
      <div className="relative mt-12 overflow-hidden rounded-3xl bg-zona-navy p-8 text-white sm:p-11 lg:p-14">
        <div className="pointer-events-none absolute -right-28 -top-28 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(254,169,30,0.45)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(74,25,136,0.65)_0%,transparent_70%)]" />
        <div className="relative z-10 mb-9">
          <div className="mb-3.5 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-zona-amber">
            <span className="h-[1.5px] w-[18px] bg-zona-amber" />
            Selling A Property
          </div>
          <h2 className="font-display text-[28px] font-semibold leading-[1.1] tracking-[-0.018em] lg:text-[34px]">
            Three Steps. Real Offer In 24 Hours.
          </h2>
        </div>
        <div className="relative z-10 grid gap-8 md:grid-cols-3 md:gap-0">
          {SELLER_STEPS.map((step, index) => (
            <div
              key={step.num}
              className={`md:px-9 ${index === 0 ? "md:pl-0" : ""} ${index === 2 ? "md:pr-0" : ""} ${
                index < 2 ? "md:border-r md:border-white/10" : ""
              }`}
            >
              <span className="mb-4 inline-block rounded-full border border-white/[0.18] px-2.5 py-1 font-display text-xs font-semibold tracking-[0.05em] text-zona-amber">
                {step.num}
              </span>
              <h3 className="mb-2.5 font-display text-[20px] font-semibold tracking-[-0.015em]">
                {step.title}
              </h3>
              <p className="text-[14.5px] leading-relaxed text-white/65">{step.body}</p>
              <p className="mt-4 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-zona-amber">
                {step.time}
              </p>
            </div>
          ))}
        </div>
        <div className="relative z-10 mt-9">
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 rounded-[10px] bg-white px-6 py-3 text-[15px] font-semibold text-zona-purple-deep transition hover:bg-zona-sand"
          >
            Start My Submission →
          </Link>
        </div>
      </div>

      {/* Investors — white cards */}
      <div className="mt-14">
        <div className="mb-8">
          <div className="mb-3.5 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-zona-purple-deep">
            <span className="h-[1.5px] w-[18px] bg-zona-purple-mid" />
            Buying A Deal
          </div>
          <h2 className="font-display text-[28px] font-semibold leading-[1.1] tracking-[-0.018em] text-zona-navy lg:text-[34px]">
            From Buy Box To Closing Table.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {INVESTOR_STEPS.map((step) => (
            <div
              key={step.num}
              className="flex flex-col gap-3.5 rounded-2xl border border-zona-navy/[0.06] bg-white p-6 transition duration-150 hover:-translate-y-0.5 hover:border-zona-purple-deep/25 hover:shadow-[0_12px_28px_rgba(74,25,136,0.1)] lg:p-7"
            >
              <span className="font-display text-[13px] font-semibold tracking-[0.03em] text-zona-purple-mid">
                {step.num}
              </span>
              <h3 className="font-display text-[20px] font-semibold leading-tight tracking-[-0.015em] text-zona-navy">
                {step.title}
              </h3>
              <p className="text-[14.5px] leading-relaxed text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/buyers"
            className="inline-flex items-center gap-2 rounded-[10px] bg-zona-purple-deep px-6 py-3 text-[15px] font-semibold text-white shadow-btn transition hover:bg-[#3D1570] hover:shadow-btn-hover"
          >
            Join The Buyers List →
          </Link>
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 rounded-[10px] border-2 border-zona-purple-mid px-6 py-3 text-[15px] font-semibold text-zona-purple-mid transition hover:bg-zona-purple-mid/[0.08]"
          >
            Browse Live Deals
          </Link>
        </div>
      </div>
    </div>
  );
}

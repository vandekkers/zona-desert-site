import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | Zona Desert",
  description: "Simple steps to source, evaluate, and close private-market deals with us."
};

const steps = [
  {
    title: "1. Share Your Buy Box",
    body: "Tell us where and what you buy. We qualify capital, timelines, and strategy so we can source intelligently."
  },
  {
    title: "2. Review Curated Drops",
    body: "You receive data-rich deal packs with photos, underwriting, and creative finance options when available."
  },
  {
    title: "3. Act Fast",
    body: "Submit LOIs directly through Zona Desert. We coordinate access, inspections, and closing."
  }
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-16">
      <div className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-zona-purple">Process</p>
        <h1 className="text-4xl font-semibold text-slate-900">Exactly How Deals Flow Through Zona Desert</h1>
        <p className="text-slate-600">From intake to funding, our ops team keeps the transaction moving. Here&apos;s what to expect.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step.title} className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm">
            <p className="text-sm font-semibold text-zona-purple">{step.title}</p>
            <p className="mt-3 text-sm text-slate-600">{step.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-zona-purple/30 bg-zona-purple/5 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-zona-purple">Next step</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Dial in your buy box so we can go hunting.</h2>
      </div>
    </div>
  );
}

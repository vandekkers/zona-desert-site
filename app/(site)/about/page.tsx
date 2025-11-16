import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Zona Desert",
  description: "Who we are and why institutional and independent buyers trust us for private-market inventory."
};

const values = [
  {
    title: "Sourcing First",
    body: "We invest heavily in boots-on-ground canvassing, direct-to-seller campaigns, and agent referrals."
  },
  {
    title: "Data-Backed Underwriting",
    body: "Each deal is packaged with rent comps, rehab notes, and exit scenarios so you can move quickly."
  },
  {
    title: "Aligned Incentives",
    body: "We only win when investors close great deals. Expect transparency, speed, and clear communication."
  }
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-16">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-zona-purple">About Us</p>
        <h1 className="text-4xl font-semibold text-slate-900">We&apos;re Building The Private-Market Zillow For Serious Operators</h1>
        <p className="text-slate-600">
          Zona Desert pairs a local acquisitions team with tech-enabled underwriting so investors can evaluate creative deals in minutes,
          not weeks.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {values.map((value) => (
          <div key={value.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-zona-purple">{value.title}</p>
            <p className="mt-3 text-slate-600">{value.body}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

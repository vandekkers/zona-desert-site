import Link from "next/link";
import type { Metadata } from "next";
import AgentIntakeForm from "@/components/forms/AgentIntakeForm";

export const metadata: Metadata = {
  title: "Agent Partnerships | Zona Desert",
  description: "Plug your listings into our buyer network for faster dispositions."
};

export default function AgentApplyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-16">
      <div className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-zona-purple">Broker Network</p>
        <h1 className="text-4xl font-semibold text-slate-900">Agents, Let&apos;s Move More Deals</h1>
        <p className="text-slate-600">
          Submit your creative-friendly, on-market, or private-market listings and tap into our ready buyers.
        </p>
        <p className="text-sm text-slate-500">
          Already Have A Listing To Share?{" "}
          <Link href="/sell?sellerType=real-estate-agent" className="text-zona-purple">
            Submit It Here
          </Link>
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <AgentIntakeForm />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import BuyerIntakeForm from "@/components/forms/BuyerIntakeForm";

export const metadata: Metadata = {
  title: "Join The Buyer List | Zona Desert",
  description: "Tell us your buy box and we will send curated off-market deals."
};

export default function BuyerJoinPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-16">
      <div className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-zona-purple">VIP buyer access</p>
        <h1 className="text-4xl font-semibold text-slate-900">Get first look on private deals</h1>
        <p className="text-slate-600">Share your criteria once—our sourcing desk handles the rest.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <BuyerIntakeForm />
      </div>
    </div>
  );
}

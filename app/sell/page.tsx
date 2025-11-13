import type { Metadata } from "next";
import SellerLeadForm from "@/components/forms/SellerLeadForm";

export const metadata: Metadata = {
  title: "Sell Off-Market | Zona Desert",
  description: "Request a quick, discretionary offer from Zona Desert's acquisitions team."
};

export default function SellPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-16">
      <div className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-zona-purple">Sell to zona desert</p>
        <h1 className="text-4xl font-semibold text-slate-900">Tell us about your property</h1>
        <p className="text-slate-600">
          We specialize in discreet, as-is transactions for single-family, small-multifamily, and unique assets.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <SellerLeadForm />
      </div>
    </div>
  );
}

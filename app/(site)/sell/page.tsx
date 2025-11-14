import type { Metadata } from "next";
import SellerLeadForm from "@/components/forms/SellerLeadForm";
import { SellerLeadPayload } from "@/lib/types";

export const metadata: Metadata = {
  title: "Sell To Zona Desert | Investor-Ready Offers",
  description: "Request a creative or cash offer from Zona Desert's acquisitions team."
};

function parseSellerType(value?: string): SellerLeadPayload["sellerType"] | undefined {
  if (value === "real-estate-agent" || value === "wholesaler" || value === "property-owner") {
    return value;
  }
  return undefined;
}

export default function SellPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const sellerTypeOverride = typeof searchParams.sellerType === "string" ? parseSellerType(searchParams.sellerType) : undefined;

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-16">
      <div className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-zona-purple">Sell To Zona Desert</p>
        <h1 className="text-4xl font-semibold text-slate-900">Tell Us About Your Property</h1>
        <p className="text-slate-600">
          We specialize in discreet, investor-ready transactions for single-family, small-multifamily, and specialty assets nationwide.
        </p>
        <a href="/sell/submit" className="text-sm font-semibold text-zona-purple">
          Need A Streamlined Form? Use The Direct Submission →
        </a>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <SellerLeadForm defaultSellerType={sellerTypeOverride} />
      </div>
    </div>
  );
}

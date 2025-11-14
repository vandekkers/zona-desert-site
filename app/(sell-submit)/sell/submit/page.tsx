import type { Metadata } from "next";
import SellerLeadForm from "@/components/forms/SellerLeadForm";

export const metadata: Metadata = {
  title: "Submit Your Property | Zona Desert",
  description: "Fast-track your seller intake with Zona Desert's acquisitions team."
};

export default function SellSubmitPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-16">
      <div className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-zona-purple">Private Submission</p>
        <h1 className="text-4xl font-semibold text-slate-900">Fast Cash And Creative Offers</h1>
        <p className="text-slate-600">
          Provide the essentials—our underwriting team will review and reply with pricing ranges or a call invite.
        </p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SellerLeadForm defaultSellerType="property-owner" />
      </div>
    </div>
  );
}

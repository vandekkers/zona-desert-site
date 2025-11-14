import type { Metadata } from "next";
import WholesalerIntakeForm from "@/components/forms/WholesalerIntakeForm";

export const metadata: Metadata = {
  title: "Wholesaler Program | Zona Desert",
  description: "Plug inventory into our buy box, keep 70% of assignments, and close faster."
};

export default function WholesalerApplyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-16">
      <div className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-zona-purple">Wholesale Partners</p>
        <h1 className="text-4xl font-semibold text-slate-900">Move Deals Faster With Zona Desert</h1>
        <p className="text-slate-600">Assignments split 70/30 in your favor while our vetted buyers compete.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <WholesalerIntakeForm />
      </div>
    </div>
  );
}

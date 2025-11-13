import type { Metadata } from "next";
import WholesalerIntakeForm from "@/components/forms/WholesalerIntakeForm";

export const metadata: Metadata = {
  title: "Wholesaler Program | Zona Desert",
  description: "Plug your inventory into our buy box and dispo engine."
};

export default function WholesalerApplyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-16">
      <div className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-zona-purple">Wholesale partners</p>
        <h1 className="text-4xl font-semibold text-slate-900">Move deals faster with Zona Desert</h1>
        <p className="text-slate-600">Share upcoming assignments and let our vetted buyers compete.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <WholesalerIntakeForm />
      </div>
    </div>
  );
}

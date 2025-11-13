import type { Metadata } from "next";
import AgentIntakeForm from "@/components/forms/AgentIntakeForm";

export const metadata: Metadata = {
  title: "Partner Agents | Zona Desert",
  description: "Work our off-market pipeline with elite investors and dispo pros."
};

export default function AgentApplyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-16">
      <div className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-zona-purple">Broker network</p>
        <h1 className="text-4xl font-semibold text-slate-900">Agents, let&apos;s close more off-market deals</h1>
        <p className="text-slate-600">We share exclusive buyer demand and dispo support for select partners.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <AgentIntakeForm />
      </div>
    </div>
  );
}

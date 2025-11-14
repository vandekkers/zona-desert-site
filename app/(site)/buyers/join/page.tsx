import Link from "next/link";
import type { Metadata } from "next";
import BuyerIntakeForm from "@/components/forms/BuyerIntakeForm";

export const metadata: Metadata = {
  title: "Join Buyers List | Zona Desert",
  description: "Tell us your buy box and get private-market deals delivered to your inbox."
};

export default function BuyerJoinPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-16">
      <p className="text-center text-xs font-semibold text-slate-500">
        Wholesaler?{" "}
        <Link href="/wholesalers/apply" className="text-zona-purple">
          Join Our Wholesaler Partnership Program
        </Link>
      </p>
      <div className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-zona-purple">Private Deal Alerts</p>
        <h1 className="text-4xl font-semibold text-slate-900">Join Buyers List</h1>
        <p className="text-slate-600">
          Get first look on investor-ready deals delivered straight to your inbox.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <BuyerIntakeForm />
      </div>
    </div>
  );
}

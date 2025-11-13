"use client";

import { FormEvent, useState } from "react";
import { submitBuyerIntake } from "@/lib/api";
import { BuyerIntakePayload } from "@/lib/types";
import FormField from "./FormField";
import { getOptionalValue, getValue } from "./formUtils";

export default function BuyerIntakeForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: BuyerIntakePayload = {
      name: getValue(formData, "name"),
      email: getValue(formData, "email"),
      phone: getOptionalValue(formData, "phone"),
      markets: getValue(formData, "markets"),
      priceRange: getValue(formData, "priceRange"),
      strategy: getValue(formData, "strategy"),
      timeline: getValue(formData, "timeline")
    };

    try {
      setStatus("loading");
      await submitBuyerIntake(payload);
      setStatus("success");
      event.currentTarget.reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Name" name="name" required />
        <FormField label="Email" name="email" type="email" required />
        <FormField label="Phone" name="phone" type="tel" />
        <FormField label="Markets of interest" name="markets" placeholder="Phoenix, Tucson..." required />
        <FormField label="Price range" name="priceRange" placeholder="$300k - $1.2M" required />
        <FormField label="Preferred strategies" name="strategy" placeholder="Cash, DSCR, STR" required />
        <FormField label="Timeline" name="timeline" placeholder="Ready now, 30-60 days" required />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-zona-purple px-6 py-3 font-semibold text-white shadow-lg shadow-zona-purple/30 disabled:opacity-60"
      >
        {status === "loading" ? "Submitting..." : "Join The List"}
      </button>

      {status === "success" && <p className="text-sm text-green-600">Welcome aboard! Watch your inbox for deals.</p>}
      {status === "error" && <p className="text-sm text-red-600">Something went wrong. Please try again.</p>}
    </form>
  );
}

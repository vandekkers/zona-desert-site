"use client";

import { FormEvent, useState } from "react";
import { submitWholesalerIntake } from "@/lib/api";
import { WholesalerIntakePayload } from "@/lib/types";
import FormField from "./FormField";
import { getOptionalValue, getValue } from "./formUtils";

export default function WholesalerIntakeForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: WholesalerIntakePayload = {
      name: getValue(formData, "name"),
      email: getValue(formData, "email"),
      phone: getOptionalValue(formData, "phone"),
      company: getOptionalValue(formData, "company"),
      markets: getValue(formData, "markets"),
      dealsPerMonth: getValue(formData, "dealsPerMonth"),
      averageAssignmentFee: getOptionalValue(formData, "averageAssignmentFee"),
      notes: getOptionalValue(formData, "notes")
    };

    try {
      setStatus("loading");
      await submitWholesalerIntake(payload);
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
        <FormField label="Company" name="company" />
        <FormField label="Markets" name="markets" required />
        <FormField label="Average deals/month" name="dealsPerMonth" required />
        <FormField label="Typical assignment fee" name="averageAssignmentFee" />
        <FormField
          label="Notes"
          name="notes"
          multiline
          placeholder="Deal types, dispo needs, etc."
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-zona-purple px-6 py-3 font-semibold text-white shadow-lg shadow-zona-purple/30 disabled:opacity-60"
      >
        {status === "loading" ? "Submitting..." : "Partner With Zona"}
      </button>

      {status === "success" && <p className="text-sm text-green-600">App received – we&apos;ll reply with criteria shortly.</p>}
      {status === "error" && <p className="text-sm text-red-600">Something went wrong. Please try again.</p>}
    </form>
  );
}

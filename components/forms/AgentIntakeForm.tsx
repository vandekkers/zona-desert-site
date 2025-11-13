"use client";

import { FormEvent, useState } from "react";
import { submitAgentIntake } from "@/lib/api";
import { AgentIntakePayload } from "@/lib/types";
import FormField from "./FormField";
import { getOptionalValue, getValue } from "./formUtils";

export default function AgentIntakeForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: AgentIntakePayload = {
      name: getValue(formData, "name"),
      email: getValue(formData, "email"),
      phone: getOptionalValue(formData, "phone"),
      brokerage: getValue(formData, "brokerage"),
      license: getValue(formData, "license"),
      markets: getValue(formData, "markets"),
      partnershipIntent: getValue(formData, "partnershipIntent")
    };

    try {
      setStatus("loading");
      await submitAgentIntake(payload);
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
        <FormField label="Brokerage" name="brokerage" required />
        <FormField label="License #" name="license" required />
        <FormField label="Primary markets" name="markets" required />
        <FormField
          label="How do you want to partner?"
          name="partnershipIntent"
          multiline
          placeholder="Refer buyers, list deals, boots on ground..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-zona-purple px-6 py-3 font-semibold text-white shadow-lg shadow-zona-purple/30 disabled:opacity-60"
      >
        {status === "loading" ? "Submitting..." : "Apply"}
      </button>

      {status === "success" && <p className="text-sm text-green-600">Thanks! Our partnerships team will reach out soon.</p>}
      {status === "error" && <p className="text-sm text-red-600">Something went wrong. Please try again.</p>}
    </form>
  );
}

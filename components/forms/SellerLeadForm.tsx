"use client";

import { FormEvent, useState } from "react";
import { submitSellerLead } from "@/lib/api";
import { SellerLeadPayload } from "@/lib/types";
import FormField from "./FormField";
import { getOptionalValue, getValue } from "./formUtils";

export default function SellerLeadForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: SellerLeadPayload = {
      address: getValue(formData, "address"),
      city: getValue(formData, "city"),
      state: getValue(formData, "state"),
      zip: getValue(formData, "zip"),
      beds: getOptionalValue(formData, "beds"),
      baths: getOptionalValue(formData, "baths"),
      condition: getOptionalValue(formData, "condition"),
      timeline: getOptionalValue(formData, "timeline"),
      name: getValue(formData, "name"),
      email: getValue(formData, "email"),
      phone: getOptionalValue(formData, "phone"),
      heardAbout: getOptionalValue(formData, "heardAbout")
    };

    try {
      setStatus("loading");
      await submitSellerLead(payload);
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
        <FormField label="Property address" name="address" required />
        <FormField label="City" name="city" required />
        <FormField label="State" name="state" required placeholder="AZ" />
        <FormField label="ZIP" name="zip" required />
        <FormField label="Beds" name="beds" />
        <FormField label="Baths" name="baths" />
        <FormField label="Condition" name="condition" placeholder="Turnkey, needs work, etc." />
        <FormField label="Timeline" name="timeline" placeholder="Ready now, 30-60 days" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Your name" name="name" required />
        <FormField label="Email" name="email" type="email" required />
        <FormField label="Phone" name="phone" type="tel" />
        <FormField label="How did you hear about us?" name="heardAbout" />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-zona-purple px-6 py-3 font-semibold text-white shadow-lg shadow-zona-purple/30 disabled:opacity-60"
      >
        {status === "loading" ? "Submitting..." : "Request Your Offer"}
      </button>

      {status === "success" && <p className="text-sm text-green-600">Thanks! Our team will reach out shortly.</p>}
      {status === "error" && <p className="text-sm text-red-600">Something went wrong. Please try again.</p>}
    </form>
  );
}

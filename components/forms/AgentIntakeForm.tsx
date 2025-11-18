"use client";

import { FormEvent, useState } from "react";
import { createPublicAgent, PublicApiError } from "@/lib/publicApi";
import { AgentIntakePayload } from "@/lib/types";
import FormField from "./FormField";
import { getOptionalValue, getValue } from "./formUtils";

const partnershipOptions = [
  "Refer Buyers",
  "Share Creative Leads",
  "Send Listings Before Price Cuts",
  "Boots On Ground",
  "List With Zona"
];

const listingTypeOptions = ["Private-Market", "On-Market", "Creative Finance Friendly", "Pocket Listing"];

export default function AgentIntakeForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPartnerships, setSelectedPartnerships] = useState<string[]>([]);
  const [selectedListingTypes, setSelectedListingTypes] = useState<string[]>([]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: AgentIntakePayload = {
      name: getValue(formData, "name"),
      email: getValue(formData, "email"),
      phone: getValue(formData, "phone"),
      brokerage: getOptionalValue(formData, "brokerage"),
      markets: getValue(formData, "markets"),
      partnershipFocus: selectedPartnerships,
      listingTypes: selectedListingTypes,
      notes: getOptionalValue(formData, "notes")
    };

    try {
      setStatus("loading");
      setErrorMessage(null);
      await createPublicAgent(payload);
      setStatus("success");
      event.currentTarget.reset();
      setSelectedListingTypes([]);
      setSelectedPartnerships([]);
    } catch (error) {
      console.error(error);
      const apiError = error as PublicApiError;
      if (apiError.status === 409) {
        setErrorMessage("Looks like this agent already exists.");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
      setStatus("error");
    }
  }

  function toggleSelection(value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) {
    setter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Name" name="name" required />
        <FormField label="Email" name="email" type="email" required />
        <FormField label="Phone" name="phone" type="tel" required />
        <FormField label="Brokerage" name="brokerage" />
        <FormField label="Primary Markets" name="markets" required />
        <FormField
          label="Additional Notes"
          name="notes"
          multiline
          placeholder="Do you prefer referrals, dispo, creative finance, etc."
        />
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-600">How Do You Want To Partner?</p>
        <div className="flex flex-wrap gap-2">
          {partnershipOptions.map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => toggleSelection(option, setSelectedPartnerships)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                selectedPartnerships.includes(option)
                  ? "border-zona-purple bg-zona-purple text-white"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-600">Listing Types You Can Provide</p>
        <div className="flex flex-wrap gap-2">
          {listingTypeOptions.map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => toggleSelection(type, setSelectedListingTypes)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                selectedListingTypes.includes(type)
                  ? "border-zona-purple bg-zona-purple text-white"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-zona-purple px-6 py-3 font-semibold text-white shadow-lg shadow-zona-purple/30 disabled:opacity-60"
      >
        {status === "loading" ? "Submitting..." : "Apply"}
      </button>

      {status === "success" && <p className="text-sm text-green-600">Thanks! Our partnerships team will reach out soon.</p>}
      {status === "error" && errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
    </form>
  );
}

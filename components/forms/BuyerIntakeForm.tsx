"use client";

import { FormEvent, useState } from "react";
import { submitBuyerIntake } from "@/lib/api";
import { BuyerIntakePayload } from "@/lib/types";
import FormField from "./FormField";
import { getOptionalValue, getValue } from "./formUtils";

const stateOptions = ["AZ", "CA", "NV", "TX", "NM", "CO", "UT", "FL", "GA", "NC", "SC", "TN"];
const strategyOptions = ["Fix & Flip", "Buy & Hold", "BRRRR", "Short-Term", "Mid-Term", "Creative Finance", "Portfolio"];
const budgetOptions = ["", "150000", "250000", "500000", "750000", "1000000", "1500000", "2000000"];
const minReturnOptions = ["", "5%+ Cap Rate", "6%+ Cap Rate", "7%+ Cap Rate", "8%+ Cap Rate", "10%+ Cash-On-Cash"];

export default function BuyerIntakeForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedStates.length) {
      setFormError("Select at least one state of interest.");
      return;
    }
    if (!selectedStrategies.length) {
      setFormError("Select at least one preferred strategy.");
      return;
    }
    const formData = new FormData(event.currentTarget);
    const payload: BuyerIntakePayload = {
      name: getValue(formData, "name"),
      email: getValue(formData, "email"),
      phone: getOptionalValue(formData, "phone"),
      states: selectedStates,
      marketsDetail: getOptionalValue(formData, "marketsDetail"),
      budgetMin: getOptionalValue(formData, "budgetMin"),
      budgetMax: getOptionalValue(formData, "budgetMax"),
      strategies: selectedStrategies,
      minReturn: getOptionalValue(formData, "minReturn"),
      timeline: getValue(formData, "timeline")
    };

    try {
      setStatus("loading");
      setFormError(null);
      await submitBuyerIntake(payload);
      setStatus("success");
      event.currentTarget.reset();
      setSelectedStates([]);
      setSelectedStrategies([]);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  function toggleState(value: string) {
    setSelectedStates((prev) => (prev.includes(value) ? prev.filter((state) => state !== value) : [...prev, value]));
  }

  function toggleStrategy(value: string) {
    setSelectedStrategies((prev) => (prev.includes(value) ? prev.filter((strategy) => strategy !== value) : [...prev, value]));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && <p className="rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-700">{formError}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Name" name="name" required />
        <FormField label="Email" name="email" type="email" required />
        <FormField label="Phone" name="phone" type="tel" />
        <FormField label="Timeline" name="timeline" component="select" defaultValue="" required>
          <option value="">Select Timeline</option>
          <option value="ready-now">Ready Now</option>
          <option value="30-60-days">30-60 Days</option>
          <option value="90-plus-days">90+ Days</option>
        </FormField>
        <FormField label="Markets Or Cities Focus" name="marketsDetail" placeholder="Phoenix, Tampa, Inland Empire" />
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-600">States Of Interest</p>
        <div className="flex flex-wrap gap-2">
          {stateOptions.map((state) => (
            <button
              type="button"
              key={state}
              onClick={() => toggleState(state)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                selectedStates.includes(state)
                  ? "border-zona-purple bg-zona-purple text-white"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Budget Minimum" name="budgetMin" component="select" defaultValue="">
          <option value="">Select Minimum</option>
          {budgetOptions.filter(Boolean).map((value) => (
            <option key={value} value={value}>
              ${Number(value).toLocaleString()}
            </option>
          ))}
        </FormField>
        <FormField label="Budget Maximum" name="budgetMax" component="select" defaultValue="">
          <option value="">Select Maximum</option>
          {budgetOptions.filter(Boolean).map((value) => (
            <option key={value} value={value}>
              ${Number(value).toLocaleString()}
            </option>
          ))}
        </FormField>
        <FormField label="Minimum Cap Rate Or Cash-On-Cash" name="minReturn" component="select" defaultValue="">
          <option value="">Flexible</option>
          {minReturnOptions.filter(Boolean).map((option) => (
            <option key={option} value={option.toLowerCase().replace(/\s+/g, "-")}>
              {option}
            </option>
          ))}
        </FormField>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-600">Preferred Strategies</p>
        <div className="flex flex-wrap gap-2">
          {strategyOptions.map((strategy) => (
            <button
              type="button"
              key={strategy}
              onClick={() => toggleStrategy(strategy)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                selectedStrategies.includes(strategy)
                  ? "border-zona-purple bg-zona-purple text-white"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              {strategy}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-zona-purple px-6 py-3 font-semibold text-white shadow-lg shadow-zona-purple/30 disabled:opacity-60"
      >
        {status === "loading" ? "Submitting..." : "Join Buyers List"}
      </button>

      {status === "success" && <p className="text-sm text-green-600">Welcome aboard! Watch your inbox for deals.</p>}
      {status === "error" && <p className="text-sm text-red-600">Something went wrong. Please try again.</p>}
    </form>
  );
}

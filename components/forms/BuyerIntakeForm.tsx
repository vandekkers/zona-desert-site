"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { COUNTIES_BY_STATE, US_STATES } from "@/data/counties-by-state";
import { BuyerIntakePayload } from "@/lib/types";
import { PublicApiError, createPublicBuyer } from "@/lib/publicApi";
import FormField from "./FormField";
import MultiSelect from "./MultiSelect";
import { getOptionalValue, getValue } from "./formUtils";

const strategyOptions = [
  "Any",
  "Fix & Flip",
  "Buy & Hold",
  "BRRRR",
  "Short-Term",
  "Mid-Term",
  "Creative Finance",
  "Multifamily",
  "Portfolio",
  "Land"
];

const budgetOptions = ["50000", "100000", "150000", "250000", "500000", "750000", "1000000", "1500000", "2000000+"];

const minReturnOptions = [
  { value: "", label: "Flexible" },
  { value: "5-plus-cap-rate", label: "5%+ Cap Rate" },
  { value: "6-plus-cap-rate", label: "6%+ Cap Rate" },
  { value: "7-plus-cap-rate", label: "7%+ Cap Rate" },
  { value: "8-plus-cap-rate", label: "8%+ Cap Rate" },
  { value: "10-plus-cash-on-cash", label: "10%+ Cash-On-Cash" }
];

const timelineOptions = [
  { value: "ready-now", label: "Ready Now" },
  { value: "30-60-days", label: "30-60 Days" },
  { value: "90-plus-days", label: "90+ Days" }
];

export default function BuyerIntakeForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [countiesByState, setCountiesByState] = useState<Record<string, string[]>>({});
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

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
    const normalizedCounties = selectedStates.reduce<Record<string, string[]>>((acc, state) => {
      const selections = countiesByState[state];
      if (!selections || !selections.length) {
        acc[state] = ["All Counties"];
      } else {
        acc[state] = selections;
      }
      return acc;
    }, {});
    const primaryState = selectedStates[0]!;
    const primaryCountyList = normalizedCounties[primaryState] || ["All Counties"];
    const primaryCounty = primaryCountyList.includes("All Counties") ? "All Counties" : primaryCountyList[0];
    const payload: BuyerIntakePayload = {
      name: getValue(formData, "name"),
      email: getValue(formData, "email"),
      phone: getValue(formData, "phone"),
      state: primaryState,
      county: primaryCounty,
      states: selectedStates,
      countiesByState: normalizedCounties,
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
      setSuccessMessage(null);
      console.log("Submitting buyer payload", payload);
      const result = await createPublicBuyer(payload);
      console.log("Buyer created", result);
      setSuccessMessage("You Are Now On The Buyers List. New Deals Will Be Emailed To You As They Match Your Criteria.");
      setStatus("success");
      try {
        formRef.current?.reset();
      } catch (e) {
        console.warn("Form reset skipped:", e);
      }
      setSelectedStates([]);
      setCountiesByState({});
      setSelectedStrategies([]);
    } catch (error) {
      console.error(error);
      const statusCode =
        error instanceof PublicApiError
          ? error.status
          : (error as { status?: number; response?: { status?: number } })?.status ??
            (error as { response?: { status?: number } })?.response?.status;

      if (statusCode === 409) {
        setStatus("success");
        setFormError(null);
        setSuccessMessage(
          "You Are Already On The Buyers List. We Will Keep Sending Deals To This Email As They Match Your Criteria."
        );
      } else {
        setStatus("error");
        setSuccessMessage(null);
        setFormError("Something Went Wrong. Please Try Again.");
      }
    }
  }

  function toggleStrategy(value: string) {
    setSelectedStrategies((prev) => {
      if (value === "Any") {
        return prev.includes("Any") ? [] : ["Any"];
      }
      const withoutAny = prev.filter((strategy) => strategy !== "Any");
      if (withoutAny.includes(value)) {
        return withoutAny.filter((strategy) => strategy !== value);
      }
      return [...withoutAny, value];
    });
  }

  function handleStateSelection(values: string[]) {
    setSelectedStates(values);
    setCountiesByState((current) => {
      const next: Record<string, string[]> = {};
      values.forEach((state) => {
        next[state] = current[state] ?? [];
      });
      return next;
    });
  }

  function handleCountySelection(values: string[]) {
    const grouped = values.reduce<Record<string, string[]>>((acc, value) => {
      const [state, countyIdentifier] = value.split("::");
      if (!state) return acc;
      if (countyIdentifier === "ALL") {
        acc[state] = ["All Counties"];
        return acc;
      }
      if (acc[state]?.includes("All Counties")) {
        return acc;
      }
      acc[state] = acc[state] ? [...acc[state], countyIdentifier] : [countyIdentifier];
      return acc;
    }, {});

    setCountiesByState(() => {
      const next: Record<string, string[]> = {};
      selectedStates.forEach((state) => {
        const selections = grouped[state];
        if (!selections) {
          next[state] = [];
          return;
        }
        if (selections.includes("All Counties")) {
          next[state] = ["All Counties"];
        } else {
          next[state] = selections;
        }
      });
      return next;
    });
  }

  const countyOptions = useMemo(() => {
    return selectedStates.flatMap((state) => {
      const counties = COUNTIES_BY_STATE[state] ?? [];
      return [
        { value: `${state}::ALL`, label: `${state} • All Counties` },
        ...counties.map((county) => ({ value: `${state}::${county}`, label: `${state} • ${county}` }))
      ];
    });
  }, [selectedStates]);

  const countySelection = useMemo(() => {
    return selectedStates.flatMap((state) => {
      const counties = countiesByState[state];
      if (!counties || !counties.length) {
        return [];
      }
      if (counties.includes("All Counties")) {
        return [`${state}::ALL`];
      }
      return counties.map((county) => `${state}::${county}`);
    });
  }, [countiesByState, selectedStates]);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <p className="rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{successMessage}</p>
      )}
      {!successMessage && formError && (
        <p className="rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-700">{formError}</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Name" name="name" required />
        <FormField label="Email" name="email" type="email" required />
        <FormField label="Phone" name="phone" type="tel" required />
        <FormField label="Timeline" name="timeline" component="select" defaultValue="" required>
          <option value="">Select Timeline</option>
          {timelineOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FormField>
        <FormField label="Markets Or Cities Focus" name="marketsDetail" placeholder="Phoenix, Tampa, Inland Empire" />
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-600">Geography</p>
        <div className="grid gap-4 md:grid-cols-2">
          <MultiSelect
            label="States Of Interest"
            placeholder="Select states"
            options={US_STATES.map((state) => ({ value: state.code, label: state.name }))}
            value={selectedStates}
            onChange={handleStateSelection}
            helperText="Search and select every state where you want to buy."
            required
          />
          <MultiSelect
            label="Counties Of Interest"
            placeholder={selectedStates.length ? "Select counties" : "Select states first"}
            options={countyOptions}
            value={countySelection}
            onChange={handleCountySelection}
            helperText="Select “All Counties” to cover an entire state."
            disabled={!selectedStates.length}
            emptyText={selectedStates.length ? "No counties match your search." : "Pick states first."}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Budget Minimum" name="budgetMin" component="select" defaultValue="">
          <option value="">Select Minimum</option>
          {budgetOptions.map((value) => (
            <option key={value} value={value}>
              {value === "2000000+" ? "$2,000,000+" : `$${Number(value).toLocaleString()}`}
            </option>
          ))}
        </FormField>
        <FormField label="Budget Maximum" name="budgetMax" component="select" defaultValue="">
          <option value="">Select Maximum</option>
          {budgetOptions.map((value) => (
            <option key={value} value={value}>
              {value === "2000000+" ? "$2,000,000+" : `$${Number(value).toLocaleString()}`}
            </option>
          ))}
        </FormField>
        <FormField label="Minimum Cap Rate Or Cash-On-Cash" name="minReturn" component="select" defaultValue="">
          {minReturnOptions.map((option) => (
            <option key={option.value || option.label} value={option.value}>
              {option.label}
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

      <div className="space-y-2 text-xs text-slate-500">
        <p>
          <span className="font-semibold">By submitting</span>, you agree to the{" "}
          <a href="/terms" className="text-zona-purple underline underline-offset-2">Terms and Conditions</a> and{" "}
          <a href="/privacy" className="text-zona-purple underline underline-offset-2">Privacy Notice</a>, and consent to receive marketing communications, including property alerts, via text message, phone call, and email from Zona Desert Property Solutions LLC. Message and data rates may apply. Reply STOP to opt out.
        </p>
        <p className="text-slate-400">
          Listings, pricing, and estimates are informational and may change at any time. You are responsible for independent due diligence. Nothing provided constitutes legal, tax, or financial advice.
        </p>
      </div>

      {status === "success" && successMessage && (
        <p className="text-sm text-green-600">{successMessage}</p>
      )}
      {status === "error" && formError && <p className="text-sm text-red-600">{formError}</p>}
    </form>
  );
}

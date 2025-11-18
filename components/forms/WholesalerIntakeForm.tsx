"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { createPublicWholesaler } from "@/lib/publicApi";
import { WholesalerIntakePayload } from "@/lib/types";
import { COUNTIES_BY_STATE, US_STATES } from "@/data/counties-by-state";
import FormField from "./FormField";
import { getOptionalValue, getValue } from "./formUtils";
import MultiSelect from "./MultiSelect";

const wholesalerTypes = [
  { label: "Dispo", value: "dispo" },
  { label: "Acquisitions", value: "acquisitions" },
  { label: "Both", value: "both" }
];

export default function WholesalerIntakeForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [countiesByState, setCountiesByState] = useState<Record<string, string[]>>({});
  const [wholesalerType, setWholesalerType] = useState("dispo");
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget; // capture before async
    const formData = new FormData(form);
    if (!selectedStates.length) {
      setFormError("Select at least one state you cover.");
      return;
    }
    setFormError(null);
    const normalizedCounties = selectedStates.reduce<Record<string, string[]>>((acc, state) => {
      const selections = countiesByState[state];
      if (!selections || !selections.length) {
        acc[state] = ["All Counties"];
      } else {
        acc[state] = selections;
      }
      return acc;
    }, {});
    const payload: WholesalerIntakePayload = {
      name: getValue(formData, "name"),
      email: getValue(formData, "email"),
      phone: getOptionalValue(formData, "phone"),
      company: getOptionalValue(formData, "company"),
      wholesalerType,
      states: selectedStates,
      countiesByState: normalizedCounties,
      dealsPerMonth: getOptionalValue(formData, "dealsPerMonth"),
      notes: getOptionalValue(formData, "notes")
    };

    try {
      setStatus("loading");
      setStatusMessage(null);
      await createPublicWholesaler(payload);
      setStatus("success");
      setStatusMessage("Welcome to the team! We’ve got your info. Questions? Email info@zonadesert.com.");
      form.reset();
      setSelectedStates([]);
      setCountiesByState({});
      setWholesalerType("dispo");
      setShowModal(true);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setStatusMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Name" name="name" required />
          <FormField label="Email" name="email" type="email" required />
          <FormField label="Phone" name="phone" type="tel" required />
          <FormField label="Company" name="company" />
          <FormField label="Deals Per Month" name="dealsPerMonth" />
          <FormField
            label="Notes"
            name="notes"
            multiline
            placeholder="Deal types, hedge fund access, dispo needs, etc."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label="Wholesaler Type"
            name="wholesalerType"
            component="select"
            value={wholesalerType}
            onChange={(event) => setWholesalerType(event.target.value)}
            required
          >
            {wholesalerTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <MultiSelect
            label="States You Cover"
            placeholder="Select states"
            options={US_STATES.map((state) => ({ value: state.code, label: state.name }))}
            value={selectedStates}
            onChange={handleStateSelection}
            helperText="Search and select every state where you actively wholesale."
            required
          />
          <MultiSelect
            label="Counties"
            placeholder={selectedStates.length ? "Select counties" : "Select states first"}
            options={countyOptions}
            value={countySelection}
            onChange={handleCountySelection}
            helperText="Select “All Counties” to cover an entire state."
            disabled={!selectedStates.length}
            emptyText={selectedStates.length ? "No counties match your search." : "Pick one or more states first."}
          />
        </div>
        {formError && (
          <p className="rounded-2xl bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">{formError}</p>
        )}

        <p className="text-sm font-semibold text-slate-600">
          Assignments split 70/30 in your favor. Zona handles dispo, buyers, and closing logistics.
        </p>

        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-zona-purple px-6 py-3 font-semibold text-white shadow-lg shadow-zona-purple/30 disabled:opacity-60"
        >
          {status === "loading" ? "Submitting..." : "Partner With Zona"}
        </button>

        {statusMessage && (
          <p className={`text-sm ${status === "success" ? "text-green-600" : "text-red-600"}`}>{statusMessage}</p>
        )}
      </form>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-xl">
            <h3 className="text-2xl font-semibold text-slate-900">Do You Have A Deal Ready Now?</h3>
            <p className="mt-3 text-sm text-slate-600">
              If you have an assignment teed up, submit it now or jump back to the marketplace.
            </p>
            <div className="mt-6 space-y-3">
              <Link
                href="/sell?sellerType=wholesaler"
                className="block rounded-full bg-zona-purple px-4 py-2 text-sm font-semibold text-white"
              >
                Submit A Property
              </Link>
              <Link
                href="/"
                className="block rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Back To Home
              </Link>
            </div>
            <button onClick={() => setShowModal(false)} className="mt-4 text-sm font-semibold text-zona-purple">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

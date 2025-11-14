"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { submitWholesalerIntake } from "@/lib/api";
import { WholesalerIntakePayload } from "@/lib/types";
import FormField from "./FormField";
import { getOptionalValue, getValue } from "./formUtils";

const wholesalerTypes = [
  { label: "Dispo", value: "dispo" },
  { label: "Acquisitions", value: "acquisitions" },
  { label: "Both", value: "both" }
];

const marketConfig: Record<string, string[]> = {
  AZ: ["Maricopa", "Pima", "Pinal"],
  NV: ["Clark", "Washoe"],
  TX: ["Dallas", "Tarrant", "Travis", "Bexar", "Harris"],
  FL: ["Orange", "Hillsborough", "Duval", "Broward", "Miami-Dade"],
  GA: ["Fulton", "Gwinnett", "Cobb"],
  NC: ["Mecklenburg", "Wake", "Durham"]
};

export default function WholesalerIntakeForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [countiesByState, setCountiesByState] = useState<Record<string, string[]>>({});
  const [wholesalerType, setWholesalerType] = useState("dispo");
  const [showModal, setShowModal] = useState(false);

  function toggleState(state: string) {
    setSelectedStates((prev) => {
      if (prev.includes(state)) {
        const updated = prev.filter((item) => item !== state);
        setCountiesByState((current) => {
          const next = { ...current };
          delete next[state];
          return next;
        });
        return updated;
      }
      setCountiesByState((current) => ({ ...current, [state]: ["All Counties"] }));
      return [...prev, state];
    });
  }

  function handleCountyChange(state: string, values: string[]) {
    if (values.includes("All Counties")) {
      setCountiesByState((prev) => ({ ...prev, [state]: ["All Counties"] }));
      return;
    }
    setCountiesByState((prev) => ({ ...prev, [state]: values }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: WholesalerIntakePayload = {
      name: getValue(formData, "name"),
      email: getValue(formData, "email"),
      phone: getOptionalValue(formData, "phone"),
      company: getOptionalValue(formData, "company"),
      wholesalerType,
      states: selectedStates,
      countiesByState,
      dealsPerMonth: getValue(formData, "dealsPerMonth"),
      averageAssignmentFee: getOptionalValue(formData, "averageAssignmentFee"),
      notes: getOptionalValue(formData, "notes")
    };

    try {
      setStatus("loading");
      await submitWholesalerIntake(payload);
      setStatus("success");
      event.currentTarget.reset();
      setSelectedStates([]);
      setCountiesByState({});
      setWholesalerType("dispo");
      setShowModal(true);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Name" name="name" required />
          <FormField label="Email" name="email" type="email" required />
          <FormField label="Phone" name="phone" type="tel" />
          <FormField label="Company" name="company" />
          <FormField label="Deals Per Month" name="dealsPerMonth" required />
          <FormField label="Typical Assignment Fee" name="averageAssignmentFee" />
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
          >
            {wholesalerTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </FormField>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-600">States You Cover</p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(marketConfig).map((state) => (
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

        {selectedStates.length > 0 && (
          <div className="space-y-4">
            {selectedStates.map((state) => (
              <div key={state}>
                <p className="text-xs font-semibold text-slate-600">Counties In {state}</p>
                <select
                  multiple
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 focus:border-zona-purple focus:outline-none"
                  value={countiesByState[state] || []}
                  onChange={(event) =>
                    handleCountyChange(
                      state,
                      Array.from(event.target.selectedOptions).map((option) => option.value)
                    )
                  }
                >
                  <option value="All Counties">All Counties</option>
                  {marketConfig[state].map((county) => (
                    <option key={county} value={county}>
                      {county}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-slate-500">Hold Cmd/Ctrl to select multiple counties.</p>
              </div>
            ))}
          </div>
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

        {status === "error" && <p className="text-sm text-red-600">Something went wrong. Please try again.</p>}
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

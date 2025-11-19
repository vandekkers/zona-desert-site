"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { createPublicSeller } from "@/lib/publicApi";
import { SellerLeadPayload } from "@/lib/types";
import FormField from "./FormField";
import { getOptionalValue, getValue } from "./formUtils";
import { checkExistingAgent, checkExistingWholesaler } from "@/lib/placeholders";

const propertyTypes = ["Single Family", "Small Multifamily", "Large Multifamily", "Townhome", "Land", "Portfolio", "Other"];
const conditionOptions = ["Turnkey", "Light Updates", "Heavy Rehab", "Fire/Structural"];
const timelineOptions = ["Ready Now", "30 Days", "60-90 Days", "Flexible"];
const financingOptions = ["Free And Clear", "Mortgage In Place", "Creative Finance Friendly", "Behind On Payments", "Other"];
const sellerTypes: SellerLeadPayload["sellerType"][] = ["property-owner", "real-estate-agent", "wholesaler", "other"];

interface SellerLeadFormProps {
  defaultSellerType?: SellerLeadPayload["sellerType"];
}

export default function SellerLeadForm({ defaultSellerType = "property-owner" }: SellerLeadFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [selectedSellerType, setSelectedSellerType] =
    useState<SellerLeadPayload["sellerType"]>(defaultSellerType);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [modalType, setModalType] = useState<SellerLeadPayload["sellerType"] | null>(null);

  useEffect(() => {
    setSelectedSellerType(defaultSellerType);
  }, [defaultSellerType]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget; // capture before any async work to avoid pooled event nulls
    const formData = new FormData(form);
    const payload: SellerLeadPayload = {
      address: getValue(formData, "address"),
      city: getValue(formData, "city"),
      state: getValue(formData, "state"),
      zip: getValue(formData, "zip"),
      propertyType: getValue(formData, "propertyType"),
      beds: getValue(formData, "beds"),
      baths: getValue(formData, "baths"),
      sqft: getValue(formData, "sqft"),
      condition: getValue(formData, "condition"),
      timeline: getValue(formData, "timeline"),
      financingSituation: getValue(formData, "financingSituation"),
      sellerType: (formData.get("sellerType") as SellerLeadPayload["sellerType"]) || selectedSellerType,
      name: getValue(formData, "name"),
      email: getValue(formData, "email"),
      phone: getValue(formData, "phone"),
      heardAbout: getOptionalValue(formData, "heardAbout"),
      notes: getOptionalValue(formData, "notes")
    };

    try {
      setStatus("loading");
      setDuplicateWarning(null);
      const sellerType = payload.sellerType;
      if (sellerType === "real-estate-agent") {
        const exists = await checkExistingAgent(payload.email, payload.phone);
        if (exists) {
          setStatus("idle");
          setDuplicateWarning("Looks Like You’re Already Registered. We’ve Got Your Info On File.");
          return;
        }
      }
      if (sellerType === "wholesaler") {
        const exists = await checkExistingWholesaler(payload.email, payload.phone);
        if (exists) {
          setStatus("idle");
          setDuplicateWarning("Looks Like You’re Already Registered. We’ve Got Your Info On File.");
          return;
        }
      }
      await createPublicSeller(payload);
      setStatus("success");
      form.reset();
      setModalType(sellerType);
      setSelectedSellerType(defaultSellerType);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {duplicateWarning && <p className="rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-700">{duplicateWarning}</p>}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Property Address" name="address" required />
          <FormField label="City" name="city" required />
          <FormField label="State" name="state" required placeholder="AZ" />
          <FormField label="ZIP" name="zip" required />
          <FormField label="Property Type" name="propertyType" component="select" defaultValue="" required>
            <option value="">Select Type</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type.toLowerCase().replace(/\s+/g, "-")}>
                {type}
              </option>
            ))}
          </FormField>
          <FormField label="Beds" name="beds" required />
          <FormField label="Baths" name="baths" required />
          <FormField label="Sqft" name="sqft" required />
          <FormField label="Condition" name="condition" component="select" defaultValue="" required>
            <option value="">Select Condition</option>
            {conditionOptions.map((option) => (
              <option key={option} value={option.toLowerCase().replace(/\s+/g, "-")}>
                {option}
              </option>
            ))}
          </FormField>
          <FormField label="Timeline" name="timeline" component="select" defaultValue="" required>
            <option value="">Select Timeline</option>
            {timelineOptions.map((option) => (
              <option key={option} value={option.toLowerCase().replace(/\s+/g, "-")}>
                {option}
              </option>
            ))}
          </FormField>
          <FormField label="Financing Situation" name="financingSituation" component="select" defaultValue="" required>
            <option value="">Select Situation</option>
            {financingOptions.map((option) => (
              <option key={option} value={option.toLowerCase().replace(/\s+/g, "-")}>
                {option}
              </option>
            ))}
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Your Name" name="name" required />
          <FormField label="Email" name="email" type="email" required />
          <FormField label="Phone" name="phone" type="tel" required />
          <FormField label="Seller Type" name="sellerType" component="select" required value={selectedSellerType} onChange={(event) => setSelectedSellerType(event.target.value as SellerLeadPayload["sellerType"])}>
            {sellerTypes.map((type) => (
              <option key={type} value={type}>
                {type === "property-owner"
                  ? "Property Owner"
                  : type === "real-estate-agent"
                  ? "Real Estate Agent"
                  : type === "wholesaler"
                  ? "Wholesaler"
                  : "Other"}
              </option>
            ))}
          </FormField>
          <FormField label="How Did You Hear About Us?" name="heardAbout" />
          <FormField label="Notes" name="notes" component="textarea" placeholder="Anything else we should know?" />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-zona-purple px-6 py-3 font-semibold text-white shadow-lg shadow-zona-purple/30 disabled:opacity-60"
        >
          {status === "loading" ? "Submitting..." : "Request Your Offer"}
        </button>

        {status === "error" && <p className="text-sm text-red-600">Something went wrong. Please try again.</p>}
      </form>

      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-xl">
            <h3 className="text-2xl font-semibold text-slate-900">Thanks For Submitting</h3>
            {modalType === "property-owner" && (
              <p className="mt-3 text-sm text-slate-600">
                We’re reviewing your submission. Expect an offer in the next 12-24 hours.
              </p>
            )}
            {modalType === "wholesaler" && (
              <>
                <p className="mt-3 text-sm text-slate-600">
                  We’re reviewing your submission. Expect an offer in the next 12-24 hours.
                </p>
                <Link
                  href="/wholesalers/apply"
                  className="mt-4 inline-flex w-full justify-center rounded-full bg-zona-purple px-4 py-2 text-sm font-semibold text-white"
                >
                  Join the Wholesaler Relations Program
                </Link>
              </>
            )}
            {modalType === "real-estate-agent" && (
              <>
                <p className="mt-3 text-sm text-slate-600">
                  We’re reviewing your submission. Expect an offer in the next 12-24 hours.
                </p>
                <Link
                  href="/agents/apply"
                  className="mt-4 inline-flex w-full justify-center rounded-full bg-zona-purple px-4 py-2 text-sm font-semibold text-white"
                >
                  Join the Agent Partnership Program
                </Link>
              </>
            )}
            {modalType === "other" && (
              <p className="mt-3 text-sm text-slate-600">
                We’re reviewing your submission. Expect an offer in the next 12-24 hours.
              </p>
            )}
            <button
              onClick={() => {
                setModalType(null);
                setStatus("idle");
              }}
              className="mt-4 text-sm font-semibold text-zona-purple"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

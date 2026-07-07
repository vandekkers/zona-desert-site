// SITE V2 — seller intake page. Same fields the platform form captured,
// delivered zero-backend through the unified IntakeForm.

import type { Metadata } from "next";
import { IntakeForm, type IntakeConfig } from "../_components/IntakeForm";
import { PageIntro } from "../_components/PageIntro";
import { getDealsConfig } from "../_lib/deals";

export const metadata: Metadata = {
  title: "Sell Your Property | Zona Desert",
  description:
    "Get a real cash offer in 24 hours. Any condition, any situation — no obligation, no credit pull, no public listing."
};

const CONFIG: IntakeConfig = {
  formType: "sell",
  title: "Get My Cash Offer",
  subjectPrefix: "Seller lead",
  subjectField: "address",
  fields: [
    { kind: "text", name: "address", label: "Property Address", required: true, placeholder: "Street address" },
    { kind: "text", name: "city", label: "City", required: true, half: true },
    { kind: "text", name: "state", label: "State", required: true, half: true },
    { kind: "text", name: "zip", label: "ZIP", required: true, half: true },
    {
      kind: "select",
      name: "propertyType",
      label: "Property Type",
      half: true,
      options: ["Single Family", "Small Multifamily", "Large Multifamily", "Townhome", "Land", "Portfolio", "Other"]
    },
    { kind: "text", name: "beds", label: "Beds", half: true, placeholder: "3" },
    { kind: "text", name: "baths", label: "Baths", half: true, placeholder: "2" },
    { kind: "text", name: "sqft", label: "Square Feet", half: true, placeholder: "1,400" },
    {
      kind: "select",
      name: "timeline",
      label: "Timeline",
      half: true,
      options: ["Ready Now", "30 Days", "60-90 Days", "Flexible"]
    },
    {
      kind: "segmented",
      name: "condition",
      label: "Condition",
      options: ["Turnkey", "Light Updates", "Heavy Rehab", "Fire/Structural"]
    },
    {
      kind: "select",
      name: "financingSituation",
      label: "Financing Situation",
      options: ["Free And Clear", "Mortgage In Place", "Creative Finance Friendly", "Behind On Payments", "Other"]
    },
    { kind: "text", name: "name", label: "Your Name", required: true, half: true },
    { kind: "tel", name: "phone", label: "Phone", required: true, half: true },
    { kind: "email", name: "email", label: "Email", required: true },
    { kind: "textarea", name: "notes", label: "Anything We Should Know?", placeholder: "Tenants, repairs, timeline constraints…" }
  ]
};

export default function SellPage() {
  const contact = getDealsConfig();
  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-14 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div>
          <PageIntro
            eyebrow="For Sellers"
            title="A Real Cash Offer In 24 Hours."
            lede="Tell us about the property once. A person — not an algorithm — reviews it, runs the numbers, and comes back with a real offer. No obligation, no credit pull, and we never list your property publicly."
          />
          <ul className="mt-8 space-y-3 text-[15px] text-zona-navy">
            {[
              ["Any condition", "Turnkey to fire-damaged — we buy on the numbers, not the paint."],
              ["Any situation", "Inherited, tenant-occupied, behind on payments, or mid-divorce. We structure around it."],
              ["Your timeline", "Fast closings available, or take the time you need. You pick the date."]
            ].map(([title, body]) => (
              <li key={title} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-green-800/10 text-green-800">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>
                  <b className="font-semibold">{title}.</b> {body}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[14px] text-slate-500">
            Prefer to talk it through first? Call or text{" "}
            <a href={`tel:${contact.phone}`} className="font-semibold text-zona-purple-mid">
              {contact.phone.replace("+1", "(").replace(/(\d{3})(\d{3})(\d{4})/, "$1) $2-$3")}
            </a>
            .
          </p>
        </div>
        <IntakeForm config={CONFIG} contact={contact} />
      </div>
    </div>
  );
}

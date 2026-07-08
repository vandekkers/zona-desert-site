// SITE V2 — wholesaler partnership intake.

import type { Metadata } from "next";
import { IntakeForm, type IntakeConfig } from "../_components/IntakeForm";
import { PageIntro } from "../_components/PageIntro";
import { getDealsConfig } from "../_lib/deals";

export const metadata: Metadata = {
  title: "For Wholesalers | Zona Desert",
  description:
    "JV with Zona Desert — bring contracts to a vetted buyer network, or source dispo-ready inventory from our pipeline."
};

const CONFIG: IntakeConfig = {
  formType: "wholesaler",
  title: "Apply To JV",
  subjectPrefix: "Wholesaler application",
  subjectField: "name",
  fields: [
    { kind: "text", name: "name", label: "Name", required: true, half: true },
    { kind: "tel", name: "phone", label: "Phone", required: true, half: true },
    { kind: "email", name: "email", label: "Email", required: true, half: true },
    { kind: "text", name: "company", label: "Company", half: true },
    {
      kind: "segmented",
      name: "wholesalerType",
      label: "What You Do",
      required: true,
      options: ["Dispo", "Acquisitions", "Both"]
    },
    { kind: "text", name: "dealsPerMonth", label: "Deals Per Month", half: true, placeholder: "2-3" },
    { kind: "text", name: "states", label: "States You Cover", half: true, placeholder: "MI, OH, AZ" },
    { kind: "textarea", name: "notes", label: "Notes", placeholder: "Typical assignment size, buyer needs, current inventory…" }
  ]
};

export default function WholesalersPage() {
  const contact = getDealsConfig();
  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-14 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div>
          <PageIntro
            eyebrow="For Wholesalers"
            title="Bring The Contract. We Bring The Buyers."
            lede="Straight splits, honest numbers, buyers that close."
          />
          <ul className="mt-8 space-y-3 text-[15px] text-zona-navy">
            {[
              ["Clean splits", "Terms in writing before anything moves."],
              ["Real buyers", "Vetted investors who close and don't retrade."],
              ["Speed", "Yes or no within a day."]
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
        </div>
        <IntakeForm config={CONFIG} contact={contact} />
      </div>
    </div>
  );
}

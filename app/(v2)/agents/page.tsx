// SITE V2 — agent partnership intake.

import type { Metadata } from "next";
import { IntakeForm, type IntakeConfig } from "../_components/IntakeForm";
import { PageIntro } from "../_components/PageIntro";
import { getDealsConfig } from "../_lib/deals";

export const metadata: Metadata = {
  title: "For Agents | Zona Desert",
  description:
    "Partner with Zona Desert — refer buyers, share creative-finance leads, and monetize listings before price cuts."
};

const CONFIG: IntakeConfig = {
  formType: "agent",
  title: "Apply To Partner",
  subjectPrefix: "Agent application",
  subjectField: "name",
  fields: [
    { kind: "text", name: "name", label: "Name", required: true, half: true },
    { kind: "tel", name: "phone", label: "Phone", required: true, half: true },
    { kind: "email", name: "email", label: "Email", required: true, half: true },
    { kind: "text", name: "brokerage", label: "Brokerage", half: true },
    { kind: "text", name: "markets", label: "Primary Markets", required: true, placeholder: "Detroit Metro, Oakland County…" },
    {
      kind: "chips",
      name: "partnership",
      label: "How Do You Want To Work Together?",
      options: ["Refer Buyers", "Share Creative Leads", "Send Listings Before Price Cuts", "Boots On Ground", "List With Zona"]
    },
    {
      kind: "chips",
      name: "listingTypes",
      label: "Listing Types You Touch",
      options: ["Private-Market", "On-Market", "Creative Finance Friendly", "Pocket Listing"]
    },
    { kind: "textarea", name: "notes", label: "Additional Notes" }
  ]
};

export default function AgentsPage() {
  const contact = getDealsConfig();
  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-14 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div>
          <PageIntro
            eyebrow="For Agents"
            title="Your Hardest Listings Are Our Favorite Deals."
            lede="The listings that don't fit retail fit us. Monetize the deals you'd walk away from."
          />
          <ul className="mt-8 space-y-3 text-[15px] text-zona-navy">
            {[
              ["Keep your commission", "Referral structures that respect your role."],
              ["Fast answers", "Underwritten in a day, answered straight."],
              ["Protect your seller", "Off-market exit, no price-cut spiral."]
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

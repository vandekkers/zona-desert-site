// SITE V2 — investor / buyers-list intake. Same criteria the platform
// form captured, delivered zero-backend.

import type { Metadata } from "next";
import Link from "next/link";
import { IntakeForm, type IntakeConfig } from "../_components/IntakeForm";
import { PageIntro } from "../_components/PageIntro";
import { getDeals, getDealsConfig } from "../_lib/deals";

export const metadata: Metadata = {
  title: "For Buyers | Zona Desert",
  description:
    "Join the buyers list. Vetted deals — most off-market — with the underwriting already on the page: cap rate, NOI, rehab, comps, and terms."
};

const CONFIG: IntakeConfig = {
  formType: "buyer",
  title: "Join The Buyers List",
  subjectPrefix: "Buyer application",
  subjectField: "name",
  fields: [
    { kind: "text", name: "name", label: "Name", required: true, half: true },
    { kind: "tel", name: "phone", label: "Phone", required: true, half: true },
    { kind: "email", name: "email", label: "Email", required: true },
    {
      kind: "select",
      name: "timeline",
      label: "Buying Timeline",
      required: true,
      half: true,
      options: ["Ready Now", "30-60 Days", "90+ Days"]
    },
    {
      kind: "select",
      name: "minReturn",
      label: "Minimum Return",
      half: true,
      options: ["Flexible", "5%+ Cap Rate", "6%+ Cap Rate", "7%+ Cap Rate", "8%+ Cap Rate", "10%+ Cash-On-Cash"]
    },
    {
      kind: "chips",
      name: "strategies",
      label: "Strategies",
      options: ["Fix & Flip", "Buy & Hold", "BRRRR", "Section 8", "Short-Term", "Creative Finance", "Multifamily", "Land"]
    },
    { kind: "text", name: "markets", label: "Markets Or Cities", placeholder: "Detroit, Phoenix, Cleveland…" },
    {
      kind: "select",
      name: "budgetMin",
      label: "Budget Minimum",
      half: true,
      options: ["$50k", "$100k", "$150k", "$250k", "$500k", "$750k", "$1M+"]
    },
    {
      kind: "select",
      name: "budgetMax",
      label: "Budget Maximum",
      half: true,
      options: ["$100k", "$150k", "$250k", "$500k", "$750k", "$1M", "$2M+"]
    },
    { kind: "textarea", name: "notes", label: "Buy Box Notes", placeholder: "Anything specific — bed counts, zips, condition tolerance…" }
  ]
};

export default function BuyersPage() {
  const contact = getDealsConfig();
  const live = getDeals().filter((deal) => deal.status === "available").length;

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-14 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div>
          <PageIntro
            eyebrow="For Buyers"
            title="Deals With The Numbers Already Run."
            lede="Every listing on the board carries full underwriting — cap rate, NOI waterfall, rehab budget, spread, sold comps, and deal terms. Join the list and get first look before deals go wide."
          />
          <ul className="mt-8 space-y-3 text-[15px] text-zona-navy">
            {[
              ["First look", "List members hear about inventory before anyone else."],
              ["No mystery math", "Assumptions labeled on every metric. Verify everything — we make it easy."],
              ["Move when ready", "Call, text, or submit an offer straight from any listing."]
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
          {live > 0 && (
            <Link
              href="/deals"
              className="mt-8 inline-flex items-center gap-2 rounded-[10px] border-2 border-zona-purple-mid px-6 py-3 text-[15px] font-semibold text-zona-purple-mid transition hover:bg-zona-purple-mid/[0.08]"
            >
              Browse The {live} Live {live === 1 ? "Deal" : "Deals"} First →
            </Link>
          )}
        </div>
        <IntakeForm config={CONFIG} contact={contact} />
      </div>
    </div>
  );
}

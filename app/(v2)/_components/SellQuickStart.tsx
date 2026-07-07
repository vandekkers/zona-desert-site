"use client";

// SITE V2 — the landing page's live seller intake card (per the marketing
// kit's mock, but real). Three steps, warm inputs, progress bar. Zero
// backend: the final step composes a structured email/text to Zona in the
// visitor's own mail or messages app.

import { useState } from "react";
import type { DealsConfig } from "../_lib/deal-shared";

const CONDITIONS = ["Needs Work", "Fair", "Good", "Excellent"] as const;

const inputClass =
  "w-full rounded-[10px] border border-zona-navy/[0.12] bg-zona-sand px-3.5 py-3 text-[14.5px] text-zona-navy outline-none transition focus:border-zona-purple-mid focus:bg-white focus:shadow-[0_0_0_3px_rgba(112,37,182,0.12)]";
const labelClass =
  "text-[11.5px] font-semibold uppercase tracking-[0.06em] text-slate-600";

export function SellQuickStart({ config }: { config: DealsConfig }) {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [sqft, setSqft] = useState("");
  const [condition, setCondition] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const canNext = step === 0 ? address.trim().length > 5 : step === 1 ? true : false;
  const ready = name.trim().length > 1 && (phone.trim().length >= 7 || true);

  const body = [
    "CASH OFFER REQUEST",
    "",
    `Property: ${address.trim()}`,
    beds.trim() ? `Beds: ${beds.trim()}` : "",
    baths.trim() ? `Baths: ${baths.trim()}` : "",
    sqft.trim() ? `Square feet: ${sqft.trim()}` : "",
    condition ? `Condition: ${condition}` : "",
    "",
    `Name: ${name.trim()}`,
    phone.trim() ? `Phone: ${phone.trim()}` : "",
    "",
    "Sent from zonadesert.com"
  ]
    .filter((line) => line !== null)
    .join("\n");

  const mailtoHref = `mailto:${config.email}?subject=${encodeURIComponent(
    `Cash offer request — ${address.trim() || "my property"}`
  )}&body=${encodeURIComponent(body)}`;
  const smsHref = `sms:${config.phone}?&body=${encodeURIComponent(body)}`;

  return (
    <div className="rounded-[20px] border border-zona-navy/[0.06] bg-white p-6 shadow-card-float sm:p-7">
      <div className="flex items-center justify-between">
        <span className="font-display text-lg font-semibold tracking-[-0.01em] text-zona-navy">
          Tell us about your property
        </span>
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-zona-purple-mid">
          Step {step + 1} of 3
        </span>
      </div>
      <div className="mb-5 mt-3.5 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-zona-purple-deep" : "bg-zona-navy/[0.08]"
            }`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className={labelClass} htmlFor="qs-address">
              Property Address
            </label>
            <input
              id="qs-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city, state, zip"
              className={inputClass}
              autoComplete="street-address"
            />
          </div>
          <button
            type="button"
            disabled={!canNext}
            onClick={() => setStep(1)}
            className="w-full rounded-[10px] bg-zona-purple-deep px-7 py-3.5 text-[15.5px] font-semibold text-white shadow-btn transition hover:bg-[#3D1570] hover:shadow-btn-hover disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          >
            Continue
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={labelClass} htmlFor="qs-beds">
                Beds
              </label>
              <input id="qs-beds" value={beds} onChange={(e) => setBeds(e.target.value)} placeholder="3" inputMode="numeric" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass} htmlFor="qs-baths">
                Baths
              </label>
              <input id="qs-baths" value={baths} onChange={(e) => setBaths(e.target.value)} placeholder="2" inputMode="decimal" className={inputClass} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className={labelClass} htmlFor="qs-sqft">
              Square Feet
            </label>
            <input id="qs-sqft" value={sqft} onChange={(e) => setSqft(e.target.value)} placeholder="1,400" inputMode="numeric" className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <span className={labelClass}>Condition</span>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {CONDITIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCondition(c)}
                  className={`rounded-lg border px-1 py-[9px] text-[13px] transition ${
                    condition === c
                      ? "border-zona-navy bg-zona-navy font-semibold text-white"
                      : "border-zona-navy/10 bg-zona-sand font-medium text-slate-600 hover:border-zona-navy/25"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="rounded-[10px] border border-zona-navy/10 px-5 py-3.5 text-[15px] font-medium text-slate-600 transition hover:border-zona-navy/25"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 rounded-[10px] bg-zona-purple-deep px-7 py-3.5 text-[15.5px] font-semibold text-white shadow-btn transition hover:bg-[#3D1570] hover:shadow-btn-hover"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className={labelClass} htmlFor="qs-name">
              Your Name
            </label>
            <input id="qs-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={inputClass} autoComplete="name" />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass} htmlFor="qs-phone">
              Phone
            </label>
            <input id="qs-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 555-0123" inputMode="tel" className={inputClass} autoComplete="tel" />
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-[10px] border border-zona-navy/10 px-5 py-3.5 text-[15px] font-medium text-slate-600 transition hover:border-zona-navy/25"
            >
              Back
            </button>
            <a
              href={ready ? mailtoHref : undefined}
              aria-disabled={!ready}
              className={`flex flex-1 items-center justify-center rounded-[10px] px-7 py-3.5 text-[15.5px] font-semibold transition ${
                ready
                  ? "bg-zona-purple-deep text-white shadow-btn hover:bg-[#3D1570] hover:shadow-btn-hover"
                  : "cursor-not-allowed bg-slate-200 text-slate-400"
              }`}
            >
              Send My Request
            </a>
          </div>
          <a
            href={ready ? smsHref : undefined}
            aria-disabled={!ready}
            className={`block text-center text-[13px] font-medium ${
              ready ? "text-zona-purple-mid hover:text-zona-purple-deep" : "text-slate-400"
            }`}
          >
            Or send it as a text instead
          </a>
        </div>
      )}

      <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
        <svg className="h-3.5 w-3.5 shrink-0 text-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Reviewed by a person. No obligation, no credit pull, no public listing.
      </p>
    </div>
  );
}

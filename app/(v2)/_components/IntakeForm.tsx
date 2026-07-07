"use client";

// SITE V2 — unified intake form for sellers, buyers, agents, and
// wholesalers. Pure front end: on submit it (1) logs the 10DLC SMS
// consent to the self-contained /api/consent-log route (same compliance
// trail as before) and (2) composes a structured email in the visitor's
// own mail app addressed to Zona. No platform backend.

import { useState } from "react";
import { extractUtmParams, logConsentSubmission } from "@/lib/consentLog";
import type { DealsConfig } from "../_lib/deal-shared";

// Same locked consent language the platform forms used (10DLC audit trail).
const CONSENT_VERSION = "2026-05-v1";
const SMS_CONSENT_TEXT =
  "By submitting, I agree to receive SMS messages from Zona Desert about my property offer and transaction. Msg & data rates may apply. Msg frequency varies. Reply STOP to opt out, HELP for help.";

export type IntakeField =
  | { kind: "text" | "email" | "tel"; name: string; label: string; required?: boolean; placeholder?: string; half?: boolean }
  | { kind: "select"; name: string; label: string; options: string[]; required?: boolean; half?: boolean }
  | { kind: "segmented"; name: string; label: string; options: string[]; required?: boolean }
  | { kind: "chips"; name: string; label: string; options: string[] }
  | { kind: "textarea"; name: string; label: string; placeholder?: string };

export interface IntakeConfig {
  formType: "sell" | "buyer" | "agent" | "wholesaler";
  title: string;
  subjectPrefix: string;
  subjectField: string; // field whose value lands in the email subject
  fields: IntakeField[];
}

const inputClass =
  "w-full rounded-[10px] border border-zona-navy/[0.12] bg-zona-sand px-3.5 py-3 text-[14.5px] text-zona-navy outline-none transition focus:border-zona-purple-mid focus:bg-white focus:shadow-[0_0_0_3px_rgba(112,37,182,0.12)]";
const labelClass = "text-[11.5px] font-semibold uppercase tracking-[0.06em] text-slate-600";

export function IntakeForm({ config, contact }: { config: IntakeConfig; contact: DealsConfig }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [chips, setChips] = useState<Record<string, string[]>>({});
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const set = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));
  const toggleChip = (name: string, option: string) =>
    setChips((prev) => {
      const current = prev[name] ?? [];
      return {
        ...prev,
        [name]: current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option]
      };
    });

  function fieldValue(field: IntakeField): string {
    if (field.kind === "chips") return (chips[field.name] ?? []).join(", ");
    return (values[field.name] ?? "").trim();
  }

  function missingRequired(): string | null {
    for (const field of config.fields) {
      if ("required" in field && field.required && !fieldValue(field)) return field.label;
    }
    return null;
  }

  async function submit() {
    const missing = missingRequired();
    if (missing) {
      setError(`Please fill in “${missing}”.`);
      return;
    }
    if (!consent) {
      setError("Please agree to receive SMS messages before submitting.");
      return;
    }
    setError(null);

    // Compliance trail — identical shape to the platform-era consent log.
    logConsentSubmission({
      form_type: config.formType,
      consent_version: CONSENT_VERSION,
      consent_text: SMS_CONSENT_TEXT,
      marketing_opt_in: true,
      page_url: typeof window !== "undefined" ? window.location.href : undefined,
      email: values.email,
      phone: values.phone,
      ...extractUtmParams()
    });

    // Lead persistence — fire-and-forget so the lead exists even if the
    // visitor never hits send in their mail app. Forwarded/stored by the
    // self-contained /api/lead-log route.
    const allFields: Record<string, string> = {};
    for (const field of config.fields) {
      const value = fieldValue(field);
      if (value) allFields[field.name] = value;
    }
    fetch("/api/lead-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        form_type: config.formType,
        fields: allFields,
        page_url: typeof window !== "undefined" ? window.location.href : undefined,
        ...extractUtmParams()
      })
    }).catch(() => {});

    const lines = [
      config.title.toUpperCase(),
      "",
      ...config.fields
        .map((field) => {
          const value = fieldValue(field);
          return value ? `${field.label}: ${value}` : null;
        })
        .filter((line): line is string => line !== null),
      "",
      `SMS consent: yes (${CONSENT_VERSION})`,
      "Sent from zonadesert.com"
    ];
    const subjectValue = fieldValue(
      config.fields.find((f) => f.name === config.subjectField) ?? config.fields[0]
    );
    const href = `mailto:${contact.email}?subject=${encodeURIComponent(
      `${config.subjectPrefix} — ${subjectValue || "new submission"}`
    )}&body=${encodeURIComponent(lines.join("\n"))}`;

    window.location.href = href;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-[20px] border border-zona-navy/[0.06] bg-white p-7 text-center shadow-card-float">
        <span className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-full bg-green-800/10 text-green-800">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <h3 className="font-display text-xl font-semibold text-zona-navy">Almost There</h3>
        <p className="mx-auto mt-2 max-w-[360px] text-[14.5px] leading-relaxed text-slate-600">
          Your email app just opened with everything filled in — hit send and we&apos;ll take it
          from there. Nothing arrives until you send it.
        </p>
        <p className="mt-4 text-[13px] text-slate-500">
          Prefer to talk?{" "}
          <a href={`tel:${contact.phone}`} className="font-semibold text-zona-purple-mid">
            Call
          </a>{" "}
          or{" "}
          <a href={`sms:${contact.phone}`} className="font-semibold text-zona-purple-mid">
            text
          </a>{" "}
          us directly.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-5 text-[13px] font-medium text-slate-400 underline decoration-dotted underline-offset-2"
        >
          Back to the form
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] border border-zona-navy/[0.06] bg-white p-6 shadow-card-float sm:p-7">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {config.fields.map((field) => {
          const span = "half" in field && field.half ? "" : "sm:col-span-2";
          if (field.kind === "text" || field.kind === "email" || field.kind === "tel") {
            return (
              <div key={field.name} className={`space-y-1.5 ${span}`}>
                <label className={labelClass} htmlFor={`in-${field.name}`}>
                  {field.label}
                  {field.required ? " *" : ""}
                </label>
                <input
                  id={`in-${field.name}`}
                  type={field.kind === "text" ? "text" : field.kind}
                  value={values[field.name] ?? ""}
                  onChange={(e) => set(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              </div>
            );
          }
          if (field.kind === "select") {
            return (
              <div key={field.name} className={`space-y-1.5 ${span}`}>
                <label className={labelClass} htmlFor={`in-${field.name}`}>
                  {field.label}
                  {field.required ? " *" : ""}
                </label>
                <select
                  id={`in-${field.name}`}
                  value={values[field.name] ?? ""}
                  onChange={(e) => set(field.name, e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select…</option>
                  {field.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            );
          }
          if (field.kind === "segmented") {
            return (
              <div key={field.name} className="space-y-1.5 sm:col-span-2">
                <span className={labelClass}>
                  {field.label}
                  {field.required ? " *" : ""}
                </span>
                <div
                  className={`grid grid-cols-2 gap-1.5 ${
                    field.options.length >= 4
                      ? "sm:grid-cols-4"
                      : field.options.length === 3
                        ? "sm:grid-cols-3"
                        : "sm:grid-cols-2"
                  }`}
                >
                  {field.options.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => set(field.name, o)}
                      className={`rounded-lg border px-2 py-[9px] text-[13px] transition ${
                        values[field.name] === o
                          ? "border-zona-navy bg-zona-navy font-semibold text-white"
                          : "border-zona-navy/10 bg-zona-sand font-medium text-slate-600 hover:border-zona-navy/25"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            );
          }
          if (field.kind === "chips") {
            const selected = chips[field.name] ?? [];
            return (
              <div key={field.name} className="space-y-1.5 sm:col-span-2">
                <span className={labelClass}>{field.label}</span>
                <div className="flex flex-wrap gap-1.5">
                  {field.options.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => toggleChip(field.name, o)}
                      className={`rounded-full border px-3.5 py-1.5 text-[13px] transition ${
                        selected.includes(o)
                          ? "border-zona-navy bg-zona-navy font-semibold text-white"
                          : "border-zona-navy/10 bg-white font-medium text-slate-600 hover:border-zona-navy/30"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            );
          }
          return (
            <div key={field.name} className="space-y-1.5 sm:col-span-2">
              <label className={labelClass} htmlFor={`in-${field.name}`}>
                {field.label}
              </label>
              <textarea
                id={`in-${field.name}`}
                rows={3}
                value={values[field.name] ?? ""}
                onChange={(e) => set(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={inputClass}
              />
            </div>
          );
        })}
      </div>

      <label className="mt-5 flex items-start gap-2.5 text-[13px] leading-relaxed text-slate-600">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-zona-purple-deep"
        />
        <span>{SMS_CONSENT_TEXT}</span>
      </label>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3.5 py-2.5 text-[13px] font-semibold text-red-800">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={submit}
        className="mt-5 w-full rounded-[10px] bg-zona-purple-deep px-7 py-3.5 text-[15.5px] font-semibold text-white shadow-btn transition hover:bg-[#3D1570] hover:shadow-btn-hover"
      >
        {config.title}
      </button>
      <p className="mt-3 text-center text-xs text-slate-400">
        Opens your own email app with everything pre-filled — you review before anything sends.
      </p>
    </div>
  );
}

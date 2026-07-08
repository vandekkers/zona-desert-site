"use client";

// BREAKAWAY: deals board — remove at platform launch
//
// Offer form: submits a structured offer straight to Zona through the
// /api/submit-form relay (captured in LEAD_LOG / forwarded to the admin
// side). No mail or SMS app is ever opened.

import { useState } from "react";
import type { Deal } from "../_lib/deal-shared";
import { money } from "../_lib/deal-shared";

export function OfferComposer({ deal }: { deal: Deal }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [funding, setFunding] = useState("Cash");
  const [closeDate, setCloseDate] = useState("");
  const [notes, setNotes] = useState("");

  const shortAddress = `${deal.address}, ${deal.city} ${deal.state}`;
  const amountNumber = Number(amount.replace(/[^0-9.]/g, ""));
  const ready = name.trim().length > 0 && amountNumber > 0;

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Submits the offer straight to Zona via the server relay — no mail or
  // SMS app involvement.
  async function submitOffer() {
    if (!ready || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_type: "offer",
          fields: {
            dealId: deal.id,
            property: shortAddress,
            askingPrice: String(deal.price),
            offerPrice: String(amountNumber),
            funding,
            buyer: name.trim(),
            phone: phone.trim(),
            targetClose: closeDate,
            notes: notes.trim()
          },
          page_url: typeof window !== "undefined" ? window.location.href : undefined
        })
      });
      if (!res.ok) throw new Error(String(res.status));
      setSent(true);
    } catch {
      setError("Something went wrong sending your offer — please try again.");
    } finally {
      setSending(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-zona-purple-mid";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center rounded-[10px] bg-zona-purple-deep px-4 py-3 text-sm font-semibold text-white shadow-btn transition hover:bg-[#3D1570] hover:shadow-btn-hover"
      >
        Submit an offer
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Submit an offer for ${shortAddress}`}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-zona-navy/60 p-0 sm:items-center sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3
                  className="text-lg text-zona-navy"
                  style={{ fontFamily: "var(--font-sora), system-ui, sans-serif", fontWeight: 600 }}
                >
                  Submit an offer
                </h3>
                <p className="text-sm text-slate-500">
                  {shortAddress} · asking {money(deal.price)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close offer form"
                className="rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Your name *
                  </span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder="Full name or entity"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Phone
                  </span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    placeholder="(555) 555-0123"
                    inputMode="tel"
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Offer price *
                  </span>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={inputClass}
                    placeholder="125000"
                    inputMode="numeric"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Funding
                  </span>
                  <select
                    value={funding}
                    onChange={(e) => setFunding(e.target.value)}
                    className={inputClass}
                  >
                    <option>Cash</option>
                    <option>Hard money</option>
                    <option>Private money</option>
                    <option>Conventional</option>
                    <option>Other</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Target close date
                </span>
                <input
                  type="date"
                  value={closeDate}
                  onChange={(e) => setCloseDate(e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Notes
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className={inputClass}
                  placeholder="Proof of funds ready, flexible on close, etc."
                />
              </label>

              {sent ? (
                <div className="rounded-xl bg-green-50 p-4 text-center">
                  <p className="text-[15px] font-semibold text-green-800">
                    Offer submitted — we&apos;ll confirm receipt shortly.
                  </p>
                  <p className="mt-1 text-[13px] text-green-800/80">
                    Deals move fast; we review offers as they land.
                  </p>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={!ready || sending}
                    onClick={submitOffer}
                    className={`mt-1 flex w-full items-center justify-center rounded-[10px] px-4 py-3 text-sm font-semibold transition ${
                      ready && !sending
                        ? "bg-zona-purple-deep text-white shadow-btn hover:bg-[#3D1570] hover:shadow-btn-hover"
                        : "cursor-not-allowed bg-slate-200 text-slate-400"
                    }`}
                  >
                    {sending ? "Submitting…" : "Submit Offer"}
                  </button>
                  {error && (
                    <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-[13px] font-semibold text-red-800">
                      {error}
                    </p>
                  )}
                  <p className="text-xs text-slate-500">
                    Goes directly to our team — name and offer price are required.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

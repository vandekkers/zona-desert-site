"use client";

// BREAKAWAY: deals board — remove at platform launch
//
// Zero-backend offer flow: a small form that composes a structured offer
// and hands it to the buyer's own mail/SMS app via mailto:/sms:. Nothing
// is stored or sent server-side — the board stays backend-free.

import { useState } from "react";
import type { Deal, DealsConfig } from "../_lib/deal-shared";
import { money } from "../_lib/deal-shared";

interface Props {
  deal: Deal;
  config: DealsConfig;
}

export function OfferComposer({ deal, config }: Props) {
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

  function offerBody(): string {
    const lines = [
      `OFFER — ${shortAddress}`,
      "",
      `Offer price: ${amountNumber > 0 ? money(amountNumber) : ""}`,
      `Funding: ${funding}`,
      `Buyer: ${name.trim()}`,
      phone.trim() ? `Phone: ${phone.trim()}` : "",
      closeDate ? `Target close: ${closeDate}` : "",
      notes.trim() ? `Notes: ${notes.trim()}` : "",
      "",
      `Sent from the Zona Desert deal board (${deal.id})`
    ];
    return lines.filter((line) => line !== "").join("\n");
  }

  const mailtoHref = `mailto:${config.email}?subject=${encodeURIComponent(
    `Offer ${amountNumber > 0 ? money(amountNumber) : ""} — ${shortAddress}`
  )}&body=${encodeURIComponent(offerBody())}`;

  const smsHref = `sms:${config.phone}?&body=${encodeURIComponent(offerBody())}`;

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

              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href={ready ? mailtoHref : undefined}
                  aria-disabled={!ready}
                  className={`flex items-center justify-center rounded-[10px] px-4 py-3 text-sm font-semibold transition ${
                    ready
                      ? "bg-zona-purple-deep text-white hover:bg-zona-purple-mid"
                      : "cursor-not-allowed bg-slate-200 text-slate-400"
                  }`}
                >
                  Send by email
                </a>
                <a
                  href={ready ? smsHref : undefined}
                  aria-disabled={!ready}
                  className={`flex items-center justify-center rounded-[10px] border px-4 py-3 text-sm font-semibold transition ${
                    ready
                      ? "border-zona-purple-mid text-zona-purple-mid hover:bg-zona-purple-mid/10"
                      : "cursor-not-allowed border-slate-200 text-slate-400"
                  }`}
                >
                  Send by text
                </a>
              </div>
              <p className="text-xs text-slate-500">
                Opens your own mail or messages app with the offer pre-written — nothing is
                submitted until you hit send there. Name and offer price are required.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

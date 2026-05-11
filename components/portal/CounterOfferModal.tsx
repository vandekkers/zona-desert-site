"use client";

// CounterOfferModal (Phase 4.5.i) — 2-phase form → result modal that wires
// the seller-portal Counter action into POST /offers/{token}/counter.
//
// Counter amount is stored as a raw digit string in state; display value
// adds locale thousand separators as the user types. Backend Pydantic
// schema validates gt=0 / le=10_000_000 and notes max_length=500; client
// performs a soft check so users see "minimum $1" / "maximum $10M" /
// "notes too long" before a round trip. Server 400 → inline error.
//
// On success → router.refresh() so the Server Component re-fetches the
// (now countered) terminal state.

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { counterOffer, PublicApiError } from "@/lib/publicApi";
import { formatCurrency } from "@/lib/portalFormatters";
import { IdentityVerificationFields } from "./IdentityVerificationFields";

interface Props {
  open: boolean;
  token: string;
  onClose: () => void;
}

type Phase = "form" | "result";

const COUNTER_MAX = 10_000_000;
const NOTES_MAX = 500;
const NOTES_WARN = 450;

interface SuccessState {
  counterAmount: string;
  message: string;
}

export function CounterOfferModal({ open, token, onClose }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("form");
  const [name, setName] = useState("");
  const [phoneLast4, setPhoneLast4] = useState("");
  const [amountDigits, setAmountDigits] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessState | null>(null);

  useEffect(() => {
    if (!open) return;
    setPhase("form");
    setName("");
    setPhoneLast4("");
    setAmountDigits("");
    setNotes("");
    setSubmitting(false);
    setSubmitError(null);
    setSuccess(null);
  }, [open]);

  const handleClose = useCallback(() => {
    if (submitting) return;
    const wasSuccess = phase === "result";
    onClose();
    if (wasSuccess) {
      router.refresh();
    }
  }, [submitting, phase, onClose, router]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  const amountNumeric = useMemo(() => {
    if (!amountDigits) return 0;
    const n = Number(amountDigits);
    return Number.isFinite(n) ? n : 0;
  }, [amountDigits]);

  const displayAmount = useMemo(() => {
    if (!amountDigits) return "";
    return new Intl.NumberFormat("en-US").format(amountNumeric);
  }, [amountDigits, amountNumeric]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setSubmitError("Please enter your full name.");
      return;
    }
    if (phoneLast4.length < 4) {
      setSubmitError("Please enter the last 4 digits of your phone.");
      return;
    }
    if (amountNumeric <= 0) {
      setSubmitError("Counter amount must be at least $1.");
      return;
    }
    if (amountNumeric > COUNTER_MAX) {
      setSubmitError("Counter amount cannot exceed $10,000,000.");
      return;
    }
    if (notes.length > NOTES_MAX) {
      setSubmitError(`Notes cannot exceed ${NOTES_MAX} characters.`);
      return;
    }

    setSubmitting(true);
    try {
      const result = await counterOffer(token, {
        identity_check_name: trimmedName,
        identity_check_phone_last4: phoneLast4,
        counter_amount: String(amountNumeric),
        counter_notes: notes.trim() ? notes.trim() : null
      });
      setSuccess({
        counterAmount: result.counter_amount,
        message: result.message
      });
      setPhase("result");
    } catch (err) {
      const message =
        err instanceof PublicApiError
          ? err.message
          : "Connection issue — please retry.";
      setSubmitError(message);
      setPhoneLast4("");
    } finally {
      setSubmitting(false);
    }
  }

  const notesOverLimit = notes.length > NOTES_MAX;
  const notesWarn = notes.length >= NOTES_WARN && !notesOverLimit;

  return (
    <div
      data-zona-gate="1"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zona-navy/60 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="counter-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-zona-off-white shadow-2xl">
        {phase === "form" ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-5 px-6 py-6 md:px-8 md:py-7">
              <div className="space-y-2">
                <h2
                  id="counter-modal-title"
                  className="text-2xl text-zona-navy md:text-3xl"
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
                >
                  Counter Offer
                </h2>
                <p
                  className="text-base text-zona-navy/80"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Tell us your number and we&apos;ll review. Most counters get a
                  response within 1 business day.
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="counter-amount"
                  className="block text-sm text-zona-navy"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
                >
                  Your Counter Amount
                </label>
                <div className="relative">
                  <span
                    className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-base text-zona-navy/60"
                    style={{ fontFamily: "var(--font-inter)" }}
                    aria-hidden="true"
                  >
                    $
                  </span>
                  <input
                    id="counter-amount"
                    type="text"
                    inputMode="numeric"
                    value={displayAmount}
                    onChange={(e) =>
                      setAmountDigits(e.target.value.replace(/\D/g, "").slice(0, 9))
                    }
                    disabled={submitting}
                    placeholder="0"
                    className="w-full rounded-lg border border-zona-navy/15 bg-white px-3 py-2 pl-7 text-base text-zona-navy outline-none transition focus:border-zona-purple-mid focus:ring-2 focus:ring-zona-purple-mid/20 disabled:opacity-60"
                    style={{ fontFamily: "var(--font-inter)" }}
                  />
                </div>
                <p
                  className="text-xs text-zona-navy/60"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Minimum $1. Maximum $10,000,000.
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="counter-notes"
                  className="block text-sm text-zona-navy"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
                >
                  Notes (optional)
                </label>
                <textarea
                  id="counter-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={submitting}
                  rows={3}
                  maxLength={NOTES_MAX}
                  placeholder="What's the lowest you'd accept?"
                  className="w-full rounded-lg border border-zona-navy/15 bg-white px-3 py-2 text-base text-zona-navy outline-none transition focus:border-zona-purple-mid focus:ring-2 focus:ring-zona-purple-mid/20 disabled:opacity-60"
                  style={{ fontFamily: "var(--font-inter)" }}
                />
                <p
                  className={`text-xs ${
                    notesOverLimit
                      ? "text-zona-orange"
                      : notesWarn
                      ? "text-zona-amber"
                      : "text-zona-navy/60"
                  }`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {notes.length} / {NOTES_MAX}
                </p>
              </div>

              <IdentityVerificationFields
                name={name}
                phoneLast4={phoneLast4}
                onChange={({ name: n, phoneLast4: p }) => {
                  setName(n);
                  setPhoneLast4(p);
                }}
                disabled={submitting}
              />

              {submitError ? (
                <div
                  role="alert"
                  className="rounded-lg border border-zona-orange/40 bg-zona-orange/10 px-4 py-3"
                >
                  <p
                    className="text-sm text-zona-navy"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {submitError}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-zona-navy/10 bg-white px-6 py-4 md:px-8">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="rounded-lg px-4 py-2 text-base text-zona-navy/70 transition hover:text-zona-navy disabled:opacity-60"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || notesOverLimit}
                className="rounded-lg bg-zona-purple-mid px-5 py-2 text-base text-white shadow-sm transition hover:bg-zona-purple-deep disabled:opacity-60"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
              >
                {submitting ? "Submitting…" : "Submit Counter"}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="space-y-3 px-6 py-6 md:px-8 md:py-7">
              <h2
                id="counter-modal-title"
                className="text-2xl text-zona-navy md:text-3xl"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
              >
                Counter Offer Sent
              </h2>
              <p
                className="text-base text-zona-navy/85"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {success?.message ??
                  "Counter received. Our team will review and respond shortly."}
              </p>
              {success?.counterAmount ? (
                <p
                  className="text-sm text-zona-navy/70"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Your counter of{" "}
                  <span style={{ fontWeight: 600 }}>
                    {formatCurrency(success.counterAmount)}
                  </span>{" "}
                  has been submitted. We&apos;ll review and respond within 1
                  business day.
                </p>
              ) : null}
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-zona-navy/10 bg-white px-6 py-4 md:px-8">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg bg-zona-purple-mid px-5 py-2 text-base text-white shadow-sm transition hover:bg-zona-purple-deep"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

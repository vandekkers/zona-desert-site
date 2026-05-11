"use client";

// ContactModal (Phase 4.5.i) — 2-phase confirm → result modal that wires
// the seller-portal Contact action into POST /offers/{token}/contact.
//
// Friction-light by design: NO identity verification (backend ContactRequest
// accepts an empty body per blueprint §3.5). NO state transition either —
// closing this modal does NOT trigger router.refresh() because the token
// remains in its current state and the action bar stays visible.

import { useCallback, useEffect, useState } from "react";
import { contactZona, PublicApiError } from "@/lib/publicApi";

interface Props {
  open: boolean;
  token: string;
  onClose: () => void;
}

type Phase = "confirm" | "result";

interface SuccessState {
  zonaPhone: string;
}

export function ContactModal({ open, token, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("confirm");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessState | null>(null);

  useEffect(() => {
    if (!open) return;
    setPhase("confirm");
    setSubmitting(false);
    setSubmitError(null);
    setSuccess(null);
  }, [open]);

  const handleClose = useCallback(() => {
    if (submitting) return;
    onClose();
    // No router.refresh() — Contact does not change token state.
  }, [submitting, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  if (!open) return null;

  async function handleSubmit() {
    if (submitting) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const result = await contactZona(token);
      setSuccess({ zonaPhone: result.zona_phone });
      setPhase("result");
    } catch (err) {
      const message =
        err instanceof PublicApiError
          ? err.message
          : "Connection issue — please retry.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      data-zona-gate="1"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zona-navy/60 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-zona-off-white shadow-2xl">
        {phase === "confirm" ? (
          <div>
            <div className="space-y-3 px-6 py-6 md:px-8 md:py-7">
              <h2
                id="contact-modal-title"
                className="text-2xl text-zona-navy md:text-3xl"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
              >
                Get in Touch
              </h2>
              <p
                className="text-base text-zona-navy/85"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Have questions or want to discuss your offer? Click below and a
                Zona team member will reach out to you within 1 business hour
                during business hours.
              </p>

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
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-lg border-2 border-zona-amber bg-white px-5 py-2 text-base text-zona-navy shadow-sm transition hover:bg-zona-amber/10 disabled:opacity-60"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
              >
                {submitting ? "Submitting…" : "Request Contact"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="space-y-3 px-6 py-6 md:px-8 md:py-7">
              <h2
                id="contact-modal-title"
                className="text-2xl text-zona-navy md:text-3xl"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
              >
                We&apos;ll Reach Out Shortly
              </h2>
              <p
                className="text-base text-zona-navy/85"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                We&apos;ve received your request. Expect a call or text within 1
                business hour.
              </p>
              {success?.zonaPhone ? (
                <p
                  className="text-sm text-zona-navy/70"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Or call us directly:{" "}
                  <a
                    href={`tel:${success.zonaPhone.replace(/[^\d+]/g, "")}`}
                    className="text-zona-purple-mid underline"
                    style={{ fontWeight: 500 }}
                  >
                    {success.zonaPhone}
                  </a>
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

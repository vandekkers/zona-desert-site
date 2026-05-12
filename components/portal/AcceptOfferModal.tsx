"use client";

// AcceptOfferModal (Phase 4.5.i) — 2-phase confirm → result modal that
// wires the seller-portal Accept action into POST /offers/{token}/accept.
//
// On success, the modal transitions to a result view; closing triggers
// router.refresh() so the Server Component re-fetches the (now terminal)
// offer state and TerminalState renders. Backend identity failure (400)
// surfaces inline; phone clears, name preserved for retry per UX spec.

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { acceptOffer, PublicApiError } from "@/lib/publicApi";
import { formatCurrency } from "@/lib/portalFormatters";
import { IdentityVerificationFields } from "./IdentityVerificationFields";

interface Props {
  open: boolean;
  token: string;
  targetOffer: string;
  onClose: () => void;
}

type Phase = "confirm" | "result";

interface SuccessState {
  acceptedAt: string;
  message: string;
}

export function AcceptOfferModal({ open, token, targetOffer, onClose }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("confirm");
  const [name, setName] = useState("");
  const [phoneLast4, setPhoneLast4] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessState | null>(null);

  // Reset state when the modal opens; preserves a clean slate per re-open.
  useEffect(() => {
    if (!open) return;
    setPhase("confirm");
    setName("");
    setPhoneLast4("");
    setSubmitting(false);
    setSubmitError(null);
    setSuccess(null);
  }, [open]);

  const handleClose = useCallback(() => {
    if (submitting) return;
    const wasSuccess = phase === "result";
    onClose();
    if (wasSuccess) {
      // router.refresh() re-fetches the Server Component data; TerminalState
      // renders for the new accepted status.
      router.refresh();
    }
  }, [submitting, phase, onClose, router]);

  // ESC + outside-click handlers. Skipped while submitting so the user
  // can't accidentally cancel mid-request.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  if (!open) return null;

  const clientNameError =
    submitError && !name.trim() ? "Please enter your full name." : undefined;
  const clientPhoneError =
    submitError && phoneLast4.length < 4
      ? "Please enter the last 4 digits of your phone."
      : undefined;

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

    setSubmitting(true);
    try {
      const result = await acceptOffer(token, {
        identity_check_name: trimmedName,
        identity_check_phone_last4: phoneLast4
      });
      setSuccess({ acceptedAt: result.accepted_at, message: result.message });
      setPhase("result");
    } catch (err) {
      const message =
        err instanceof PublicApiError
          ? err.message
          : "Connection issue — please retry.";
      setSubmitError(message);
      // Clear phone for retry, preserve name (UX spec).
      setPhoneLast4("");
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
      aria-labelledby="accept-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-zona-off-white shadow-2xl">
        {phase === "confirm" ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-5 px-6 py-6 md:px-8 md:py-7">
              <div className="space-y-2">
                <h2
                  id="accept-modal-title"
                  className="text-2xl text-zona-navy md:text-3xl"
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
                >
                  Accept Your Offer
                </h2>
                <p
                  className="text-base text-zona-navy/80"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  By accepting, you agree to sell your property to Zona Desert at{" "}
                  <span style={{ fontWeight: 600 }}>{formatCurrency(targetOffer)}</span>
                  . We&apos;ll begin the closing process within 1 business day.
                </p>
              </div>

              <IdentityVerificationFields
                name={name}
                phoneLast4={phoneLast4}
                onChange={({ name: n, phoneLast4: p }) => {
                  setName(n);
                  setPhoneLast4(p);
                }}
                nameError={clientNameError}
                phoneError={clientPhoneError}
                disabled={submitting}
              />

              {submitError && !clientNameError && !clientPhoneError ? (
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
                disabled={submitting}
                className="rounded-lg bg-zona-purple-mid px-5 py-2 text-base text-white shadow-sm transition hover:bg-zona-purple-deep disabled:opacity-60"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
              >
                {submitting ? "Submitting…" : "Accept Offer"}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="space-y-3 px-6 py-6 md:px-8 md:py-7">
              <h2
                id="accept-modal-title"
                className="text-2xl text-zona-navy md:text-3xl"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
              >
                Offer Accepted
              </h2>
              <p
                className="text-base text-zona-navy/85"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {success?.message ??
                  "Offer accepted. Our team will reach out shortly with next steps."}
              </p>
              {success?.acceptedAt ? (
                <p
                  className="text-sm text-zona-navy/60"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Accepted {formatAcceptedAt(success.acceptedAt)}
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

function formatAcceptedAt(iso: string): string {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

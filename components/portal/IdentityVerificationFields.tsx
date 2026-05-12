"use client";

// Identity verification panel shared by AcceptOfferModal + CounterOfferModal
// (Phase 4.5.i). NOT used by ContactModal — backend ContactRequest accepts
// an empty body per blueprint §3.5.
//
// Backend identity service does case-insensitive token-set match requiring
// BOTH first AND last name tokens; phone is digit-stripped and compared to
// the trailing 4 of seller phone on file. Failure returns 400 with a generic
// detail message that does NOT reveal which side mismatched (info-leak
// defense per apps/api/app/api/routes/public_offers.py:170-178).

interface Props {
  name: string;
  phoneLast4: string;
  onChange: (fields: { name: string; phoneLast4: string }) => void;
  nameError?: string;
  phoneError?: string;
  disabled?: boolean;
}

export function IdentityVerificationFields({
  name,
  phoneLast4,
  onChange,
  nameError,
  phoneError,
  disabled
}: Props) {
  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-zona-amber/40 bg-zona-amber/10 px-4 py-3"
        role="note"
      >
        <p
          className="text-sm text-zona-navy/80"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Verifying your identity protects your offer from unauthorized access.
        </p>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="identity-name"
          className="block text-sm text-zona-navy"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
        >
          Your Full Legal Name
        </label>
        <input
          id="identity-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => onChange({ name: e.target.value, phoneLast4 })}
          disabled={disabled}
          className="w-full rounded-lg border border-zona-navy/15 bg-white px-3 py-2 text-base text-zona-navy outline-none transition focus:border-zona-purple-mid focus:ring-2 focus:ring-zona-purple-mid/20 disabled:opacity-60"
          style={{ fontFamily: "var(--font-inter)" }}
          aria-invalid={nameError ? "true" : undefined}
          aria-describedby={nameError ? "identity-name-error" : undefined}
        />
        {nameError ? (
          <p
            id="identity-name-error"
            className="text-sm text-zona-orange"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {nameError}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="identity-phone-last4"
          className="block text-sm text-zona-navy"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
        >
          Last 4 Digits of Phone Number on File
        </label>
        <input
          id="identity-phone-last4"
          type="text"
          inputMode="numeric"
          maxLength={4}
          autoComplete="off"
          value={phoneLast4}
          onChange={(e) =>
            onChange({
              name,
              phoneLast4: e.target.value.replace(/\D/g, "").slice(0, 4)
            })
          }
          disabled={disabled}
          className="w-full rounded-lg border border-zona-navy/15 bg-white px-3 py-2 text-base text-zona-navy outline-none transition focus:border-zona-purple-mid focus:ring-2 focus:ring-zona-purple-mid/20 disabled:opacity-60"
          style={{ fontFamily: "var(--font-inter)" }}
          aria-invalid={phoneError ? "true" : undefined}
          aria-describedby={phoneError ? "identity-phone-error" : undefined}
        />
        {phoneError ? (
          <p
            id="identity-phone-error"
            className="text-sm text-zona-orange"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {phoneError}
          </p>
        ) : null}
      </div>
    </div>
  );
}

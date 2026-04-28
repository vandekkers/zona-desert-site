"use client";

import { FormEvent, useState } from "react";

export default function OwnerAccessPage() {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/__owner-access/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "same-origin"
      });
      if (res.ok) {
        window.location.href = "/";
        return;
      }
      if (res.status === 400) {
        setError("Enter a password.");
      } else {
        setError("Wrong password.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      data-zona-gate="1"
      className="min-h-screen w-full bg-[#F1F2EF] text-[#0E172A] flex items-center justify-center px-6 py-16"
    >
      <div className="w-full max-w-sm">
        <h1
          className="text-2xl font-semibold text-[#0E172A] tracking-tight mb-6"
          style={{ fontFamily: "var(--font-sora), system-ui, sans-serif" }}
        >
          Owner access
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          <label htmlFor="owner-password" className="sr-only">
            Password
          </label>
          <input
            id="owner-password"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-[#0E172A]/15 bg-white px-4 py-3 text-base text-[#0E172A] placeholder:text-[#0E172A]/40 outline-none transition focus:border-[#4A1988] focus:ring-2 focus:ring-[#4A1988]/30"
          />

          {error && (
            <p role="alert" className="text-sm text-[#FE642D]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !password}
            className="w-full rounded-lg bg-[#4A1988] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#7025B6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Verifying..." : "Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}

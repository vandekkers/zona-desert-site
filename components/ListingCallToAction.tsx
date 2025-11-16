"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function ListingCallToAction({ slug }: { slug: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerNotes, setOfferNotes] = useState("");
  const ctas = ["Deal Pack", "Submit Offer", "Talk To Us"];

  function handleQuickAction(label: string) {
    if (label === "Talk To Us") {
      setShowContactForm(true);
      setShowOfferForm(false);
      return;
    }
    if (label === "Submit Offer") {
      setShowOfferForm(true);
      setShowContactForm(false);
      return;
    }
    if (label === "Deal Pack") {
      router.push(`/deal-pack/${slug}`);
      return;
    }
    setMessage(`${label} request captured for ${slug}. We'll follow up shortly.`);
    setShowContactForm(false);
    setShowOfferForm(false);
  }

  function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    setMessage(`Message sent about ${slug}. We'll reply via email ASAP.`);
    setSubject("");
    setBody("");
    setShowContactForm(false);
  }

  function formatCurrency(raw: string) {
    const numeric = raw.replace(/[^\d]/g, "");
    if (!numeric) return "";
    return Number(numeric).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });
  }

  function handleOfferSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!offerAmount.trim()) return;
    setMessage(`Offer submitted on ${slug}. A team member will reach out shortly.`);
    setOfferAmount("");
    setOfferNotes("");
    setShowOfferForm(false);
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/30">
      <p className="text-xs uppercase tracking-[0.3em] text-zona-purple">Next Steps</p>
      <p className="mt-3 text-2xl font-semibold text-slate-900">Choose Your Next Step.</p>
      <div className="mt-6 space-y-3">
        {ctas.map((cta) => (
          <button
            key={cta}
            className="w-full rounded-2xl bg-zona-purple px-6 py-4 text-left text-base font-semibold text-white shadow-lg shadow-zona-purple/30 transition hover:-translate-y-0.5 hover:bg-zona-purple/90"
            onClick={() => handleQuickAction(cta)}
          >
            {cta}
          </button>
        ))}
      </div>

      {showContactForm && (
        <form onSubmit={handleContactSubmit} className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-sm font-semibold text-slate-700">Email Us Now</p>
          <input
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Subject"
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-zona-purple focus:outline-none"
            required
          />
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Tell us what you need..."
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-zona-purple focus:outline-none"
            rows={4}
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-zona-purple px-4 py-2 text-sm font-semibold text-white shadow shadow-zona-purple/30"
            >
              Send Message
            </button>
            <button
              type="button"
              onClick={() => {
                setShowContactForm(false);
                setSubject("");
                setBody("");
              }}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {showOfferForm && (
        <form onSubmit={handleOfferSubmit} className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-sm font-semibold text-slate-700">Submit Your Offer</p>
          <input
            type="text"
            value={offerAmount}
            onChange={(event) => setOfferAmount(formatCurrency(event.target.value))}
            placeholder="Offer Amount (USD)"
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-zona-purple focus:outline-none"
            inputMode="numeric"
            required
          />
          <textarea
            value={offerNotes}
            onChange={(event) => setOfferNotes(event.target.value)}
            placeholder="Terms, financing, or timeline notes..."
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-zona-purple focus:outline-none"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-zona-purple px-4 py-2 text-sm font-semibold text-white shadow shadow-zona-purple/30"
            >
              Send Offer
            </button>
            <button
              type="button"
              onClick={() => {
                setShowOfferForm(false);
                setOfferAmount("");
                setOfferNotes("");
              }}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {message && <p className="mt-4 text-xs font-semibold text-zona-purple">{message}</p>}
    </div>
  );
}

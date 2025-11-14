import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Zona Desert",
  description: "Answers to the top investor, seller, agent, and wholesaler questions."
};

const faqs = [
  {
    question: "Do I need proof of funds?",
    answer: "Yes. We verify liquidity or lending relationships before sending our full drops."
  },
  {
    question: "Can you send me comps and underwriting?",
    answer: "Every deal pack includes comps, rent studies, rehab notes, and suggested exit strategies."
  },
  {
    question: "What asset types do you buy?",
    answer: "Single-family, townhomes, small multifamily (2-20 units), boutique hospitality, and select land deals."
  },
  {
    question: "How fast can you close?",
    answer: "Cash deals can close in as little as 7 days. Creative finance timelines depend on structure."
  }
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-16">
      <div className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-zona-purple">FAQ</p>
        <h1 className="text-4xl font-semibold text-slate-900">Questions we hear the most</h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <details key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-5">
            <summary className="cursor-pointer text-base font-semibold text-slate-900">{faq.question}</summary>
            <p className="mt-3 text-slate-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

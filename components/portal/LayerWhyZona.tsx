// Layer 2 (Confidence Wrap) — MVP templated trust block.
//
// Per backend schema docstring at apps/api/app/schemas/public_offer.py
// line 47, engine narrative is explicitly out of scope for this layer
// today. When backend exposes a data-driven "Why this offer" narrative
// in a future PR, swap this templated copy for the dynamic version.

const BULLETS = [
  "Fair, data-backed offers based on comparable sales in your neighborhood",
  "Close in as little as 7 days — or on your timeline",
  "No fees, no commissions, no closing costs charged to you",
  "No inspections, repairs, or financing contingencies required",
  "Real people, real answers — reach us anytime by phone or text"
];

export function LayerWhyZona() {
  return (
    <section
      aria-labelledby="why-zona-title"
      className="rounded-2xl border border-zona-purple-mid/15 bg-white p-6 shadow-sm md:p-8"
    >
      <h2
        id="why-zona-title"
        className="text-xs uppercase tracking-[0.3em] text-zona-purple-mid"
        style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
      >
        Why Zona Desert
      </h2>
      <p
        className="mt-2 text-2xl text-zona-navy md:text-3xl"
        style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
      >
        A fair offer. A clean close. No surprises.
      </p>

      <ul className="mt-6 space-y-3">
        {BULLETS.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-1 flex-shrink-0 text-zona-amber"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span
              className="text-base text-zona-navy/85"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
            >
              {bullet}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

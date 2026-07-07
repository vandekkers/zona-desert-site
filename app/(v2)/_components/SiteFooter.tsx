// SITE V2 — public site footer on the sand surface, four columns per
// the marketing kit. Only links to pages that actually exist.

import Link from "next/link";
import type { DealsConfig } from "../_lib/deal-shared";

const COLUMNS: Array<{ heading: string; links: Array<{ href: string; label: string }> }> = [
  {
    heading: "Platform",
    links: [
      { href: "/deals", label: "Browse Deals" },
      { href: "/sell", label: "Sell Your Property" },
      { href: "/buyers", label: "For Investors" },
      { href: "/how-it-works", label: "How It Works" }
    ]
  },
  {
    heading: "Work With Us",
    links: [
      { href: "/agents", label: "Agents" },
      { href: "/wholesalers", label: "Wholesalers" },
      { href: "/faq", label: "FAQ" },
      { href: "/about", label: "About" }
    ]
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/cookie-policy", label: "Cookie Policy" }
    ]
  }
];

export function SiteFooter({ config }: { config: DealsConfig }) {
  return (
    <footer className="bg-zona-sand px-5 pb-8 pt-16 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 border-b border-zona-navy/10 pb-8 md:grid-cols-[1.6fr_repeat(3,1fr)] md:gap-12">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand-v2/logo-horizontal.png"
            alt="Zona Desert"
            className="mb-4 h-[30px] w-auto"
          />
          <p className="max-w-[320px] text-sm leading-relaxed text-slate-600">
            Private-market opportunities curated for serious investors nationwide. Every deal
            underwritten before it hits the board.
          </p>
          <a
            href={`mailto:${config.email}`}
            className="mt-4 inline-block text-sm font-medium text-zona-purple-mid transition-colors hover:text-zona-purple-deep"
          >
            {config.email}
          </a>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <h4 className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.08em] text-zona-navy">
              {col.heading}
            </h4>
            {col.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mb-2.5 block text-sm text-slate-600 transition-colors hover:text-zona-purple-deep"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="mx-auto mt-6 flex w-full max-w-[1200px] flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Zona Desert Property Solutions LLC</span>
        <span>Operating Nationwide</span>
      </div>
    </footer>
  );
}

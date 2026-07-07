"use client";

// SITE V2 — public site shell header. Three balanced zones: brand lockup
// hard left, divided nav centered, live pill + the primary deal-board CTA
// hard right. The site's first job is routing buyers to the board.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/deals", label: "Deals" },
  { href: "/sell", label: "Sell" },
  { href: "/buyers", label: "Buyers" },
  { href: "/agents", label: "Agents" },
  { href: "/wholesalers", label: "Wholesalers" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" }
];

export function SiteHeader({ liveDeals }: { liveDeals: number }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zona-purple-deep/10 bg-zona-sand/85 backdrop-blur-[10px]">
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3.5 lg:px-10">
        <Link href="/" aria-label="Zona Desert home" onClick={() => setOpen(false)} className="justify-self-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand-v2/logo-horizontal.png"
            alt="Zona Desert"
            className="h-[32px] w-auto"
          />
        </Link>

        <nav className="hidden items-center justify-center justify-self-center xl:flex">
          {NAV_LINKS.map((link, index) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <span key={link.href} className="flex items-center">
                {index > 0 && <span className="mx-3.5 h-3.5 w-px bg-zona-navy/10" aria-hidden />}
                <Link
                  href={link.href}
                  className={`text-[15px] transition-colors ${
                    active
                      ? "font-semibold text-zona-purple-deep"
                      : "font-medium text-zona-navy/70 hover:text-zona-purple-deep"
                  }`}
                >
                  {link.label}
                </Link>
              </span>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3.5 justify-self-end xl:flex">
          {liveDeals > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-800/10 px-2.5 py-1 text-[11.5px] font-semibold text-green-800">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.25)]" />
              {liveDeals} Live
            </span>
          )}
          <Link
            href="/deals"
            className="rounded-lg bg-zona-purple-deep px-8 py-[10px] text-[15px] font-semibold text-white shadow-btn transition hover:bg-[#3D1570] hover:shadow-btn-hover"
          >
            View Live Deals
          </Link>
        </div>

        <button
          type="button"
          className="justify-self-end rounded-lg p-2 text-zona-navy xl:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            {open ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-zona-purple-deep/10 bg-zona-sand px-5 py-4 xl:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-[15px] font-medium text-zona-navy/80"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/deals"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-zona-purple-deep px-8 py-2.5 text-center text-[15px] font-semibold text-white shadow-btn"
            >
              View Live Deals
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

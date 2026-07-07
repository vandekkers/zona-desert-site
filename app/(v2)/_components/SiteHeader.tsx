"use client";

// SITE V2 — public site shell header. Sticky sand surface with blur,
// horizontal brand lockup, live-deal pill (real count, passed from the
// server layout), and the primary "Get An Offer" CTA.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/deals", label: "Deals" },
  { href: "/sell", label: "Sell" },
  { href: "/buyers", label: "For Investors" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" }
];

export function SiteHeader({ liveDeals }: { liveDeals: number }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zona-purple-deep/10 bg-zona-sand/85 backdrop-blur-[10px]">
      <div className="mx-auto flex w-full max-w-[1200px] items-center gap-6 px-5 py-3.5 lg:gap-9 lg:px-8">
        <Link href="/" aria-label="Zona Desert home" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand-v2/logo-horizontal.png"
            alt="Zona Desert"
            className="h-[30px] w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-zona-purple-deep" : "text-slate-600 hover:text-zona-purple-deep"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          {liveDeals > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-800/10 px-2.5 py-1 text-[11.5px] font-semibold text-green-800">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.25)]" />
              {liveDeals} Live {liveDeals === 1 ? "Deal" : "Deals"}
            </span>
          )}
          <Link
            href="/sell"
            className="rounded-lg bg-zona-purple-deep px-[18px] py-[9px] text-sm font-medium text-white shadow-btn transition hover:bg-[#3D1570] hover:shadow-btn-hover"
          >
            Get An Offer
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto rounded-lg p-2 text-zona-navy lg:hidden"
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
        <div className="border-t border-zona-purple-deep/10 bg-zona-sand px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-[15px] font-medium text-slate-700"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/sell"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-zona-purple-deep px-[18px] py-2.5 text-center text-sm font-medium text-white shadow-btn"
            >
              Get An Offer
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { href: "/listings", label: "Browse Deals" },
  { href: "/sell", label: "Sell" },
  { href: "/buyers/join", label: "Buyers" },
  { href: "/agents/apply", label: "Agents" },
  { href: "/wholesalers/apply", label: "Wholesalers" },
  { href: "/about", label: "About" }
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-slate-100 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link href="/" className="flex items-center gap-3 font-semibold text-slate-900">
          <Image src="/zona-wordmark-only.png" alt="Zona Desert" width={40} height={40} sizes="40px" />
          <span className="text-lg">Zona Desert</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-zona-purple">
              {link.label}
            </Link>
          ))}
          <Link
            href="/listings"
            className="rounded-full bg-zona-purple px-4 py-2 text-white shadow-md shadow-zona-purple/30"
          >
            Browse Deals
          </Link>
        </nav>

        <button
          className="md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle menu</span>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-4 text-sm font-medium text-slate-700">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link
              href="/listings"
              className="rounded-full bg-zona-purple px-4 py-2 text-center text-white"
              onClick={() => setIsOpen(false)}
            >
              Browse Deals
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

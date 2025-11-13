import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 text-sm text-slate-600 md:flex-row md:justify-between">
        <div>
          <p className="font-semibold text-slate-900">Zona Desert</p>
          <p className="mt-2 max-w-sm">Off-market opportunities curated for serious investors across the Southwest.</p>
          <p className="mt-4">hello@zonadesert.com • (602) 555-1212</p>
        </div>
        <div className="flex flex-1 justify-between gap-8 md:justify-end">
          <div>
            <p className="font-semibold text-slate-900">Company</p>
            <ul className="mt-2 space-y-2">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/how-it-works">How It Works</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Work With Us</p>
            <ul className="mt-2 space-y-2">
              <li><Link href="/listings">Browse Deals</Link></li>
              <li><Link href="/sell">Sell A Property</Link></li>
              <li><Link href="/buyers/join">Join Buyers</Link></li>
              <li><Link href="/agents/apply">Agents</Link></li>
              <li><Link href="/wholesalers/apply">Wholesalers</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-slate-100 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Zona Desert. All rights reserved.
      </div>
    </footer>
  );
}

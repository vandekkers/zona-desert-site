import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 text-sm text-white/80 md:flex-row md:justify-between">
        <div>
          <p className="font-semibold text-white">Zona Desert</p>
          <p className="mt-2 max-w-sm">Private-market opportunities curated for serious investors nationwide.</p>
          <p className="mt-4 text-white">info@zonadesert.com</p>
        </div>
        <div className="flex flex-1 justify-between gap-8 md:justify-end">
          <div>
            <p className="font-semibold text-white">Company</p>
            <ul className="mt-2 space-y-2">
              <li>
                <Link href="/about" className="transition hover:text-white hover:underline hover:underline-offset-4">
                  About
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="transition hover:text-white hover:underline hover:underline-offset-4">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition hover:text-white hover:underline hover:underline-offset-4">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white">Work With Us</p>
            <ul className="mt-2 space-y-2">
              <li>
                <Link href="/listings" className="transition hover:text-white hover:underline hover:underline-offset-4">
                  Browse Deals
                </Link>
              </li>
              <li>
                <Link href="/sell" className="transition hover:text-white hover:underline hover:underline-offset-4">
                  Sell A Property
                </Link>
              </li>
              <li>
                <Link href="/buyers/join" className="transition hover:text-white hover:underline hover:underline-offset-4">
                  Join Buyers
                </Link>
              </li>
              <li>
                <Link href="/agents/apply" className="transition hover:text-white hover:underline hover:underline-offset-4">
                  Agents
                </Link>
              </li>
              <li>
                <Link href="/wholesalers/apply" className="transition hover:text-white hover:underline hover:underline-offset-4">
                  Wholesalers
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-slate-900 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Zona Desert. All rights reserved.
      </div>
    </footer>
  );
}

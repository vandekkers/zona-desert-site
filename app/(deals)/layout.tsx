// BREAKAWAY: deals board — remove at platform launch
//
// Standalone shell for the /deals board. Deliberately does NOT reuse the
// (site) Header/Footer — this route group must be deletable in one move
// without touching platform components.

import Link from "next/link";
import { inter, sora } from "./_lib/deals";

export default function DealsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-zona-off-white text-slate-900" style={inter}>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/deals" className="text-lg text-zona-navy" style={sora}>
            <span className="text-zona-purple-mid">Zona</span> Desert.
          </Link>
          <span className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Deal Board
          </span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-6 text-sm text-slate-500">
          <p className="font-semibold text-slate-600">Deals by Zona Desert Property Solutions</p>
          <p className="text-xs">Every property is under contract or owned. Numbers are estimates — verify everything yourself.</p>
        </div>
      </footer>
    </div>
  );
}

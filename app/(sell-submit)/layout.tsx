import Link from "next/link";

export default function SellSubmitLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-slate-50">
      <header className="border-b border-slate-100 bg-white/90 px-4 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="font-semibold leading-tight text-slate-900">
            <span className="text-xl tracking-tight">
              <span className="text-zona-purple">Zona</span>{" "}
              <span className="text-slate-900">Desert.</span>
            </span>
          </Link>
          <Link href="/about" className="text-sm font-semibold text-slate-700 hover:text-zona-purple">
            Contact
          </Link>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

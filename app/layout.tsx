import type { Metadata } from "next";
import "./globals.css";
import { CookieConsentProvider } from "@/components/CookieConsentProvider";
export const metadata: Metadata = {
  title: "Zona Desert | Investor-First Real Estate Marketplace",
  description: "Curated private-market deals for buyers, investors, and creative finance pros nationwide."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-white to-slate-50">
        <CookieConsentProvider>
          {children}
        </CookieConsentProvider>
      </body>
    </html>
  );
}

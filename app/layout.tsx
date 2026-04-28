import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { CookieConsentProvider } from "@/components/CookieConsentProvider";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-sora",
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Zona Desert | Investor-First Real Estate Marketplace",
  description: "Curated private-market deals for buyers, investors, and creative finance pros nationwide."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="bg-gradient-to-b from-white to-slate-50">
        <CookieConsentProvider>
          {children}
        </CookieConsentProvider>
      </body>
    </html>
  );
}

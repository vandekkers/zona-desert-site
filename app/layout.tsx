import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookieConsentProvider } from "@/components/CookieConsentProvider";

// Sora is self-hosted per the Zona Desert design system (brand hierarchy
// only); Inter carries all functional UI. Same CSS variable names the
// whole codebase already references.
const sora = localFont({
  src: "./fonts/Sora-VariableFont_wght.ttf",
  variable: "--font-sora",
  display: "swap",
  weight: "100 800"
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zonadesert.com"),
  title: "Zona Desert | Off-Market Real Estate For Serious Investors",
  description:
    "Private-market deals, underwritten and vetted. Sellers get a real cash offer in 24 hours. Investors get off-market inventory with the numbers already run.",
  openGraph: {
    siteName: "Zona Desert",
    images: [{ url: "/brand-v2/hero-warm.jpg" }]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <CookieConsentProvider>
          {children}
        </CookieConsentProvider>
      </body>
    </html>
  );
}

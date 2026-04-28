import { NextRequest, NextResponse } from "next/server";
import { OWNER_COOKIE_NAME, verifyOwnerCookie } from "@/lib/owner-auth";

const BYPASS_PREFIXES = [
  "/__owner-access",
  "/api/__owner-access",
  "/coming-soon",
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/zona-",
  "/logo.png"
];

function shouldBypass(pathname: string): boolean {
  for (const prefix of BYPASS_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix)) return true;
  }
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (shouldBypass(pathname)) return NextResponse.next();

  const cookie = req.cookies.get(OWNER_COOKIE_NAME)?.value;
  const ok = await verifyOwnerCookie(cookie);
  if (ok) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/coming-soon";
  url.search = "";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

import { NextRequest, NextResponse } from "next/server";
import { OWNER_COOKIE_NAME, verifyOwnerCookie } from "@/lib/owner-auth";

// SITE V2: zonadesert.com is now a fully public marketing site. The old
// coming-soon wall (default-deny rewrite) is inverted — everything is
// public except the owner tools listed below. The owner-access cookie
// flow (/__owner-access + lib/owner-auth) is unchanged. See SITE_V2.md
// for how the pre-v2 wall worked and how to restore platform routes.
const OWNER_ONLY_PREFIXES = ["/deal-desk"];

function isOwnerOnly(pathname: string): boolean {
  for (const prefix of OWNER_ONLY_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return true;
  }
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!isOwnerOnly(pathname)) return NextResponse.next();

  const cookie = req.cookies.get(OWNER_COOKIE_NAME)?.value;
  const ok = await verifyOwnerCookie(cookie);
  if (ok) return NextResponse.next();

  // Strangers who stumble onto owner tools just get the public site.
  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

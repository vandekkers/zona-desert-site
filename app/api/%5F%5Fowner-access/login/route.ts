import { NextRequest, NextResponse } from "next/server";
import {
  OWNER_COOKIE_NAME,
  OWNER_COOKIE_MAX_AGE_SECONDS,
  signOwnerCookie,
  verifyPassword
} from "@/lib/owner-auth";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const DEFENSIVE_DELAY_MS = 250;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const password =
    typeof payload === "object" && payload !== null && typeof (payload as { password?: unknown }).password === "string"
      ? (payload as { password: string }).password
      : "";

  if (!password) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const [valid] = await Promise.all([verifyPassword(password), delay(DEFENSIVE_DELAY_MS)]);
  if (!valid) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const cookieValue = await signOwnerCookie();
  if (!cookieValue) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: OWNER_COOKIE_NAME,
    value: cookieValue,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: OWNER_COOKIE_MAX_AGE_SECONDS
  });
  return res;
}

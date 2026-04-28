import { NextResponse } from "next/server";
import { OWNER_COOKIE_NAME } from "@/lib/owner-auth";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: OWNER_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  return res;
}

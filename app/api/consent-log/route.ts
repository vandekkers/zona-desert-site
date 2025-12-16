import { NextRequest, NextResponse } from "next/server";

type IncomingPayload = {
  form_type: "sell" | "buyer" | "agent" | "wholesaler";
  consent_version: string;
  consent_text: string;
  marketing_opt_in: boolean;
  page_url?: string;
  email?: string;
  phone?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as IncomingPayload;
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const submittedAt = new Date().toISOString();

    const enriched = {
      ...body,
      submitted_at: submittedAt,
      ip_address: ip,
      user_agent: userAgent
    };

    const target = process.env.CONSENT_LOG_ENDPOINT;
    if (target) {
      await fetch(target, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enriched)
      });
    } else {
      console.log("CONSENT_AUDIT_LOG", JSON.stringify(enriched));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Consent log error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

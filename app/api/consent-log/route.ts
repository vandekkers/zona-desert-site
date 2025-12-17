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
    const forwardedFor = req.headers.get("x-forwarded-for");
    const clientIp =
      (forwardedFor ? forwardedFor.split(",")[0]?.trim() : null) ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const clientUserAgent = req.headers.get("user-agent") || "unknown";
    const submittedAt = new Date().toISOString();

    const enriched = {
      ...body,
      submitted_at: submittedAt,
      ip_address: clientIp,
      user_agent: clientUserAgent
    };

    const target = process.env.CONSENT_LOG_ENDPOINT;
    const token = process.env.CONSENT_LOG_TOKEN;

    if (target) {
      await fetch(target, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "X-Consent-Log-Token": token } : {}),
          "X-Client-IP": clientIp,
          "X-Client-User-Agent": clientUserAgent
        },
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

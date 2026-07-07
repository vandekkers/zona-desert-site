import { NextRequest, NextResponse } from "next/server";

// SITE V2 — lead capture pipe. Self-contained (no platform coupling):
// every intake-form submission POSTs here alongside the visitor's mailto
// compose, so leads are never only-in-an-email. When LEAD_LOG_ENDPOINT is
// set (e.g. the zona-admin intake API at platform launch, or any webhook)
// the enriched payload is forwarded; otherwise it lands in Vercel runtime
// logs under LEAD_LOG for retrieval.

type IncomingLead = {
  form_type: "sell" | "buyer" | "agent" | "wholesaler" | "quick-start";
  fields: Record<string, string>;
  page_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as IncomingLead;
    if (!body || typeof body !== "object" || !body.form_type) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const forwardedFor = req.headers.get("x-forwarded-for");
    const enriched = {
      ...body,
      submitted_at: new Date().toISOString(),
      ip_address:
        (forwardedFor ? forwardedFor.split(",")[0]?.trim() : null) ||
        req.headers.get("x-real-ip") ||
        "unknown",
      user_agent: req.headers.get("user-agent") || "unknown"
    };

    const target = process.env.LEAD_LOG_ENDPOINT;
    const token = process.env.LEAD_LOG_TOKEN;

    if (target) {
      await fetch(target, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "X-Lead-Log-Token": token } : {})
        },
        body: JSON.stringify(enriched)
      });
    } else {
      console.log("LEAD_LOG", JSON.stringify(enriched));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lead log error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

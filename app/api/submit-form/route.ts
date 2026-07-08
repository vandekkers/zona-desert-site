import { NextRequest, NextResponse } from "next/server";

// SITE V2 — form → admin database relay. Every site form POSTs here; the
// route maps the submission onto the FastAPI public-intake contracts and
// forwards it server-side (no CORS, no API URL in the browser). Nothing
// opens the visitor's mail or SMS app. If the backend is unreachable or
// rejects the payload, the enriched lead is still captured via the
// LEAD_LOG fallback (console + optional LEAD_LOG_ENDPOINT webhook) so a
// lead is never lost.

const API_BASE = (process.env.INTAKE_API_URL || "https://api.zonadesert.com").replace(/\/+$/, "");

type FormType = "sell" | "quick-start" | "buyer" | "agent" | "wholesaler" | "offer";

type Incoming = {
  form_type: FormType;
  fields: Record<string, string>;
  page_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

const CONSENT_VERSION = "2026-05-v1";
const SMS_CONSENT_TEXT =
  "By submitting, I agree to receive SMS messages from Zona Desert about my property offer and transaction. Msg & data rates may apply. Msg frequency varies. Reply STOP to opt out, HELP for help.";

function num(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function budgetToNumber(value: string | undefined): number | null {
  if (!value) return null;
  const m = value.match(/([\d.]+)\s*([kKmM]?)/);
  if (!m) return null;
  const base = Number(m[1]);
  if (!Number.isFinite(base)) return null;
  const mult = m[2].toLowerCase() === "m" ? 1_000_000 : m[2].toLowerCase() === "k" ? 1_000 : 1;
  return Math.round(base * mult);
}

function splitList(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// "123 Main St, Detroit, MI 48228" → parts; null when the line can't be
// confidently split (quick-start collects the address as one field).
function parseAddressLine(line: string): { address: string; city: string; state: string; zip: string } | null {
  const parts = line.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length < 3) return null;
  const tail = parts[parts.length - 1];
  const m = tail.match(/^([A-Za-z]{2})[,\s]+(\d{5})(?:-\d{4})?$/);
  if (!m) return null;
  return {
    address: parts.slice(0, parts.length - 2).join(", "),
    city: parts[parts.length - 2],
    state: m[1].toUpperCase(),
    zip: m[2]
  };
}

const consentBlock = (body: Incoming) => ({
  sms_consent: true,
  consent_version: CONSENT_VERSION,
  consent_text: SMS_CONSENT_TEXT,
  page_url: body.page_url ?? null,
  utm_source: body.utm_source ?? null,
  utm_medium: body.utm_medium ?? null,
  utm_campaign: body.utm_campaign ?? null,
  utm_content: body.utm_content ?? null,
  utm_term: body.utm_term ?? null
});

// Maps a submission onto the FastAPI public-intake wire contracts
// (mirrors the shelved lib/publicApi.ts, the proven platform-era shapes).
function mapToEndpoint(body: Incoming): { path: string; payload: Record<string, unknown> } | null {
  const f = body.fields;

  if (body.form_type === "sell") {
    return {
      path: "/public/sellers",
      payload: {
        name: f.name,
        email: f.email || null,
        phone: f.phone || null,
        address: f.address,
        city: f.city,
        state: f.state,
        zip: f.zip,
        beds: num(f.beds),
        baths: num(f.baths),
        sqft: num(f.sqft),
        condition: f.condition || null,
        timeline: f.timeline || null,
        property_type: f.propertyType || null,
        financing_situation: f.financingSituation || null,
        seller_type: "property-owner",
        notes: f.notes || null,
        ...consentBlock(body)
      }
    };
  }

  if (body.form_type === "quick-start") {
    const parsed = parseAddressLine(f.address ?? "");
    if (!parsed) return null; // unparseable one-line address → lead-log fallback
    return {
      path: "/public/sellers",
      payload: {
        name: f.name,
        email: null,
        phone: f.phone || null,
        ...parsed,
        beds: num(f.beds),
        baths: num(f.baths),
        sqft: num(f.sqft),
        condition: f.condition || null,
        seller_type: "property-owner",
        how_heard: "Landing page quick-start",
        ...consentBlock(body)
      }
    };
  }

  if (body.form_type === "buyer") {
    const strategies = splitList(f.strategies);
    const priceMin = budgetToNumber(f.budgetMin);
    const priceMax = budgetToNumber(f.budgetMax);
    const markets = f.markets ? [f.markets] : [];
    const notes = [
      f.timeline ? `Timeline: ${f.timeline}` : "",
      f.minReturn ? `Return target: ${f.minReturn}` : "",
      f.notes ?? ""
    ]
      .filter(Boolean)
      .join(" | ");
    const buyBox = {
      ...(markets.length ? { markets } : {}),
      ...(strategies.length ? { property_types: strategies } : {}),
      ...(priceMin != null ? { price_min: priceMin } : {}),
      ...(priceMax != null ? { price_max: priceMax } : {})
    };
    return {
      path: "/public/buyers",
      payload: {
        name: f.name,
        email: f.email,
        phone: f.phone,
        notes: notes || null,
        is_active: true,
        ...(Object.keys(buyBox).length ? { buy_box: buyBox } : {})
      }
    };
  }

  if (body.form_type === "agent") {
    const notes = [
      f.partnership ? `Partnership Focus: ${f.partnership}` : "",
      f.listingTypes ? `Listing Types: ${f.listingTypes}` : "",
      f.notes ?? ""
    ]
      .filter(Boolean)
      .join(" | ");
    return {
      path: "/public/agents",
      payload: {
        name: f.name,
        email: f.email,
        phone: f.phone || null,
        brokerage: f.brokerage || null,
        markets: splitList(f.markets),
        license: null,
        notes: notes || null
      }
    };
  }

  if (body.form_type === "wholesaler") {
    const notes = [f.wholesalerType ? `Type: ${f.wholesalerType}` : "", f.notes ?? ""]
      .filter(Boolean)
      .join(" | ");
    return {
      path: "/public/wholesalers",
      payload: {
        name: f.name,
        email: f.email,
        phone: f.phone || null,
        company: f.company || null,
        markets: splitList(f.states).length ? splitList(f.states) : null,
        notes: notes || null,
        avg_deals_per_month: num(f.dealsPerMonth),
        typical_assignment_fee: null
      }
    };
  }

  // "offer" has no backend endpoint yet — captured via lead-log below.
  return null;
}

export async function POST(req: NextRequest) {
  let body: Incoming;
  try {
    body = (await req.json()) as Incoming;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!body?.form_type || typeof body.fields !== "object" || body.fields === null) {
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

  // Audit copy always — console (Vercel logs) + optional webhook.
  console.log("LEAD_LOG", JSON.stringify(enriched));
  const webhook = process.env.LEAD_LOG_ENDPOINT;
  if (webhook) {
    fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.LEAD_LOG_TOKEN ? { "X-Lead-Log-Token": process.env.LEAD_LOG_TOKEN } : {})
      },
      body: JSON.stringify(enriched)
    }).catch(() => {});
  }

  // Primary: write into the admin database via the public intake API.
  const mapped = mapToEndpoint(body);
  if (mapped) {
    try {
      const res = await fetch(`${API_BASE}${mapped.path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapped.payload),
        signal: AbortSignal.timeout(15000)
      });
      if (res.ok) {
        return NextResponse.json({ ok: true, stored: "db" });
      }
      const detail = await res.text().catch(() => "");
      console.error("SUBMIT_FORM_API_REJECTED", body.form_type, res.status, detail.slice(0, 500));
    } catch (err) {
      console.error("SUBMIT_FORM_API_UNREACHABLE", body.form_type, String(err).slice(0, 200));
    }
  }

  // Lead survived via LEAD_LOG even when the DB write didn't happen.
  return NextResponse.json({ ok: true, stored: "log" });
}

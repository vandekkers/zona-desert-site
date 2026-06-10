import {
  AcceptRequest,
  AcceptResponse,
  AgentIntakePayload,
  BuyerIntakePayload,
  ContactResponse,
  CounterRequest,
  CounterResponse,
  PublicListingDetail,
  PublicOfferResponse,
  SellerLeadPayload,
  WholesalerIntakePayload,
  ZonaAgentChatErrorKind,
  ZonaAgentChatMessage,
  ZonaAgentChatReply
} from "./types";

export class PublicApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

const rawApiBase =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API ||
  "https://api.zonadesert.com";

const API_BASE_URL = rawApiBase.replace(/\/+$/, "");

type PublicBuyerCreatePayload = {
  name: string;
  email: string;
  phone?: string;
  company?: string | null;
  notes?: string;
  is_active?: boolean;
  buy_box?: {
    markets?: string[];
    property_types?: string[];
    price_min?: number | null;
    price_max?: number | null;
  };
};

function normalizePrice(value?: string): number | null {
  if (!value) return null;
  const cleaned = value.replace(/\+/g, "");
  const numeric = Number(cleaned);
  return Number.isFinite(numeric) ? numeric : null;
}

function mapMarkets(payload: BuyerIntakePayload): string[] {
  const markets: string[] = [];

  Object.entries(payload.countiesByState || {}).forEach(([state, counties]) => {
    if (!counties || counties.length === 0 || counties.includes("All Counties")) {
      markets.push(state);
      return;
    }
    counties.forEach((county) => markets.push(`${county}, ${state}`));
  });

  if (!markets.length && payload.states?.length) {
    markets.push(...payload.states);
  }

  if (payload.marketsDetail) {
    markets.push(payload.marketsDetail);
  }

  return markets;
}

function mapBuyBox(payload: BuyerIntakePayload): PublicBuyerCreatePayload["buy_box"] | undefined {
  const markets = mapMarkets(payload);
  const propertyTypes = (payload.strategies || []).filter((strategy) => strategy.toLowerCase() !== "any");
  const priceMin = normalizePrice(payload.budgetMin);
  const priceMax = normalizePrice(payload.budgetMax);

  const buyBox = {
    markets: markets.length ? markets : undefined,
    property_types: propertyTypes.length ? propertyTypes : undefined,
    price_min: priceMin,
    price_max: priceMax
  };

  if (!buyBox.markets && !buyBox.property_types && buyBox.price_min == null && buyBox.price_max == null) {
    return undefined;
  }

  return buyBox;
}

function buildNotes(payload: BuyerIntakePayload): string | undefined {
  const parts: string[] = [];
  if (payload.timeline) parts.push(`Timeline: ${payload.timeline}`);
  if (payload.minReturn) parts.push(`Return target: ${payload.minReturn}`);
  if (payload.marketsDetail) parts.push(`Markets focus: ${payload.marketsDetail}`);
  return parts.length ? parts.join(" | ") : undefined;
}

export async function createPublicBuyer(formValues: BuyerIntakePayload) {
  const requestBody: PublicBuyerCreatePayload = {
    name: formValues.name,
    email: formValues.email,
    phone: formValues.phone,
    notes: buildNotes(formValues),
    is_active: true,
    buy_box: mapBuyBox(formValues)
  };

  const res = await fetch(`${API_BASE_URL}/public/buyers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  });

  if (!res.ok) {
    const message = await res
      .json()
      .then((data) => (data && data.detail ? String(data.detail) : `Failed to create buyer: ${res.status}`))
      .catch(() => `Failed to create buyer: ${res.status}`);
    throw new PublicApiError(message, res.status);
  }

  return res.json();
}

// Sellers
type PublicSellerCreatePayload = {
  name: string;
  email?: string | null;
  phone?: string | null;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds?: number | null;
  baths?: number | null;
  condition?: string | null;
  timeline?: string | null;
  how_heard?: string | null;
  property_type?: string | null;
  financing_situation?: string | null;
  seller_type?: string | null;
  // Phase 5.compliance.a — SMS consent capture (10DLC).
  // snake_case keys mirror the backend SellerLeadPayload schema.
  sms_consent?: boolean;
  consent_version?: string;
  consent_text?: string;
  page_url?: string;
};

export async function createPublicSeller(formValues: SellerLeadPayload) {
  const payload: PublicSellerCreatePayload = {
    name: formValues.name,
    email: formValues.email || null,
    phone: formValues.phone || null,
    address: formValues.address,
    city: formValues.city,
    state: formValues.state,
    zip: formValues.zip,
    beds: formValues.beds ? Number(formValues.beds) || null : null,
    baths: formValues.baths ? Number(formValues.baths) || null : null,
    condition: formValues.condition || null,
    timeline: formValues.timeline || null,
    how_heard: formValues.heardAbout || null,
    property_type: formValues.propertyType || null,
    financing_situation: formValues.financingSituation || null,
    seller_type: formValues.sellerType || null,
    sms_consent: formValues.smsConsent ?? false,
    consent_version: formValues.consentVersion,
    consent_text: formValues.consentText,
    page_url: formValues.pageUrl
  };

  const res = await fetch(`${API_BASE_URL}/public/sellers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const message = await res
      .json()
      .then((data) => (data && data.detail ? String(data.detail) : `Failed to create seller lead: ${res.status}`))
      .catch(() => `Failed to create seller lead: ${res.status}`);
    throw new PublicApiError(message, res.status);
  }

  return res.json();
}

// Agents
type PublicAgentCreatePayload = {
  name: string;
  email: string;
  phone?: string | null;
  brokerage?: string | null;
  markets: string[];
  license?: string | null;
  notes?: string | null;
};

export async function createPublicAgent(formValues: AgentIntakePayload) {
  const marketsList = formValues.markets
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  const extraNotes: string[] = [];
  if (formValues.partnershipFocus?.length) {
    extraNotes.push(`Partnership Focus: ${formValues.partnershipFocus.join(", ")}`);
  }
  if (formValues.listingTypes?.length) {
    extraNotes.push(`Listing Types: ${formValues.listingTypes.join(", ")}`);
  }
  if (formValues.notes) {
    extraNotes.push(formValues.notes);
  }

  const payload: PublicAgentCreatePayload = {
    name: formValues.name,
    email: formValues.email,
    phone: formValues.phone,
    brokerage: formValues.brokerage || null,
    markets: marketsList,
    license: null,
    notes: extraNotes.length ? extraNotes.join(" | ") : null
  };

  const res = await fetch(`${API_BASE_URL}/public/agents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const message = await res
      .json()
      .then((data) => (data && data.detail ? String(data.detail) : `Failed to create agent: ${res.status}`))
      .catch(() => `Failed to create agent: ${res.status}`);
    throw new PublicApiError(message, res.status);
  }

  return res.json();
}

// Wholesalers
type PublicWholesalerCreatePayload = {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  markets?: string[] | null;
  notes?: string | null;
  avg_deals_per_month?: number | null;
  typical_assignment_fee?: number | null;
};

function mapWholesalerMarkets(formValues: WholesalerIntakePayload): string[] {
  const markets: string[] = [];
  Object.entries(formValues.countiesByState || {}).forEach(([state, counties]) => {
    if (!counties || counties.length === 0 || counties.includes("All Counties")) {
      markets.push(state);
      return;
    }
    counties.forEach((county) => markets.push(`${county}, ${state}`));
  });
  if (!markets.length && formValues.states?.length) {
    markets.push(...formValues.states);
  }
  return markets;
}

export async function createPublicWholesaler(formValues: WholesalerIntakePayload) {
  const markets = mapWholesalerMarkets(formValues);
  const extraNotes: string[] = [];
  if (formValues.wholesalerType) {
    extraNotes.push(`Type: ${formValues.wholesalerType}`);
  }
  if (formValues.notes) {
    extraNotes.push(formValues.notes);
  }

  const payload: PublicWholesalerCreatePayload = {
    name: formValues.name,
    email: formValues.email,
    phone: formValues.phone || null,
    company: formValues.company || null,
    markets: markets.length ? markets : null,
    notes: extraNotes.length ? extraNotes.join(" | ") : null,
    avg_deals_per_month: formValues.dealsPerMonth ? Number(formValues.dealsPerMonth) || null : null,
    typical_assignment_fee: null
  };

  const res = await fetch(`${API_BASE_URL}/public/wholesalers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const message = await res
      .json()
      .then((data) => (data && data.detail ? String(data.detail) : `Failed to create wholesaler: ${res.status}`))
      .catch(() => `Failed to create wholesaler: ${res.status}`);
    throw new PublicApiError(message, res.status);
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Public Offer Portal (Phase 4.5.g)
//
// Fetches GET /offers/{token} from the seller-facing public endpoint.
// Server Component caller — cache: "no-store" because token state can
// change between requests (JIT expiration at the backend). 404 returns
// null so the caller can dispatch to Next.js notFound().
// ---------------------------------------------------------------------------

export async function fetchPublicOffer(token: string): Promise<PublicOfferResponse | null> {
  const res = await fetch(`${API_BASE_URL}/offers/${encodeURIComponent(token)}`, {
    cache: "no-store"
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new PublicApiError(`Failed to fetch offer: ${res.status}`, res.status);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Public Offer Portal actions (Phase 4.5.i)
//
// POST /offers/{token}/{accept,counter,contact}. Token URL-encoded per PR #12
// Drift #3. Backend returns 400 with structured {detail: string} on every
// failure mode (state conflict / identity mismatch / phone missing).
// Pydantic 422 returns {detail: [{loc, msg, type}]} — extractDetail handles
// both shapes. Network errors throw PublicApiError with a generic message
// so callers can surface a retry-friendly UI hint.
// ---------------------------------------------------------------------------

async function extractDetail(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    if (data && typeof data.detail === "string") return data.detail;
    if (Array.isArray(data?.detail) && data.detail.length > 0) {
      const first = data.detail[0];
      if (first && typeof first.msg === "string") return first.msg;
    }
  } catch {
    // fall through to fallback
  }
  return fallback;
}

export async function acceptOffer(
  token: string,
  payload: AcceptRequest
): Promise<AcceptResponse> {
  const res = await fetch(`${API_BASE_URL}/offers/${encodeURIComponent(token)}/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const message = await extractDetail(res, `Failed to accept offer: ${res.status}`);
    throw new PublicApiError(message, res.status);
  }
  return res.json();
}

export async function counterOffer(
  token: string,
  payload: CounterRequest
): Promise<CounterResponse> {
  const res = await fetch(`${API_BASE_URL}/offers/${encodeURIComponent(token)}/counter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const message = await extractDetail(res, `Failed to submit counter: ${res.status}`);
    throw new PublicApiError(message, res.status);
  }
  return res.json();
}

export async function contactZona(token: string): Promise<ContactResponse> {
  const res = await fetch(`${API_BASE_URL}/offers/${encodeURIComponent(token)}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: "{}"
  });
  if (!res.ok) {
    const message = await extractDetail(res, `Failed to request contact: ${res.status}`);
    throw new PublicApiError(message, res.status);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Public Listing Detail (Phase 5.5.a)
//
// Fetches GET /public/listings/{slug} from the public marketplace
// endpoint. Server Component caller — cache: "no-store" because
// listing status can change between requests (e.g. a published
// ACTIVE listing transitions to SOLD). 404 returns null so the
// caller can dispatch to Next.js notFound().
// ---------------------------------------------------------------------------

export async function fetchPublicListing(
  slug: string
): Promise<PublicListingDetail | null> {
  const res = await fetch(
    `${API_BASE_URL}/public/listings/${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new PublicApiError(`Failed to fetch listing: ${res.status}`, res.status);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Zona Agent public listing chat (Phase 5.5.c)
//
// POST /public/listings/{slug}/chat — stateless, client-held history.
// Backend caps: ≤12 messages, ≤1,000 chars per message, ≤8,000 total
// (Pydantic schema layer). Per-IP rate limit 10/min (PR #200 limiter).
//
// Error classification: ZonaAgentChatError carries a typed ``kind`` the
// widget reads to render state-specific copy. 503 → offline, 502 →
// unavailable, 429 → rate_limited. Backend never returns raw 500;
// network/parse failures bubble up as kind="network".
// ---------------------------------------------------------------------------

export class ZonaAgentChatError extends Error {
  kind: ZonaAgentChatErrorKind;
  status?: number;

  constructor(kind: ZonaAgentChatErrorKind, message: string, status?: number) {
    super(message);
    this.kind = kind;
    this.status = status;
  }
}

function classifyChatStatus(status: number): ZonaAgentChatErrorKind {
  if (status === 503) return "offline";
  if (status === 502) return "unavailable";
  if (status === 429) return "rate_limited";
  if (status === 404) return "not_found";
  if (status === 422) return "validation";
  return "unavailable";
}

export async function sendListingChat(
  slug: string,
  messages: ZonaAgentChatMessage[]
): Promise<ZonaAgentChatReply> {
  let res: Response;
  try {
    res = await fetch(
      `${API_BASE_URL}/public/listings/${encodeURIComponent(slug)}/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ messages })
      }
    );
  } catch (err) {
    throw new ZonaAgentChatError("network", err instanceof Error ? err.message : "network");
  }

  if (!res.ok) {
    throw new ZonaAgentChatError(
      classifyChatStatus(res.status),
      `chat request failed: ${res.status}`,
      res.status
    );
  }

  try {
    return (await res.json()) as ZonaAgentChatReply;
  } catch {
    throw new ZonaAgentChatError("unavailable", "malformed reply", res.status);
  }
}

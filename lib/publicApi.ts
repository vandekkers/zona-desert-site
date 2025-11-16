import {
  AgentIntakePayload,
  BuyerIntakePayload,
  SellerLeadPayload,
  WholesalerIntakePayload
} from "./types";

export class PublicApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
    seller_type: formValues.sellerType || null
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

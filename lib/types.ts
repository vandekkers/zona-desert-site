export interface ListingCard {
  id: string;
  slug: string;
  address?: string;
  zip?: string;
  title: string;
  city: string;
  state: string;
  price: number;
  estRent?: number;
  capRate?: number;
  arv?: number;
  tags: string[];
  thumbnailUrl: string;
  strategy?: string;
  marketStatus: "on-market" | "off-market";
}

export interface ListingDetail extends ListingCard {
  beds?: number;
  baths?: number;
  sqft?: number;
  lotSize?: number;
  yearBuilt?: number;
  rehabLevel?: string;
  estRepairCost?: number;
  tenantStatus?: string;
  photos: string[];
  description: string;
  highlights?: string[];
  comps?: Array<{
    address: string;
    city: string;
    state: string;
    beds?: number;
    baths?: number;
    sqft?: number;
    soldPrice: number;
    soldDate: string;
    distanceMiles?: number;
  }>;
  financials?: {
    purchasePrice: number;
    rehabBudget?: number;
    estRent: number;
    capRate?: number;
    cashOnCash?: number;
    arv?: number;
  };
  structure?: {
    type: "cash" | "seller-finance";
    downPayment?: number;
    interestRate?: number;
    termMonths?: number;
  };
}

export interface ListingQueryParams {
  q?: string;
  state?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
  beds_min?: number;
  baths_min?: number;
  property_type?: string;
  tenant_status?: string;
  strategy?: string;
  min_cap_rate?: number;
  tags?: string[];
}

export interface SellerLeadPayload {
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string;
  beds: string;
  baths: string;
   sqft: string;
  condition: string;
  timeline: string;
  financingSituation: string;
  sellerType: "property-owner" | "real-estate-agent" | "wholesaler" | "other";
  name: string;
  email: string;
  phone: string;
  heardAbout?: string;
  notes?: string;
}

export interface BuyerIntakePayload {
  name: string;
  email: string;
  phone: string;
  state: string;
  county: string;
  states: string[];
  countiesByState: Record<string, string[]>;
  marketsDetail?: string;
  budgetMin?: string;
  budgetMax?: string;
  strategies: string[];
  minReturn?: string;
  timeline: string;
}

export interface AgentIntakePayload {
  name: string;
  email: string;
  phone: string;
  brokerage?: string;
  markets: string;
  partnershipFocus: string[];
  listingTypes: string[];
  notes?: string;
}

export interface WholesalerIntakePayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  wholesalerType: string;
  states: string[];
  countiesByState: Record<string, string[]>;
  dealsPerMonth?: string;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Public Offer Portal types (Phase 4.5.g)
//
// Mirror of backend Pydantic schemas in zona-admin at
// apps/api/app/schemas/public_offer.py per Scar #24. Decimal columns on the
// backend serialize as JSON strings via Pydantic V2 — typed `string | null`
// on the wire. The portal UI handles string→number coercion at the
// presentation boundary.
// ---------------------------------------------------------------------------

export type PublicOfferStatus = "active" | "expired" | "accepted" | "countered" | "revoked";

export interface PublicOfferAmount {
  target_offer: string;
  bucket_scores: Array<Record<string, unknown>>;
}

export interface PublicPropertyFacts {
  year_built: number | null;
  bedrooms: number | null;
  bathrooms: string | null;
  sqft: number | null;
  lot_size: string | null;
  repair_level: string | null;
}

export interface PublicComp {
  street_block: string;
  sold_price: string | null;
  sale_date: string | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  distance_miles: number | null;
  sale_type: string | null;
}

export interface PublicExitStrategy {
  arv_estimate_low: string | null;
  arv_estimate_high: string | null;
  estimated_rental_monthly: string | null;
}

export interface PublicOfferResponse {
  status: PublicOfferStatus;
  expires_at: string;
  offer: PublicOfferAmount | null;
  property_facts: PublicPropertyFacts | null;
  comps: PublicComp[] | null;
  exit_strategy: PublicExitStrategy | null;
  accepted_at: string | null;
  countered_at: string | null;
  counter_amount: string | null;
}

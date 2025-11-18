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

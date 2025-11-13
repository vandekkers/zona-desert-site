export interface ListingCard {
  id: string;
  slug: string;
  title: string;
  city: string;
  state: string;
  price: number;
  estRent?: number;
  capRate?: number;
  tags: string[];
  thumbnailUrl: string;
  strategy?: string;
}

export interface ListingDetail extends ListingCard {
  beds?: number;
  baths?: number;
  sqft?: number;
  lotSize?: number;
  photos: string[];
  description: string;
  highlights?: string[];
  financials?: {
    purchasePrice: number;
    rehabBudget?: number;
    estRent: number;
    capRate?: number;
    cashOnCash?: number;
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
  tags?: string[];
}

export interface SellerLeadPayload {
  address: string;
  city: string;
  state: string;
  zip: string;
  beds?: string;
  baths?: string;
  condition?: string;
  timeline?: string;
  name: string;
  email: string;
  phone?: string;
  heardAbout?: string;
}

export interface BuyerIntakePayload {
  name: string;
  email: string;
  phone?: string;
  markets: string;
  priceRange: string;
  strategy: string;
  timeline: string;
}

export interface AgentIntakePayload {
  name: string;
  email: string;
  phone?: string;
  brokerage: string;
  license: string;
  markets: string;
  partnershipIntent: string;
}

export interface WholesalerIntakePayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  markets: string;
  dealsPerMonth: string;
  averageAssignmentFee?: string;
  notes?: string;
}

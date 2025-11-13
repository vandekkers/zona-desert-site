import {
  AgentIntakePayload,
  BuyerIntakePayload,
  ListingCard,
  ListingDetail,
  ListingQueryParams,
  SellerLeadPayload,
  WholesalerIntakePayload
} from "./types";
import { mockListingDetail, mockListings } from "./mockData";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

type ListingsResponse = { items: ListingCard[]; total: number };

async function maybeFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}${path}`, init);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return (await res.json()) as T;
  } catch (error) {
    console.warn(`API fallback for ${path}`, error);
    return null;
  }
}

export async function fetchListings(params: ListingQueryParams = {}): Promise<ListingsResponse> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach((v) => query.append(key, v));
    } else {
      query.set(key, String(value));
    }
  });
  const queryString = query.toString();
  const response = await maybeFetch<ListingsResponse>(`/public/listings${queryString ? `?${queryString}` : ""}`);

  if (response) return response;
  return { items: mockListings, total: mockListings.length };
}

export async function fetchListing(slugOrId: string): Promise<ListingDetail> {
  const response = await maybeFetch<ListingDetail>(`/public/listings/${slugOrId}`);
  if (response) return response;
  const base = mockListings.find((listing) => listing.slug === slugOrId || listing.id === slugOrId) ?? mockListings[0];
  return { ...mockListingDetail, ...base };
}

async function submitForm<TPayload>(path: string, payload: TPayload): Promise<void> {
  const res = await maybeFetch<unknown>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res) {
    // Pretend success locally
    console.info(`Mock submit for ${path}`, payload);
  }
}

export const submitSellerLead = (payload: SellerLeadPayload) => submitForm("/public/forms/seller-lead", payload);
export const submitBuyerIntake = (payload: BuyerIntakePayload) => submitForm("/public/forms/buyer-intake", payload);
export const submitAgentIntake = (payload: AgentIntakePayload) => submitForm("/public/forms/agent-intake", payload);
export const submitWholesalerIntake = (payload: WholesalerIntakePayload) =>
  submitForm("/public/forms/wholesaler-intake", payload);

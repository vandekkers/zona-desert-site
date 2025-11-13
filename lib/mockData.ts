import { ListingCard, ListingDetail } from "./types";

export const mockListings: ListingCard[] = [
  {
    id: "1",
    slug: "arcadia-midcentury-triplex",
    title: "Arcadia Midcentury Triplex",
    city: "Phoenix",
    state: "AZ",
    price: 865000,
    estRent: 6200,
    capRate: 7.8,
    tags: ["value-add", "luxury", "sfh"],
    thumbnailUrl: "/hero-bg.png",
    strategy: "Value-Add"
  },
  {
    id: "2",
    slug: "tempe-townhome-portfolio",
    title: "Tempe Townhome Portfolio",
    city: "Tempe",
    state: "AZ",
    price: 1195000,
    estRent: 9400,
    capRate: 8.2,
    tags: ["turnkey", "student", "portfolio"],
    thumbnailUrl: "/hero-bg.png",
    strategy: "Turnkey"
  },
  {
    id: "3",
    slug: "flagstaff-short-term",
    title: "Flagstaff Short-Term Cabin",
    city: "Flagstaff",
    state: "AZ",
    price: 645000,
    estRent: 7200,
    capRate: 9.1,
    tags: ["brrrr", "short-term"],
    thumbnailUrl: "/hero-bg.png",
    strategy: "STR"
  }
];

export const mockListingDetail: ListingDetail = {
  ...mockListings[0],
  beds: 6,
  baths: 4.5,
  sqft: 3600,
  lotSize: 0.25,
  photos: ["/hero-bg.png", "/hero-bg.png", "/hero-bg.png"],
  description:
    "Stunning midcentury triplex in Arcadia Lite with designer upgrades already underway. Perfect for luxury mid-term or furnished rentals.",
  highlights: [
    "Seller-financing available with 10% down",
    "Projected 25%+ cash-on-cash in year one",
    "Fully permitted additions and carports"
  ],
  financials: {
    purchasePrice: 865000,
    estRent: 6200,
    capRate: 7.8,
    cashOnCash: 0.23
  },
  structure: {
    type: "seller-finance",
    downPayment: 0.1,
    interestRate: 5.5,
    termMonths: 120
  }
};

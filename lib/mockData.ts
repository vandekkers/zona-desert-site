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
    arv: 1150000,
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
    arv: 1525000,
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
    arv: 880000,
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
  yearBuilt: 1964,
  rehabLevel: "Light Updates",
  estRepairCost: 85000,
  tenantStatus: "Vacant",
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
    cashOnCash: 0.23,
    arv: 1150000
  },
  structure: {
    type: "seller-finance",
    downPayment: 0.1,
    interestRate: 5.5,
    termMonths: 120
  },
  comps: [
    {
      address: "4100 E Glenrosa Ave",
      city: "Phoenix",
      state: "AZ",
      beds: 4,
      baths: 3,
      sqft: 2900,
      soldPrice: 1125000,
      soldDate: "2023-10-01",
      distanceMiles: 0.4
    },
    {
      address: "3023 N 46th St",
      city: "Phoenix",
      state: "AZ",
      beds: 5,
      baths: 3,
      sqft: 3200,
      soldPrice: 1180000,
      soldDate: "2023-08-19",
      distanceMiles: 0.9
    },
    {
      address: "4702 E Cambridge Ave",
      city: "Phoenix",
      state: "AZ",
      beds: 6,
      baths: 4,
      sqft: 3500,
      soldPrice: 1245000,
      soldDate: "2023-06-30",
      distanceMiles: 1.4
    }
  ]
};

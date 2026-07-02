// BREAKAWAY: deals board — remove at platform launch
//
// Client-safe deal types, formatters, and investment math. NO fs/node
// imports here — this module is shared by the deal-desk form (client)
// and the server pages. The fs-backed loader lives in ./deals.ts.

export type DealStatus = "available" | "pending" | "sold";
export type DealStrategy = "rental" | "flip";

export interface DealRental {
  monthlyRent: number;
  otherIncomeMonthly?: number;
  taxesAnnual?: number;
  insuranceAnnual?: number;
  hoaMonthly?: number;
  utilitiesMonthly?: number;
  managementPct?: number; // % of collected rent — defaults below
  maintenancePct?: number;
  vacancyPct?: number;
  currentlyRented?: boolean;
  leaseEnds?: string;
  section8?: boolean;
}

export interface DealFinancing {
  downPct?: number;
  ratePct?: number;
  termYears?: number;
  closingPct?: number; // % of price, cash-to-close estimate
}

export interface DealTerms {
  emd?: number;
  closeMethod?: string; // "Assignment" | "Double close" | ...
  access?: string; // "Lockbox" | "By appointment" | ...
  titleCompany?: string;
}

export interface DealComp {
  address: string;
  price: number;
  note?: string;
  url?: string;
}

export interface Deal {
  id: string;
  status: DealStatus;
  strategy?: DealStrategy[]; // defaults to ["flip"] if omitted
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  arv: number;
  estRehab: number;
  beds: number;
  baths: number;
  sqft: number;
  lotSqft: number;
  yearBuilt: number;
  description: string;
  highlights: string[];
  photos: string[];
  rental?: DealRental;
  financing?: DealFinancing;
  terms?: DealTerms;
  comps?: DealComp[];
  closeBy?: string;
  featured?: boolean;
  propertyType?: string;
  occupancy?: string;
}

export interface DealsConfig {
  phone: string;
  email: string;
  headline: string;
  subhead: string;
  repo: string; // "owner/name" — used by the deal desk GitHub links
}

// Conservative underwriting defaults — every defaulted value is labeled
// "est." in the UI so pros can see which numbers are assumptions.
export const RENTAL_DEFAULTS = {
  vacancyPct: 8,
  maintenancePct: 10,
  managementPct: 10
} as const;

export const FINANCING_DEFAULTS = {
  downPct: 25,
  ratePct: 7.5,
  termYears: 30,
  closingPct: 2
} as const;

export function dealStrategies(deal: Pick<Deal, "strategy" | "rental">): DealStrategy[] {
  if (deal.strategy && deal.strategy.length > 0) return deal.strategy;
  return deal.rental ? ["rental", "flip"] : ["flip"];
}

export function money(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "−" : "";
  return `${sign}$${Math.abs(rounded).toLocaleString("en-US")}`;
}

// Compact money for chips/cards: $31k, $1.2M
export function moneyCompact(value: number): string {
  const sign = value < 0 ? "−" : "";
  const abs = Math.abs(Math.round(value));
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}k`;
  return `${sign}$${abs}`;
}

export function formatCloseBy(closeBy: string): string {
  const date = new Date(`${closeBy}T00:00:00`);
  if (Number.isNaN(date.getTime())) return closeBy;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ---------------------------------------------------------------------------
// Flip math
// ---------------------------------------------------------------------------

export interface FlipMath {
  allIn: number;
  spread: number;
  flipRoiPct: number | null; // spread / all-in
  pctOfArv: number | null; // all-in as % of ARV (70%-rule check)
  priceShare: number;
  rehabShare: number;
  spreadShare: number;
  pricePerSqft: number | null;
  arvPerSqft: number | null;
  rehabPerSqft: number | null;
}

export function flipMath(deal: Deal): FlipMath {
  const allIn = deal.price + deal.estRehab;
  const spread = deal.arv - allIn;
  const shareOfArv = (part: number) =>
    deal.arv > 0 ? Math.max(0, Math.min(100, Math.round((part / deal.arv) * 100))) : 0;
  return {
    allIn,
    spread,
    flipRoiPct: allIn > 0 ? Math.round((spread / allIn) * 1000) / 10 : null,
    pctOfArv: deal.arv > 0 ? Math.round((allIn / deal.arv) * 100) : null,
    priceShare: shareOfArv(deal.price),
    rehabShare: shareOfArv(deal.estRehab),
    spreadShare: shareOfArv(spread),
    pricePerSqft: deal.sqft > 0 ? Math.round(deal.price / deal.sqft) : null,
    arvPerSqft: deal.sqft > 0 ? Math.round(deal.arv / deal.sqft) : null,
    rehabPerSqft: deal.sqft > 0 ? Math.round(deal.estRehab / deal.sqft) : null
  };
}

// ---------------------------------------------------------------------------
// Rental math
// ---------------------------------------------------------------------------

export interface RentalExpenseLine {
  label: string;
  annual: number;
  assumed: boolean; // true when the value came from a default, not the JSON
}

export interface RentalMath {
  grossAnnual: number;
  vacancyPct: number;
  vacancyAnnual: number;
  effectiveGross: number;
  expenses: RentalExpenseLine[];
  totalExpenses: number;
  noi: number;
  capRatePct: number | null; // NOI / asking price
  capRateAllInPct: number | null; // NOI / (price + rehab)
  cashFlowMonthly: number; // unlevered, NOI / 12
  grm: number | null; // price / gross annual
  rentToPricePct: number | null; // monthly rent / price
  expenseRatioPct: number | null; // expenses / EGI
  usedDefaults: boolean;
}

export function rentalMath(deal: Deal): RentalMath | null {
  const r = deal.rental;
  if (!r || r.monthlyRent <= 0) return null;

  const vacancyPct = r.vacancyPct ?? RENTAL_DEFAULTS.vacancyPct;
  const managementPct = r.managementPct ?? RENTAL_DEFAULTS.managementPct;
  const maintenancePct = r.maintenancePct ?? RENTAL_DEFAULTS.maintenancePct;
  const usedDefaults =
    r.vacancyPct === undefined ||
    r.managementPct === undefined ||
    r.maintenancePct === undefined;

  const grossAnnual = (r.monthlyRent + (r.otherIncomeMonthly ?? 0)) * 12;
  const vacancyAnnual = Math.round(grossAnnual * (vacancyPct / 100));
  const effectiveGross = grossAnnual - vacancyAnnual;

  const expenses: RentalExpenseLine[] = [];
  if (r.taxesAnnual) expenses.push({ label: "Property taxes", annual: r.taxesAnnual, assumed: false });
  if (r.insuranceAnnual) expenses.push({ label: "Insurance", annual: r.insuranceAnnual, assumed: false });
  if (r.hoaMonthly) expenses.push({ label: "HOA", annual: r.hoaMonthly * 12, assumed: false });
  if (r.utilitiesMonthly)
    expenses.push({ label: "Owner-paid utilities", annual: r.utilitiesMonthly * 12, assumed: false });
  expenses.push({
    label: `Management (${managementPct}%)`,
    annual: Math.round(effectiveGross * (managementPct / 100)),
    assumed: r.managementPct === undefined
  });
  expenses.push({
    label: `Maintenance & capex (${maintenancePct}%)`,
    annual: Math.round(effectiveGross * (maintenancePct / 100)),
    assumed: r.maintenancePct === undefined
  });

  const totalExpenses = expenses.reduce((sum, line) => sum + line.annual, 0);
  const noi = effectiveGross - totalExpenses;
  const allIn = deal.price + deal.estRehab;

  return {
    grossAnnual,
    vacancyPct,
    vacancyAnnual,
    effectiveGross,
    expenses,
    totalExpenses,
    noi,
    capRatePct: deal.price > 0 ? Math.round((noi / deal.price) * 1000) / 10 : null,
    capRateAllInPct: allIn > 0 ? Math.round((noi / allIn) * 1000) / 10 : null,
    cashFlowMonthly: Math.round(noi / 12),
    grm: grossAnnual > 0 ? Math.round((deal.price / grossAnnual) * 10) / 10 : null,
    rentToPricePct:
      deal.price > 0 ? Math.round((r.monthlyRent / deal.price) * 1000) / 10 : null,
    expenseRatioPct:
      effectiveGross > 0 ? Math.round((totalExpenses / effectiveGross) * 100) : null,
    usedDefaults
  };
}

// ---------------------------------------------------------------------------
// Financed scenario (rental) — always labeled as assumptions in the UI
// ---------------------------------------------------------------------------

export interface FinancedScenario {
  downPct: number;
  ratePct: number;
  termYears: number;
  closingPct: number;
  downPayment: number;
  loanAmount: number;
  monthlyPI: number;
  cashInvested: number; // down + rehab + closing estimate
  cashFlowMonthly: number; // NOI/12 − P&I
  cashOnCashPct: number | null;
  dscr: number | null;
}

export function financedScenario(deal: Deal, rental: RentalMath): FinancedScenario {
  const f = deal.financing ?? {};
  const downPct = f.downPct ?? FINANCING_DEFAULTS.downPct;
  const ratePct = f.ratePct ?? FINANCING_DEFAULTS.ratePct;
  const termYears = f.termYears ?? FINANCING_DEFAULTS.termYears;
  const closingPct = f.closingPct ?? FINANCING_DEFAULTS.closingPct;

  const downPayment = Math.round(deal.price * (downPct / 100));
  const loanAmount = deal.price - downPayment;
  const monthlyRate = ratePct / 100 / 12;
  const n = termYears * 12;
  const monthlyPI =
    monthlyRate > 0
      ? Math.round(
          (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
            (Math.pow(1 + monthlyRate, n) - 1)
        )
      : Math.round(loanAmount / n);

  const annualDebtService = monthlyPI * 12;
  const cashInvested = downPayment + deal.estRehab + Math.round(deal.price * (closingPct / 100));
  const cashFlowMonthly = Math.round(rental.noi / 12 - monthlyPI);

  return {
    downPct,
    ratePct,
    termYears,
    closingPct,
    downPayment,
    loanAmount,
    monthlyPI,
    cashInvested,
    cashFlowMonthly,
    cashOnCashPct:
      cashInvested > 0
        ? Math.round(((rental.noi - annualDebtService) / cashInvested) * 1000) / 10
        : null,
    dscr: annualDebtService > 0 ? Math.round((rental.noi / annualDebtService) * 100) / 100 : null
  };
}

export function googleMapsHref(deal: Deal): string {
  const query = encodeURIComponent(
    `${deal.address}, ${deal.city}, ${deal.state} ${deal.zip}`
  );
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

// Brand fonts are loaded once in the root layout as CSS variables; the
// repo idiom applies them via inline style.
export const sora = {
  fontFamily: "var(--font-sora), system-ui, sans-serif",
  fontWeight: 600
} as const;

export const inter = {
  fontFamily: "var(--font-inter), system-ui, sans-serif"
} as const;

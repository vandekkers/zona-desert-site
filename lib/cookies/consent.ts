"use client";

export type ConsentCategories = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentCookie = {
  consent_version: string;
  consent: Pick<ConsentCategories, "analytics" | "marketing">;
  updated_at: string;
};

const CONSENT_COOKIE_NAME = "zd_cookie_consent";
export const CONSENT_VERSION = "v1";
const COOKIE_MAX_AGE_DAYS = 180;

const defaultConsentCookie: ConsentCookie = {
  consent_version: CONSENT_VERSION,
  consent: {
    analytics: false,
    marketing: false
  },
  updated_at: new Date().toISOString()
};

function parseCookie(raw: string): ConsentCookie | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.consent) return null;
    return parsed as ConsentCookie;
  } catch {
    return null;
  }
}

function serializeCookie(value: ConsentCookie): string {
  return encodeURIComponent(JSON.stringify(value));
}

function getDocumentCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? match[1] : null;
}

function setDocumentCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

function deleteDocumentCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export function getConsent(): ConsentCookie {
  const raw = getDocumentCookie(CONSENT_COOKIE_NAME);
  if (!raw) return { ...defaultConsentCookie };
  const parsed = parseCookie(raw);
  if (!parsed) return { ...defaultConsentCookie };
  if (parsed.consent_version !== CONSENT_VERSION) return { ...defaultConsentCookie };
  return parsed;
}

export function setConsent(consent: Pick<ConsentCategories, "analytics" | "marketing">) {
  const value: ConsentCookie = {
    consent_version: CONSENT_VERSION,
    consent,
    updated_at: new Date().toISOString()
  };
  setDocumentCookie(CONSENT_COOKIE_NAME, serializeCookie(value), COOKIE_MAX_AGE_DAYS);
}

export function resetConsent() {
  deleteDocumentCookie(CONSENT_COOKIE_NAME);
}

export function hasConsent(): boolean {
  return !!getDocumentCookie(CONSENT_COOKIE_NAME);
}

export function isAnalyticsAllowed(): boolean {
  const cookie = getConsent();
  return !!cookie.consent.analytics;
}

export function isMarketingAllowed(): boolean {
  const cookie = getConsent();
  return !!cookie.consent.marketing;
}

export function getDefaultConsent(): ConsentCookie {
  return { ...defaultConsentCookie, updated_at: new Date().toISOString() };
}

export type UserConsentState = {
  consent: ConsentCookie;
  hasUserConsent: boolean;
};

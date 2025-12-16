export type ConsentLogPayload = {
  form_type: "sell" | "buyer" | "agent" | "wholesaler";
  consent_version: string;
  consent_text: string;
  marketing_opt_in: boolean;
  page_url?: string;
  email?: string;
  phone?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export async function logConsentSubmission(payload: ConsentLogPayload) {
  try {
    await fetch("/api/consent-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn("Consent log failed", err);
  }
}

export function extractUtmParams(): Partial<ConsentLogPayload> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const entries: Partial<ConsentLogPayload> = {};
  const keys: (keyof ConsentLogPayload)[] = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term"
  ];
  keys.forEach((key) => {
    const val = params.get(key.replace("utm_", "utm_"));
    if (val) {
      entries[key] = val as ConsentLogPayload[typeof key];
    }
  });
  return entries;
}

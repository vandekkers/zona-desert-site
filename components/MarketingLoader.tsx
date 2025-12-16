"use client";

import { useEffect } from "react";
import { useCookieConsent } from "./CookieConsentProvider";

// Placeholder for future marketing pixels.
export default function MarketingLoader() {
  const { isMarketingAllowed } = useCookieConsent();

  useEffect(() => {
    if (!isMarketingAllowed) {
      // Best-effort cleanup: remove any injected marketing scripts we may control later.
      const knownScripts = document.querySelectorAll("script[data-marketing-pixel]");
      knownScripts.forEach((node) => node.parentElement?.removeChild(node));
    }
  }, [isMarketingAllowed]);

  if (!isMarketingAllowed) return null;

  // Future: inject marketing pixel here using data-marketing-pixel attribute for cleanup.
  return null;
}

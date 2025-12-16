"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { CONSENT_VERSION, ConsentCookie, getConsent, getDefaultConsent, hasConsent, resetConsent, setConsent } from "@/lib/cookies/consent";
import Link from "next/link";

import { Analytics } from "@vercel/analytics/react";
import MarketingLoader from "./MarketingLoader";

export type ConsentContextValue = {
  consent: ConsentCookie;
  hasUserConsent: boolean;
  isBannerOpen: boolean;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (prefs: { analytics: boolean; marketing: boolean }) => void;
  resetConsent: () => void;
  isAnalyticsAllowed: boolean;
  isMarketingAllowed: boolean;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useCookieConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used within CookieConsentProvider");
  return ctx;
}

const Banner = ({ onAccept, onReject, onManage }: { onAccept: () => void; onReject: () => void; onManage: () => void; }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 text-white shadow-2xl">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Cookie Notice</p>
          <p className="mt-1 text-sm text-white/80">We use essential cookies to run our site. We&apos;d also like to use analytics and marketing cookies to improve your experience. Manage your preferences anytime.</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/70">
            <Link href="/privacy" className="underline underline-offset-4">Privacy Notice</Link>
            <Link href="/cookie-policy" className="underline underline-offset-4">Cookie Policy</Link>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:justify-end md:gap-5">
          {[
            { label: "Reject Non-Essential", onClick: onReject, kind: "ghost" },
            { label: "Manage Preferences", onClick: onManage, kind: "ghost" },
            { label: "Accept All", onClick: onAccept, kind: "solid" }
          ].map(({ label, onClick, kind }) => (
            <button
              key={label}
              onClick={onClick}
              className={`min-w-[150px] rounded-full px-4 py-2 text-sm font-semibold transition ${
                kind === "solid"
                  ? "bg-white text-slate-900 hover:bg-slate-200"
                  : "border border-white/30 text-white hover:border-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ToggleRow = ({ label, description, checked, disabled, onChange }: { label: string; description: string; checked: boolean; disabled?: boolean; onChange?: (value: boolean) => void; }) => {
  return (
    <div className="flex items-start justify-between rounded-lg border border-slate-200 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <label className={`relative inline-flex h-6 w-11 cursor-pointer items-center ${disabled ? "opacity-60" : ""}`}>
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span className={`absolute left-0 top-0 h-6 w-11 rounded-full transition ${checked ? "bg-indigo-600" : "bg-slate-300"}`}></span>
        <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : ""}`}></span>
      </label>
    </div>
  );
};

const PreferencesModal = ({
  open,
  onClose,
  values,
  onSave
}: {
  open: boolean;
  onClose: () => void;
  values: { analytics: boolean; marketing: boolean };
  onSave: (vals: { analytics: boolean; marketing: boolean }) => void;
}) => {
  const [localValues, setLocalValues] = useState(values);

  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-900">Cookie Preferences</p>
            <p className="text-sm text-slate-600">Control optional cookies used to improve your experience.</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">✕</button>
        </div>

        <div className="mt-4 space-y-3">
          <ToggleRow label="Essential" description="Required for core functionality" checked disabled />
          <ToggleRow label="Analytics" description="Help us improve the site" checked={localValues.analytics} onChange={(v) => setLocalValues((prev) => ({ ...prev, analytics: v }))} />
          <ToggleRow label="Marketing" description="Personalization and remarketing" checked={localValues.marketing} onChange={(v) => setLocalValues((prev) => ({ ...prev, marketing: v }))} />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</button>
          <button
            onClick={() => onSave(localValues)}
            className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsentState] = useState<ConsentCookie>(getDefaultConsent());
  const [hasUserConsent, setHasUserConsent] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const clearKnownAnalyticsCookies = () => {
    if (typeof document === "undefined") return;
    const names = ["_ga", "_gid", "_gcl_au", "vercel_analytics"];
    names.forEach((name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
    });
  };

  useEffect(() => {
    const rawHasConsent = hasConsent();
    const stored = rawHasConsent ? getConsent() : getDefaultConsent();
    const userHasConsent = rawHasConsent && stored.consent_version === CONSENT_VERSION && !!stored.updated_at;
    setConsentState(stored);
    setHasUserConsent(userHasConsent);
    setBannerOpen(!userHasConsent);
  }, []);

  const updateConsent = useCallback((values: { analytics: boolean; marketing: boolean }) => {
    const prevAnalytics = consent.consent.analytics;
    setConsent(values);
    setConsentState({ consent_version: CONSENT_VERSION, consent: values, updated_at: new Date().toISOString() });
    setHasUserConsent(true);
    setBannerOpen(false);
    if (prevAnalytics && !values.analytics) {
      clearKnownAnalyticsCookies();
    }
  }, [consent.consent.analytics]);

  const acceptAll = useCallback(() => updateConsent({ analytics: true, marketing: true }), [updateConsent]);
  const rejectNonEssential = useCallback(() => updateConsent({ analytics: false, marketing: false }), [updateConsent]);
  const savePreferences = useCallback((vals: { analytics: boolean; marketing: boolean }) => {
    updateConsent(vals);
    setModalOpen(false);
  }, [updateConsent]);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const contextValue: ConsentContextValue = useMemo(() => ({
    consent,
    hasUserConsent,
    isBannerOpen: bannerOpen,
    isModalOpen: modalOpen,
    openModal,
    closeModal,
    acceptAll,
    rejectNonEssential,
    savePreferences,
    resetConsent,
    isAnalyticsAllowed: consent.consent.analytics,
    isMarketingAllowed: consent.consent.marketing
  }), [consent, hasUserConsent, bannerOpen, modalOpen, openModal, closeModal, acceptAll, rejectNonEssential, savePreferences]);

  return (
    <ConsentContext.Provider value={contextValue}>
      {children}
      {bannerOpen && (
        <Banner onAccept={acceptAll} onReject={rejectNonEssential} onManage={openModal} />
      )}
      <PreferencesModal
        open={modalOpen}
        onClose={closeModal}
        values={{ analytics: consent.consent.analytics, marketing: consent.consent.marketing }}
        onSave={savePreferences}
      />
      {/* Analytics loader gated by consent */}
      {consent.consent.analytics && <Analytics />}
      {consent.consent.marketing && <MarketingLoader />}
    </ConsentContext.Provider>
  );
}

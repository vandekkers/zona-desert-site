"use client";

// BREAKAWAY: deals board — remove at platform launch
//
// Owner deal cockpit. Three capabilities:
//  - Manage: every live deal listed with one-click edit / delete
//  - Build: form fields → live underwriting preview → deal JSON
//  - Paste: validate JSON produced elsewhere (e.g. by an AI assistant
//    following content/deals/_SCHEMA.json)
// Publishing goes through /api/deals-admin (the GitHub gateway) when a
// GITHUB_DEALS_TOKEN is configured in Vercel; otherwise it falls back to
// prefilled GitHub web-UI links. Fields the form doesn't manage (comps,
// financing overrides, expense-% overrides…) are carried through
// untouched when editing an existing deal.

import { useMemo, useState } from "react";
import type { Deal, DealsConfig } from "../_lib/deal-shared";
import { flipMath, money, rentalMath, validateDeal } from "../_lib/deal-shared";

const input =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-zona-purple-mid";
const label = "block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1";
const section = "rounded-3xl border border-slate-200 bg-white p-5 space-y-4";
const heading = "text-sm font-semibold text-zona-navy";

const MANAGED_TOP_KEYS = [
  "id", "status", "strategy", "address", "city", "state", "zip", "price", "arv",
  "estRehab", "beds", "baths", "sqft", "lotSqft", "yearBuilt", "propertyType",
  "occupancy", "description", "highlights", "photos", "rental", "terms",
  "closeBy", "featured"
] as const;
const MANAGED_RENTAL_KEYS = [
  "monthlyRent", "taxesAnnual", "insuranceAnnual", "hoaMonthly", "section8"
] as const;
const MANAGED_TERMS_KEYS = ["emd", "closeMethod", "access"] as const;

function omit(
  source: Record<string, unknown>,
  keys: readonly string[]
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(source)) {
    if (!keys.includes(key)) out[key] = value;
  }
  return out;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function num(value: string): number {
  const parsed = Number(value.replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

type ShipState =
  | { status: "idle" }
  | { status: "working" }
  | { status: "done"; message: string; id: string }
  | { status: "error"; message: string };

interface Props {
  config: DealsConfig;
  deals: Deal[];
  gatewayReady: boolean;
}

export function DealDeskForm({ config, deals, gatewayReady }: Props) {
  const [mode, setMode] = useState<"build" | "paste">("build");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [extras, setExtras] = useState<Record<string, unknown>>({});
  const [rentalExtras, setRentalExtras] = useState<Record<string, unknown>>({});
  const [termsExtras, setTermsExtras] = useState<Record<string, unknown>>({});
  const [ship, setShip] = useState<ShipState>({ status: "idle" });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Basics
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Detroit");
  const [stateCode, setStateCode] = useState("MI");
  const [zip, setZip] = useState("");
  const [status, setStatus] = useState("available");
  const [isRental, setIsRental] = useState(true);
  const [isFlip, setIsFlip] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [closeBy, setCloseBy] = useState("");
  const [propertyType, setPropertyType] = useState("Single Family");
  const [occupancy, setOccupancy] = useState("Vacant");

  // Numbers
  const [price, setPrice] = useState("");
  const [arv, setArv] = useState("");
  const [estRehab, setEstRehab] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [sqft, setSqft] = useState("");
  const [lotSqft, setLotSqft] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");

  // Rental
  const [monthlyRent, setMonthlyRent] = useState("");
  const [taxesAnnual, setTaxesAnnual] = useState("");
  const [insuranceAnnual, setInsuranceAnnual] = useState("");
  const [hoaMonthly, setHoaMonthly] = useState("");
  const [section8, setSection8] = useState(false);

  // Terms + content
  const [emd, setEmd] = useState("");
  const [closeMethod, setCloseMethod] = useState("Assignment");
  const [access, setAccess] = useState("");
  const [description, setDescription] = useState("");
  const [highlightsText, setHighlightsText] = useState("");
  const [photosText, setPhotosText] = useState("");

  // Paste mode
  const [pasted, setPasted] = useState("");
  const [copied, setCopied] = useState(false);

  const id = editingId && slugify(address) === editingId ? editingId : slugify(address);

  function clearForm() {
    setEditingId(null);
    setExtras({});
    setRentalExtras({});
    setTermsExtras({});
    setAddress(""); setCity("Detroit"); setStateCode("MI"); setZip("");
    setStatus("available"); setIsRental(true); setIsFlip(true); setFeatured(false);
    setCloseBy(""); setPropertyType("Single Family"); setOccupancy("Vacant");
    setPrice(""); setArv(""); setEstRehab(""); setBeds(""); setBaths("");
    setSqft(""); setLotSqft(""); setYearBuilt("");
    setMonthlyRent(""); setTaxesAnnual(""); setInsuranceAnnual(""); setHoaMonthly("");
    setSection8(false); setEmd(""); setCloseMethod("Assignment"); setAccess("");
    setDescription(""); setHighlightsText(""); setPhotosText("");
    setShip({ status: "idle" });
  }

  function loadDeal(deal: Deal) {
    const raw = deal as unknown as Record<string, unknown>;
    setMode("build");
    setEditingId(deal.id);
    setExtras(omit(raw, MANAGED_TOP_KEYS));
    setRentalExtras(
      deal.rental
        ? omit(deal.rental as unknown as Record<string, unknown>, MANAGED_RENTAL_KEYS)
        : {}
    );
    setTermsExtras(
      deal.terms
        ? omit(deal.terms as unknown as Record<string, unknown>, MANAGED_TERMS_KEYS)
        : {}
    );
    setAddress(deal.address);
    setCity(deal.city);
    setStateCode(deal.state);
    setZip(deal.zip);
    setStatus(deal.status);
    const strategies = deal.strategy ?? (deal.rental ? ["rental", "flip"] : ["flip"]);
    setIsRental(strategies.includes("rental"));
    setIsFlip(strategies.includes("flip"));
    setFeatured(Boolean(deal.featured));
    setCloseBy(deal.closeBy ?? "");
    setPropertyType(deal.propertyType ?? "");
    setOccupancy(deal.occupancy ?? "");
    setPrice(String(deal.price));
    setArv(String(deal.arv));
    setEstRehab(String(deal.estRehab));
    setBeds(String(deal.beds));
    setBaths(String(deal.baths));
    setSqft(String(deal.sqft));
    setLotSqft(String(deal.lotSqft));
    setYearBuilt(String(deal.yearBuilt));
    setMonthlyRent(deal.rental ? String(deal.rental.monthlyRent) : "");
    setTaxesAnnual(deal.rental?.taxesAnnual ? String(deal.rental.taxesAnnual) : "");
    setInsuranceAnnual(deal.rental?.insuranceAnnual ? String(deal.rental.insuranceAnnual) : "");
    setHoaMonthly(deal.rental?.hoaMonthly ? String(deal.rental.hoaMonthly) : "");
    setSection8(Boolean(deal.rental?.section8));
    setEmd(deal.terms?.emd ? String(deal.terms.emd) : "");
    setCloseMethod(deal.terms?.closeMethod ?? "");
    setAccess(deal.terms?.access ?? "");
    setDescription(deal.description);
    setHighlightsText(deal.highlights.join("\n"));
    setPhotosText(deal.photos.join("\n"));
    setShip({ status: "idle" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const builtDeal = useMemo(() => {
    const strategy: string[] = [
      ...(isRental ? ["rental"] : []),
      ...(isFlip ? ["flip"] : [])
    ];
    const deal: Record<string, unknown> = {
      ...extras,
      id,
      status,
      ...(strategy.length > 0 ? { strategy } : {}),
      address: address.trim(),
      city: city.trim(),
      state: stateCode.trim().toUpperCase(),
      zip: zip.trim(),
      price: num(price),
      arv: num(arv),
      estRehab: num(estRehab),
      beds: num(beds),
      baths: num(baths),
      sqft: num(sqft),
      lotSqft: num(lotSqft),
      yearBuilt: num(yearBuilt),
      ...(propertyType.trim() ? { propertyType: propertyType.trim() } : {}),
      ...(occupancy.trim() ? { occupancy: occupancy.trim() } : {}),
      description: description.trim(),
      highlights: highlightsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      photos: photosText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    };
    if (isRental && num(monthlyRent) > 0) {
      deal.rental = {
        ...rentalExtras,
        monthlyRent: num(monthlyRent),
        ...(num(taxesAnnual) > 0 ? { taxesAnnual: num(taxesAnnual) } : {}),
        ...(num(insuranceAnnual) > 0 ? { insuranceAnnual: num(insuranceAnnual) } : {}),
        ...(num(hoaMonthly) > 0 ? { hoaMonthly: num(hoaMonthly) } : {}),
        ...(section8 ? { section8: true } : {})
      };
    }
    if (
      num(emd) > 0 ||
      closeMethod.trim() ||
      access.trim() ||
      Object.keys(termsExtras).length > 0
    ) {
      deal.terms = {
        ...termsExtras,
        ...(num(emd) > 0 ? { emd: num(emd) } : {}),
        ...(closeMethod.trim() ? { closeMethod: closeMethod.trim() } : {}),
        ...(access.trim() ? { access: access.trim() } : {})
      };
    }
    if (closeBy) deal.closeBy = closeBy;
    if (featured) deal.featured = true;
    return deal;
  }, [
    extras, rentalExtras, termsExtras, id, status, isRental, isFlip, address, city,
    stateCode, zip, price, arv, estRehab, beds, baths, sqft, lotSqft, yearBuilt,
    propertyType, occupancy, description, highlightsText, photosText, monthlyRent,
    taxesAnnual, insuranceAnnual, hoaMonthly, section8, emd, closeMethod, access,
    closeBy, featured
  ]);

  const activeDeal: unknown = useMemo(() => {
    if (mode === "build") return builtDeal;
    try {
      return JSON.parse(pasted);
    } catch {
      return null;
    }
  }, [mode, builtDeal, pasted]);

  const errors = useMemo(() => {
    if (mode === "paste" && activeDeal === null)
      return pasted.trim() ? ["Not valid JSON — check for missing quotes/commas."] : [];
    return validateDeal(activeDeal);
  }, [mode, activeDeal, pasted]);

  const preview = useMemo(() => {
    if (errors.length > 0 || !activeDeal) return null;
    const deal = activeDeal as Deal;
    return { fm: flipMath(deal), rm: rentalMath(deal) };
  }, [errors, activeDeal]);

  const json = useMemo(
    () => (activeDeal ? JSON.stringify(activeDeal, null, 2) + "\n" : ""),
    [activeDeal]
  );
  const dealId =
    activeDeal && typeof (activeDeal as Record<string, unknown>).id === "string"
      ? ((activeDeal as Record<string, unknown>).id as string)
      : "";

  const githubNewFileUrl = `https://github.com/${config.repo}/new/main?filename=${encodeURIComponent(
    `content/deals/${dealId || "new-deal"}.json`
  )}&value=${encodeURIComponent(json)}`;
  const githubUploadUrl = `https://github.com/${config.repo}/upload/main/public/deals/${dealId || ""}`;

  const ready = errors.length === 0 && dealId.length > 0;
  const idChangedWhileEditing = Boolean(editingId && dealId && dealId !== editingId);

  async function publish() {
    if (!ready || ship.status === "working") return;
    setShip({ status: "working" });
    try {
      const res = await fetch("/api/deals-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ action: "upsert", id: dealId, deal: activeDeal })
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; action?: string; error?: string; errors?: string[] }
        | null;
      if (res.ok && data?.ok) {
        setShip({
          status: "done",
          id: dealId,
          message: `${data.action === "update" ? "Updated" : "Published"} ${dealId} — Vercel is rebuilding, live in ~2 minutes.`
        });
      } else {
        const detail = data?.errors?.length ? ` (${data.errors.join(" ")})` : "";
        setShip({
          status: "error",
          message: `${data?.error ?? `Request failed (${res.status}).`}${detail}`
        });
      }
    } catch {
      setShip({ status: "error", message: "Network error — try again." });
    }
  }

  async function removeDeal(targetId: string) {
    if (!window.confirm(`Delete ${targetId} from the board? This removes its file from GitHub.`))
      return;
    setDeletingId(targetId);
    try {
      const res = await fetch("/api/deals-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ action: "delete", id: targetId })
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (res.ok && data?.ok) {
        setShip({
          status: "done",
          id: targetId,
          message: `Deleted ${targetId} — Vercel is rebuilding, gone from the board in ~2 minutes.`
        });
        if (editingId === targetId) clearForm();
      } else {
        setShip({ status: "error", message: data?.error ?? `Delete failed (${res.status}).` });
      }
    } catch {
      setShip({ status: "error", message: "Network error — try again." });
    } finally {
      setDeletingId(null);
    }
  }

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — user can copy from the preview block
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-5">
        {/* Manage existing deals */}
        {deals.length > 0 && (
          <div className={section}>
            <p className={heading}>On the board now</p>
            <ul className="space-y-2">
              {deals.map((deal) => (
                <li
                  key={deal.id}
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3 ${
                    editingId === deal.id
                      ? "border-zona-purple-mid bg-zona-purple-mid/5"
                      : "border-slate-200"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zona-navy">
                      {deal.address}
                      <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {deal.status}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500">
                      {deal.city}, {deal.state} · {money(deal.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => loadDeal(deal)}
                      className="rounded-full border border-zona-purple-mid px-3 py-1.5 text-xs font-semibold text-zona-purple-mid transition hover:bg-zona-purple-mid/10"
                    >
                      Edit
                    </button>
                    <a
                      href={`/deals/${deal.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                    >
                      View
                    </a>
                    {gatewayReady ? (
                      <button
                        type="button"
                        onClick={() => removeDeal(deal.id)}
                        disabled={deletingId === deal.id}
                        className="rounded-full border border-zona-orange px-3 py-1.5 text-xs font-semibold text-zona-orange transition hover:bg-zona-orange/10 disabled:opacity-50"
                      >
                        {deletingId === deal.id ? "Deleting…" : "Delete"}
                      </button>
                    ) : (
                      <a
                        href={`https://github.com/${config.repo}/blob/main/content/deals/${deal.id}.json`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                      >
                        File →
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mode toggle + editing banner */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex w-fit gap-1 rounded-full border border-slate-200 bg-white p-1">
            {(
              [
                ["build", "Build a deal"],
                ["paste", "Paste JSON (AI)"]
              ] as const
            ).map(([value, text]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === value
                    ? "bg-zona-purple-deep text-white"
                    : "text-slate-600 hover:text-zona-purple-deep"
                }`}
              >
                {text}
              </button>
            ))}
          </div>
          {editingId && (
            <span className="flex items-center gap-2 rounded-full bg-zona-purple-mid/10 px-3 py-1.5 text-xs font-semibold text-zona-purple-deep">
              Editing {editingId}
              <button
                type="button"
                onClick={clearForm}
                className="underline decoration-dotted underline-offset-2"
              >
                start fresh
              </button>
            </span>
          )}
        </div>

        {mode === "paste" ? (
          <div className={section}>
            <p className={heading}>Paste a deal JSON</p>
            <p className="text-xs text-slate-500">
              Point any AI assistant at{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5">content/deals/_SCHEMA.json</code>{" "}
              in the repo (or paste it into the chat), have it produce one deal object, then paste
              the result here. It validates instantly.
            </p>
            <textarea
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              rows={18}
              spellCheck={false}
              className={`${input} font-mono text-xs`}
              placeholder='{ "id": "123-main-st", "status": "available", ... }'
            />
          </div>
        ) : (
          <>
            <div className={section}>
              <p className={heading}>Basics</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="col-span-2">
                  <span className={label}>Street address *</span>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} className={input} placeholder="4123 Three Mile Dr" />
                </div>
                <div>
                  <span className={label}>City *</span>
                  <input value={city} onChange={(e) => setCity(e.target.value)} className={input} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className={label}>State *</span>
                    <input value={stateCode} onChange={(e) => setStateCode(e.target.value)} className={input} maxLength={2} />
                  </div>
                  <div>
                    <span className={label}>ZIP *</span>
                    <input value={zip} onChange={(e) => setZip(e.target.value)} className={input} maxLength={5} inputMode="numeric" />
                  </div>
                </div>
                <div>
                  <span className={label}>Status</span>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className={input}>
                    <option value="available">available</option>
                    <option value="pending">pending</option>
                    <option value="sold">sold</option>
                  </select>
                </div>
                <div>
                  <span className={label}>Property type</span>
                  <input value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className={input} />
                </div>
                <div>
                  <span className={label}>Occupancy</span>
                  <input value={occupancy} onChange={(e) => setOccupancy(e.target.value)} className={input} />
                </div>
                <div>
                  <span className={label}>Close by</span>
                  <input type="date" value={closeBy} onChange={(e) => setCloseBy(e.target.value)} className={input} />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-700">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={isRental} onChange={(e) => setIsRental(e.target.checked)} className="accent-zona-purple-deep" />
                  Rental play
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={isFlip} onChange={(e) => setIsFlip(e.target.checked)} className="accent-zona-purple-deep" />
                  Flip candidate
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-zona-purple-deep" />
                  Featured
                </label>
              </div>
              {id && (
                <p className="text-xs text-slate-500">
                  Link will be <span className="font-semibold">zonadesert.com/deals/{id}</span>
                </p>
              )}
            </div>

            <div className={section}>
              <p className={heading}>Numbers</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(
                  [
                    ["Asking price *", price, setPrice, "129000"],
                    ["ARV *", arv, setArv, "185000"],
                    ["Est. rehab *", estRehab, setEstRehab, "25000"],
                    ["EMD", emd, setEmd, "2500"],
                    ["Beds *", beds, setBeds, "3"],
                    ["Baths *", baths, setBaths, "2"],
                    ["Sqft *", sqft, setSqft, "1480"],
                    ["Lot sqft *", lotSqft, setLotSqft, "4800"]
                  ] as const
                ).map(([text, value, setter, placeholder]) => (
                  <div key={text}>
                    <span className={label}>{text}</span>
                    <input value={value} onChange={(e) => setter(e.target.value)} className={input} placeholder={placeholder} inputMode="decimal" />
                  </div>
                ))}
                <div>
                  <span className={label}>Year built *</span>
                  <input value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value)} className={input} placeholder="1949" inputMode="numeric" />
                </div>
                <div>
                  <span className={label}>Close method</span>
                  <input value={closeMethod} onChange={(e) => setCloseMethod(e.target.value)} className={input} />
                </div>
                <div className="col-span-2">
                  <span className={label}>Access</span>
                  <input value={access} onChange={(e) => setAccess(e.target.value)} className={input} placeholder="Lockbox — text for code" />
                </div>
              </div>
            </div>

            {isRental && (
              <div className={section}>
                <p className={heading}>Rental income & expenses</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(
                    [
                      ["Monthly rent *", monthlyRent, setMonthlyRent, "1650"],
                      ["Taxes / yr", taxesAnnual, setTaxesAnnual, "2350"],
                      ["Insurance / yr", insuranceAnnual, setInsuranceAnnual, "1300"],
                      ["HOA / mo", hoaMonthly, setHoaMonthly, "0"]
                    ] as const
                  ).map(([text, value, setter, placeholder]) => (
                    <div key={text}>
                      <span className={label}>{text}</span>
                      <input value={value} onChange={(e) => setter(e.target.value)} className={input} placeholder={placeholder} inputMode="decimal" />
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={section8} onChange={(e) => setSection8(e.target.checked)} className="accent-zona-purple-deep" />
                  Section 8 friendly
                </label>
                <p className="text-xs text-slate-500">
                  Vacancy 8%, management 10%, maintenance 10% are assumed automatically (shown as
                  “est.” on the page). Add them to the JSON manually to override.
                </p>
              </div>
            )}

            <div className={section}>
              <p className={heading}>Story & photos</p>
              <div>
                <span className={label}>Description (2–4 sentences) *</span>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={input} />
              </div>
              <div>
                <span className={label}>Highlights — one per line</span>
                <textarea value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} rows={3} className={input} placeholder={"Brick construction\nCosmetic rehab only"} />
              </div>
              <div>
                <span className={label}>Photos — one path or URL per line *</span>
                <textarea value={photosText} onChange={(e) => setPhotosText(e.target.value)} rows={3} className={input} placeholder={`/deals/${id || "the-deal-id"}/1.jpg`} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Live preview + actions rail */}
      <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className={section}>
          <p className={heading}>Live numbers</p>
          {preview ? (
            <div className="grid grid-cols-2 gap-2">
              {preview.rm && (
                <>
                  <div className="rounded-xl bg-zona-off-white p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Cap rate</p>
                    <p className="text-lg font-bold text-zona-navy">{preview.rm.capRatePct ?? "—"}%</p>
                  </div>
                  <div className="rounded-xl bg-zona-off-white p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">NOI / yr</p>
                    <p className="text-lg font-bold text-zona-navy">{money(preview.rm.noi)}</p>
                  </div>
                  <div className="rounded-xl bg-zona-off-white p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Cash flow / mo</p>
                    <p className="text-lg font-bold text-zona-navy">{money(preview.rm.cashFlowMonthly)}</p>
                  </div>
                </>
              )}
              <div className="rounded-xl bg-zona-off-white p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Spread</p>
                <p className="text-lg font-bold text-zona-navy">{money(preview.fm.spread)}</p>
              </div>
              <div className="rounded-xl bg-zona-off-white p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">% of ARV</p>
                <p className="text-lg font-bold text-zona-navy">{preview.fm.pctOfArv ?? "—"}%</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Numbers appear here once the required fields are filled and valid.
            </p>
          )}
          {errors.length > 0 && (mode === "paste" ? pasted.trim() : address.trim()) && (
            <ul className="space-y-1">
              {errors.map((error) => (
                <li key={error} className="text-xs font-semibold text-red-700">
                  • {error}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={section}>
          <p className={heading}>Ship it</p>

          {gatewayReady ? (
            <>
              <button
                type="button"
                onClick={publish}
                disabled={!ready || ship.status === "working"}
                className={`flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition ${
                  ready && ship.status !== "working"
                    ? "bg-zona-purple-deep text-white hover:bg-zona-purple-mid"
                    : "cursor-not-allowed bg-slate-200 text-slate-400"
                }`}
              >
                {ship.status === "working"
                  ? "Publishing…"
                  : editingId && !idChangedWhileEditing
                    ? "Save changes to the board"
                    : "Publish to the board"}
              </button>
              {idChangedWhileEditing && (
                <p className="text-xs font-semibold text-zona-orange">
                  The address/id changed — this publishes a NEW listing ({dealId}); {editingId}{" "}
                  stays on the board until you delete it above.
                </p>
              )}
              {ship.status === "done" && (
                <p className="rounded-xl bg-green-50 p-3 text-xs font-semibold text-green-800">
                  ✓ {ship.message}{" "}
                  <a
                    href={`/deals/${ship.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    View listing
                  </a>
                </p>
              )}
              {ship.status === "error" && (
                <p className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-800">
                  {ship.message}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={copyJson}
                  disabled={!ready}
                  className="flex items-center justify-center rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copied ? "Copied ✓" : "Copy JSON"}
                </button>
                <a
                  href={ready ? githubUploadUrl : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!ready}
                  className={`flex items-center justify-center rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                    ready
                      ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                      : "cursor-not-allowed border-slate-200 text-slate-400"
                  }`}
                >
                  Upload photos →
                </a>
              </div>
              <p className="text-xs text-slate-500">
                Publishing commits straight to GitHub as you — Vercel rebuilds and the board
                updates in about two minutes.
              </p>
            </>
          ) : (
            <>
              <p className="rounded-xl bg-zona-amber/10 p-3 text-xs font-semibold text-zona-navy">
                One-click publishing is off — add a <code>GITHUB_DEALS_TOKEN</code> in Vercel to
                enable it (steps in content/DEALS_README.md). The GitHub buttons below work in
                the meantime.
              </p>
              <ol className="list-decimal space-y-1 pl-4 text-xs text-slate-600">
                <li>Commit the JSON on GitHub (button below — everything is pre-filled).</li>
                <li>Upload photos to public/deals/{dealId || "<id>"}/ if using local paths.</li>
                <li>Vercel redeploys automatically — live in ~2 minutes.</li>
              </ol>
              <div className="space-y-2">
                <a
                  href={ready ? githubNewFileUrl : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!ready}
                  className={`flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition ${
                    ready
                      ? "bg-zona-purple-deep text-white hover:bg-zona-purple-mid"
                      : "cursor-not-allowed bg-slate-200 text-slate-400"
                  }`}
                >
                  Commit deal on GitHub →
                </a>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={copyJson}
                    disabled={!ready}
                    className="flex items-center justify-center rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {copied ? "Copied ✓" : "Copy JSON"}
                  </button>
                  <a
                    href={ready ? githubUploadUrl : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-disabled={!ready}
                    className={`flex items-center justify-center rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                      ready
                        ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                        : "cursor-not-allowed border-slate-200 text-slate-400"
                    }`}
                  >
                    Upload photos →
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        {ready && (
          <details className={section}>
            <summary className="cursor-pointer text-sm font-semibold text-zona-navy">
              Preview the JSON
            </summary>
            <pre className="mt-3 max-h-80 overflow-auto rounded-xl bg-zona-navy p-4 text-[11px] leading-relaxed text-slate-200">
              {json}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

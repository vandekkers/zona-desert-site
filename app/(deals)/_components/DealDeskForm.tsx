"use client";

// BREAKAWAY: deals board — remove at platform launch
//
// Owner deal builder. Two modes:
//  - Build: form fields → live underwriting preview → deal JSON
//  - Paste: validate JSON produced elsewhere (e.g. by an AI assistant
//    following content/deals/_SCHEMA.json)
// Output actions are zero-backend: copy the JSON, or open GitHub's
// new-file page prefilled with filename + content and commit there.

import { useMemo, useState } from "react";
import type { Deal, DealsConfig } from "../_lib/deal-shared";
import { flipMath, money, rentalMath } from "../_lib/deal-shared";

const input =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-zona-purple-mid";
const label = "block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1";
const section = "rounded-3xl border border-slate-200 bg-white p-5 space-y-4";
const heading = "text-sm font-semibold text-zona-navy";

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

// Lightweight mirror of content/deals/_SCHEMA.json for instant feedback.
function validateDeal(candidate: unknown): string[] {
  const errors: string[] = [];
  if (typeof candidate !== "object" || candidate === null) return ["Not a JSON object."];
  const d = candidate as Record<string, unknown>;
  const requireString = (key: string) => {
    if (typeof d[key] !== "string" || (d[key] as string).length === 0)
      errors.push(`"${key}" is required (text).`);
  };
  const requireNumber = (key: string, min = 0) => {
    if (typeof d[key] !== "number" || (d[key] as number) < min)
      errors.push(`"${key}" is required (number ≥ ${min}).`);
  };
  ["id", "address", "city", "state", "zip", "description"].forEach(requireString);
  ["arv", "estRehab", "beds", "baths", "lotSqft", "yearBuilt"].forEach((k) => requireNumber(k));
  ["price", "sqft"].forEach((k) => {
    if (typeof d[k] !== "number" || (d[k] as number) <= 0)
      errors.push(`"${k}" is required (number > 0).`);
  });
  if (typeof d.id === "string" && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.id))
    errors.push('"id" must be lowercase letters/numbers with hyphens (e.g. 123-main-st).');
  if (typeof d.state === "string" && !/^[A-Z]{2}$/.test(d.state))
    errors.push('"state" must be a 2-letter code like MI.');
  if (typeof d.zip === "string" && !/^\d{5}$/.test(d.zip))
    errors.push('"zip" must be 5 digits.');
  if (!["available", "pending", "sold"].includes(d.status as string))
    errors.push('"status" must be available, pending, or sold.');
  if (!Array.isArray(d.photos) || d.photos.length === 0)
    errors.push('"photos" needs at least one path or URL.');
  if (!Array.isArray(d.highlights)) errors.push('"highlights" must be a list of strings.');
  const rental = d.rental as Record<string, unknown> | undefined;
  if (rental && (typeof rental.monthlyRent !== "number" || rental.monthlyRent <= 0))
    errors.push('"rental.monthlyRent" must be a number > 0 when a rental block is present.');
  return errors;
}

export function DealDeskForm({ config }: { config: DealsConfig }) {
  const [mode, setMode] = useState<"build" | "paste">("build");

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

  const id = slugify(address);

  const builtDeal = useMemo(() => {
    const strategy: string[] = [
      ...(isRental ? ["rental"] : []),
      ...(isFlip ? ["flip"] : [])
    ];
    const deal: Record<string, unknown> = {
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
        monthlyRent: num(monthlyRent),
        ...(num(taxesAnnual) > 0 ? { taxesAnnual: num(taxesAnnual) } : {}),
        ...(num(insuranceAnnual) > 0 ? { insuranceAnnual: num(insuranceAnnual) } : {}),
        ...(num(hoaMonthly) > 0 ? { hoaMonthly: num(hoaMonthly) } : {}),
        ...(section8 ? { section8: true } : {})
      };
    }
    if (num(emd) > 0 || closeMethod.trim() || access.trim()) {
      deal.terms = {
        ...(num(emd) > 0 ? { emd: num(emd) } : {}),
        ...(closeMethod.trim() ? { closeMethod: closeMethod.trim() } : {}),
        ...(access.trim() ? { access: access.trim() } : {})
      };
    }
    if (closeBy) deal.closeBy = closeBy;
    if (featured) deal.featured = true;
    return deal;
  }, [
    id, status, isRental, isFlip, address, city, stateCode, zip, price, arv, estRehab,
    beds, baths, sqft, lotSqft, yearBuilt, propertyType, occupancy, description,
    highlightsText, photosText, monthlyRent, taxesAnnual, insuranceAnnual, hoaMonthly,
    section8, emd, closeMethod, access, closeBy, featured
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
    const fm = flipMath(deal);
    const rm = rentalMath(deal);
    return { fm, rm };
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

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — user can copy from the preview block
    }
  }

  const ready = errors.length === 0 && dealId.length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-5">
        {/* Mode toggle */}
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

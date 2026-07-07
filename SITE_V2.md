# SITE_V2.md — the pure-frontend zonadesert.com (July 2026)

zonadesert.com is a **pure front-end marketing site**: Next.js pages fed by
`content/deals/*.json` at build time, with contact flows that compose email/SMS
in the visitor's own apps. There is **no connection to the platform backend**
(the FastAPI app in `vandekkers/zona-admin`) — by design, until the platform
is ready for launch. This document is the map.

## What lives where

| Path | What it is |
|---|---|
| `app/(v2)/` | The live public site: landing, `/deals` board + detail, `/sell`, `/buyers`, `/agents`, `/wholesalers`, `/about`, `/how-it-works`, `/faq`, legal pages, `/deal-desk` (owner), `/api/deals-admin` (GitHub gateway) |
| `app/_platform/` | **Shelved** platform-era routes — everything that talked to the backend: the old `(site)` pages, `(sell-submit)` flow, `/offer/[token]` portal, `/deal-pack`, and its API route. Unroutable (underscore folder) but fully compiled and preserved. |
| `app/api/consent-log` | Self-contained consent audit endpoint (10DLC). Forwards to `CONSENT_LOG_ENDPOINT` env if set, else logs. Used by the v2 intake forms. |
| `app/api/__owner-access`, `app/__owner-access` | Owner login (unchanged). The cookie now gates only `/deal-desk`. |
| `app/coming-soon` | The old wall page, kept reachable directly. |
| `content/deals/` | The deal "database" — one JSON file per deal (see `DEALS_BREAKAWAY.md` / `content/DEALS_README.md`). |
| `public/brand-v2/` | v2 brand assets from the design handoff (trimmed transparent lockup, mark, warm hero). |

## The rules the v2 site follows

1. **No platform-backend calls.** Deals come from JSON at build time; forms
   compose mailto/sms; the only server integrations are the self-contained
   consent log and the GitHub gateway (owner-only).
2. **Design system**: the Claude Design handoff (Zona Desert Design System
   v1.0) is the visual authority — Sora 600 hierarchy / Inter UI, six locked
   brand colors + warm sand surfaces, 8–10px button radii (pills only for
   status chips), shadows-not-borders, restrained motion.
3. **Real numbers only.** Landing/about stats are computed from live deal
   data (`boardStats()`), never hardcoded.
4. **Legal text is single-sourced**: `/terms`, `/privacy`, `/cookie-policy`,
   and `/faq` re-export the shelved platform pages verbatim.

## Restoring the platform (when that day comes)

1. Move the needed routes back out of `app/_platform/` (git mv — history is
   preserved; they were moved wholesale, never edited).
2. Resolve URL collisions deliberately: the v2 site owns `/`, `/sell`,
   `/about`, etc. Decide per-route whether v2 or platform wins.
3. `lib/publicApi.ts`, `lib/api.ts`, `lib/types.ts`, `components/forms/*`,
   `components/portal/*`, `components/listings/*` are all untouched and ready
   to re-wire.
4. The old coming-soon middleware logic is in git history
   (`git log middleware.ts`); the wall pattern was: default-deny rewrite of
   non-owner traffic to `/coming-soon` with a bypass list.

## Note on legacy BREAKAWAY markers

Files in `app/(v2)/` that came from the original deals board still carry
`// BREAKAWAY: deals board — remove at platform launch` comments. Since the
deals board is now a permanent page of the site, read those markers as
historical provenance, not removal instructions. `DEALS_BREAKAWAY.md` still
documents the deal-data lifecycle (adding/removing deals, the gateway token).

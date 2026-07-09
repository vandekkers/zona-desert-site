# Zona Desert — Design System

**v1.1 — updated 2026-07-09.** v1.1 folds in the patterns that shipped on the live marketing site (site v2 at zonadesert.com, July 2026). Where this document and production differed, **production won** — the site is now the reference implementation for all marketing surfaces. Admin and Partners rules are unchanged from v1.0.

A cross-product design system for **Zona Desert Property Solutions LLC**, an AI-driven real estate transaction platform. Every visual element across the three products must use this system — no exceptions.

---

## The Company

Zona Desert is building the top-5 real estate transaction firm in the US. The platform is an **investor-first marketplace** for creative real estate deals, powered by AI to automate up to 95% of the transaction flow. Nationwide expansion in progress.

**Voice & quality bar:** founder-quality, bold, modern. Financial software polish (think Stripe) — **not** consumer real estate copy (no Zillow *voice*). Nuance as of v1.1: marketing *layout* may borrow the immersive full-bleed patterns of the big search portals (the hero is deliberately Zillow-scale) — the words and the data-forward tone stay investor-first.

## Three Products

| Product | Surface | Audience | Voice |
|---|---|---|---|
| **Admin** (`app.zonadesert.com`) | Internal operator dashboard | Zona team | Data-dense, Stripe-quality tables, clean KPIs |
| **Marketing** (`zonadesert.com`) | Public site + buyer/seller intake | Investors, agents, sellers | Trust-building, conversion-focused, minimal |
| **Partners** (`partners.zonadesert.com`) | Title agent + partner workspace | Title, escrow, partners | Action-oriented, mobile-first, signing-optimized *(in development)* |

---

## Source Materials

The system is derived from:

- **`vandekkers/zona-admin`** (private GitHub monorepo) — `DESIGN.md` v1.0 is the **canonical authority** for tokens, type, and components. Also: `apps/admin/*` (Next.js pages + CSS modules + components), `apps/api` (FastAPI backend), `BLUEPRINT_INDEX.md`, `ROADMAP.md`.
- **`vandekkers/zona-desert-site`** — public Next.js marketing site (site v2, `app/(v2)/*`). As of v1.1 its `tailwind.config.ts` carries the correct brand tokens plus the marketing extensions (sand surfaces, elevation set) — for marketing surfaces, **the live site is the reference implementation** and wins over this folder where they differ.
- **Logo PNGs** (provided by user) — horizontal, stacked, mark-only, on-dark, glow variants. All imported into `assets/`.
- **`zona_desert_font_system.pdf`** (provided by user) — documents the Sora + Inter pairing.

If any source is missing or the reader doesn't have access, treat `DESIGN.md` rules (mirrored in this README) as ground truth.

---

## Index (what's in this folder)

| Path | What it is |
|---|---|
| `README.md` | This file — full design guide |
| `SKILL.md` | Agent-skill manifest so this folder works as a Claude Skill |
| `colors_and_type.css` | CSS variables for colors, type, spacing, radii, shadows + semantic classes |
| `assets/` | Logos (mark, wordmark, horizontal, stacked, on-dark), hero background |
| `preview/` | Design-system cards rendered for the Design System tab |
| `ui_kits/admin/` | Admin-portal UI kit (KPI dashboard, listings, transactions) |
| `ui_kits/marketing/` | Public-site UI kit (hero, listing grid, intake forms) |
| `ui_kits/partners/` | Partner / signing workspace UI kit |

---

## CONTENT FUNDAMENTALS

### Voice

**Direct, founder-quality, professional.** Every line earns its place. Zona writes like an operator building a $1B firm — confident, specific, data-forward. No filler, no hype, no consumer-real-estate sentimentality.

### Grammar & Case

- **Title Case** for page titles, section headers, buttons, and feature names ("Browse Deals", "Buyer Matches", "Generate Offer")
- **Sentence case** for body copy and helper text
- **UPPERCASE + tracked** (`letter-spacing: 0.08em`) for eyebrow labels and nav section headers ("CRM", "FEATURED DEALS")
- **Oxford comma**, serial list. Complete sentences end in periods. Headlines usually don't.
- Numbers: always with separators (`$142,500`, not `142500`). Percentages with no space (`7.4%`).

### Pronouns

- **"We"** for Zona speaking as the company ("We're building the top-5 real estate transaction firm")
- **"You"** for addressing investors/sellers/partners ("Your Buyers List", "Get an offer in 24 hours")
- Never "I". Never "our team" unless specifically referring to internal staff.

### Examples of the Voice (lifted from the site)

- Hero: *"Zona Desert Is The Investor-First Marketplace For Creative Real Estate Deals Nationwide."*
- Eyebrow: *"Investor-Ready Platform"*
- Feature: *"Nationwide Private-Market Pipeline"* / *"Serious Buyers Only"*
- Section header: *"Curated Investment Opportunities. Updated Frequently."*
- Footer tag: *"Private-market opportunities curated for serious investors nationwide."*

### Words We Use

- **Deal / Deals** (not "property", "home", "house" in marketing)
- **Investor / Buyer** (not "customer", "user")
- **Creative finance** (novations, wraps, seller finance, sub-to)
- **Private-market / Off-market** (core differentiator)
- **Vetted / Curated** (signals quality filter)
- **Transaction** (not "closing" in ops UI — closing is one stage)

### Words We Do NOT Use

- "Dream home", "find your home", "your journey"
- "Cozy", "charming", "stunning" (consumer-real-estate slop)
- "AI-powered", "revolutionary", "cutting-edge" (hype)
- Emojis in product UI — ever. Allowed only in casual marketing copy (e.g. a 💡 tip callout in a blog post).
- Exclamation points in UI. Rare in marketing.

### Tone by Surface

- **Admin (internal)** — terse, functional. Column headers in ALL CAPS. Labels like "Stage", "Received", "Buyer", "Close Date".
- **Public marketing** — confident, conversion-forward. Short sentences. Trust signals prominent. **Text diet (v1.1):** every section gets a one-line lede (~440px measure max in heroes), body blurbs of 1–2 clipped sentences, and never more than three bullets. Mobile especially — cut copy before shrinking type.
- **Partners / signing** — instructional, urgent-but-clear. "Sign Here", "Action Needed: Upload Deed", "Cleared to Close".
- **Error states** — blunt and helpful. *"Email already in use. Try sign in instead."* Not *"Oops! Something went wrong 😕"*

---

## VISUAL FOUNDATIONS

### Color

Eight brand tokens, locked. Do not sample from screenshots — use the values below.

| Token | Hex | Use |
|---|---|---|
| Deep Purple | `#4A1988` | Primary buttons, active nav, table headers, logo mountain body |
| Bright Purple | `#7025B6` | Links, accents, focus rings, secondary CTA border |
| Orange-Red | `#FE642D` | Urgency, destructive, logo sun (warm side), error |
| Amber/Gold | `#FEA91E` | Warnings, logo sun (cool side) |
| Dark Navy | `#0E172A` | Primary text, admin sidebar, dark hero surfaces |
| Off-White | `#F1F2EF` | **Admin** page backgrounds |
| Sand | `#FBF7F1` | **Marketing** page backgrounds, input fills ("Arizona warm") |
| Sand Deep | `#F4ECDD` | Marketing alternate sections, warm emphasis blocks |

Pure white `#FFFFFF` is reserved for surfaces that sit *on top of* off-white or sand (cards, inputs on focus, modals). Marketing pages alternate white / sand / sand-deep / navy — off-white stays on admin.

**Gradients** are used deliberately, not decoratively:
- **Purple gradient** (`#4A1988 → #7025B6`) — brand moments, hero surfaces, the logo mountain. Vertical or diagonal 135°. Never on UI chrome (buttons/inputs).
- **Sun gradient** (`#FEA91E → #FE642D`) — the sun in the logo, and occasionally a featured CTA on marketing. Never in product UI.
- **Sun gradient as text** — on marketing display headlines, ONE key word may carry the sun gradient via `background-clip: text` (`linear-gradient(120deg, #FE642D 0%, #FEA91E 70%)` — note: orange → amber in this direction for text). Production example: the word "Reimagined" in the hero H1. One word per headline, display sizes only, never in body copy or product UI.

Semantic colors (success, warning, error, info, review) are fixed pairings — see `colors_and_type.css`. Never re-tint these; they must read as semantic signals.

### Type

**Two families. No exceptions.**

- **Sora SemiBold (600)** — brand hierarchy only: logo wordmark, page titles (32px), section headers (24px), KPI values (20–48px), nav section labels.
- **Inter Regular (400) / Medium (500)** — every piece of functional UI: nav items, tables, forms, buttons, body copy, captions, data.

Sora creates hierarchy. Inter carries the workload. **Do not flip them.** Using Sora on body text is the #1 way to break the system.

Type scale (locked):

| Role | Family | Size | Use |
|---|---|---|---|
| Display (marketing hero) | Sora 600 | 40 → 52 → 64px responsive | Marketing hero headline (mobile → sm → desktop). Tracking `-0.025em`, line-height `1.02–1.05` |
| Display (default) | Sora 600 | 48px | Hero/display headline everywhere else |
| H1 | Sora 600 | 32px | Page title |
| H2 | Sora 600 | 24px | Section header |
| H3 | Sora 600 | 20px | Sub-section |
| Metric | Sora 600 | 32–48px | KPI value |
| UI Label | Inter 500 | 16px | Nav, buttons, tabs |
| Body | Inter 400 | 15px | Body copy |
| Small | Inter 400/500 | 13px | Table cells, small print |
| Caption | Inter 400 | 12px | Timestamps, helper |

Line-height: `1.2` headings, `1.5–1.6` body. Heading letter-spacing: `-0.01em` (tighter on Display). Eyebrow labels: `0.08em` tracked, UPPERCASE, 12px.

### Spacing

8px grid. Tokens: `4, 8, 12, 16, 24, 32, 48, 64`. Card padding: `24px`. Section gutter: `24–32px`. Hero padding: `64px+` vertical.

### Backgrounds

- **Marketing hero (v1.1)** — **full-bleed immersive photo**, Zillow/Redfin-scale: real Arizona landscape photography as the section background at `min-height: 82svh` (mobile) / `min(88svh, 860px)` (desktop), on a `#0E172A` navy base. Readability comes from two stacked overlays, not opacity on the photo:
  1. Left-to-right navy wash — `linear-gradient(90deg, rgba(14,23,42,0.86) 0%, rgba(14,23,42,0.55) 45%, rgba(14,23,42,0.18) 100%)`
  2. Warm crown + navy floor — `linear-gradient(180deg, rgba(254,169,30,0.08) 0%, transparent 35%, rgba(14,23,42,0.45) 100%)`
  White content sits left-aligned over the wash (max ~680px), with a stat row on a `rgba(255,255,255,0.15)` hairline. The old "navy + image at 0.4 opacity" pattern is retired for marketing.
- **Admin pages** — flat `#F1F2EF` off-white with white cards floating on top.
- **Marketing body** — alternating sections of white / sand `#FBF7F1` / sand-deep `#F4ECDD` / navy.
- **Modals / overlays** — `rgba(14, 23, 42, 0.5)` over the page.

No repeating patterns. No textures. No hand-drawn illustrations. Imagery is reserved for real listing photos (drone shots, twilight exteriors) and the hero.

### Corner Radii

Rounded but *not* pill-shaped. Specifically:
- `4px` — tight badges
- `8px` — buttons, inputs (**admin** default); segmented/condition toggles on marketing
- `10px` — data tables; **marketing buttons and inputs** (default on marketing surfaces)
- `12px` — cards, metric cards
- `16px` — modals, KPI cards
- `20px` — large marketing feature/form cards (intake forms, quick-start card)
- `9999px` — status pills, filter chips, audience chips

### Borders

Subtle, not harsh.
- Default (admin): `1px solid #E2E8F0` (slate-200)
- Marketing hairline: `1px solid rgba(14, 23, 42, 0.06)` on cards, `rgba(14, 23, 42, 0.12)` on inputs — navy-tinted, warmer than slate on sand backgrounds
- Focus: `1px solid #7025B6` + `0 0 0 3px rgba(112, 37, 182, 0.12)` ring
- Error: `1px solid #FE642D`
- Dark surfaces: `rgba(255, 255, 255, 0.08)` dividers; `rgba(255,255,255,0.15)` hairlines over hero photos
- Nav dividers: `1px × 16px` vertical rules at `rgba(14, 23, 42, 0.15)` between header nav items and audience-strip entries

**Admin** cards use shadows, not borders, to separate from the page. **Marketing** cards pair a navy hairline (`rgba(14,23,42,0.06)`) *with* a soft float shadow — on warm sand backgrounds the hairline keeps edges crisp. Hover still swaps the hairline for `#7025B6` + lift.

**Marketing inputs (v1.1)** are sand-filled, not white: `background #FBF7F1`, border `rgba(14,23,42,0.12)`; on focus the fill flips to white with the purple border + ring. Inputs read as part of the warm page until active.

### Shadows / Elevation

Purple-tinted on card hovers; cool slate-tinted on resting elevation.

| Token | Shadow |
|---|---|
| Card (resting) | `0 2px 8px rgba(74, 25, 136, 0.08)` |
| KPI card | `0 4px 16px rgba(15, 23, 42, 0.06)` |
| Primary button | `0 4px 14px rgba(74, 25, 136, 0.25)` |
| Button hover | `0 6px 18px rgba(74, 25, 136, 0.35)` |
| Lift (marketing card hover) | `0 16px 36px rgba(74, 25, 136, 0.12)` |
| Card float (marketing feature/form cards) | `0 30px 60px -25px rgba(74, 25, 136, 0.25)` |
| Hero photo (framed imagery) | `0 30px 60px -20px rgba(74, 25, 136, 0.35), 0 10px 30px -10px rgba(254, 100, 45, 0.25)` |
| Surface (admin content wrap) | `0 10px 25px rgba(15, 23, 42, 0.08)` |
| Modal | `0 20px 60px rgba(14, 23, 42, 0.2)` |

### Cards

White background, 12–16px radius, 24px padding, subtle shadow, **no border** by default. On hover (if clickable): add `border: 1px solid #7025B6` + shadow lift. Never use harsh borders on cards.

### Buttons

Rounded `8px`. Three styles:

- **Primary** — `#4A1988` bg, white text, Inter 500 15px, padding `10px 20px`. Hover `#3D1570`.
- **Secondary** — transparent bg, `#7025B6` text, `2px solid #7025B6`.
- **Destructive** — `#FE642D` bg, white text.
- **Large CTA** (marketing / portals) — `10px` radius, `16px 32px` padding, Inter 600 16.5px, with the purple shadow (full-width inside form cards; intrinsic width in heroes).
- **Ghost on dark** (marketing, over photos/navy) — transparent bg, `1px solid rgba(255,255,255,0.35)` border, white text, subtle `backdrop-blur(2px)`; hover fills `rgba(255,255,255,0.1)`. Production example: "Sell Your Property →" in the hero.

No gradient fills on buttons. No pill-shaped buttons on forms.

### Animation

Restrained and functional. No bouncing, no spring physics, no stagger-on-scroll.

**One sanctioned exception (v1.1):** the mobile audience strip is a continuous slow linear marquee (single file, constant speed, edge-faded with a `mask-image` gradient, honors `prefers-reduced-motion`). Desktop stays static and centered. Do not add other continuous motion without this level of restraint.

- **Easing**: `ease` or `ease-out`. Hover transitions `0.12–0.15s`.
- **Hover**: color shift (darker purple, lighter row bg), shadow lift, `-translate-y-1` on listing cards.
- **Press**: no shrink; rely on filled color state.
- **Fades**: 0.15–0.2s opacity. Modals fade + scale from 0.98 → 1.
- **Loading**: a thin purple progress bar or "Loading..." in `#475569`. No skeleton shimmer pops.

### Hover States

- **Buttons (primary)**: bg darker (`#3D1570`), shadow grows
- **Buttons (secondary)**: bg fills with `rgba(112, 37, 182, 0.08)`
- **Nav items**: bg `rgba(255, 255, 255, 0.06)` on dark sidebar; `rgba(74, 25, 136, 0.08)` on light
- **Table rows**: bg `rgba(112, 37, 182, 0.08)` (a lavender wash)
- **Cards**: border fades in at `#7025B6`, shadow lifts
- **Links**: color shifts `#7025B6 → #4A1988`, sometimes underline

### Press / Active States

Primary buttons don't shrink — the filled darker state is the press feedback. Active nav items use a solid `#4A1988` fill + white text + Inter 600.

### Transparency & Blur

Used sparingly:
- Marketing header: sand at 85% (`rgba(251,247,241,0.85)`) + `backdrop-filter: blur(8px)` (sticky) — warm, not white
- Modal scrim: `rgba(14, 23, 42, 0.5)` — no blur
- Hero overlays: `rgba(14, 23, 42, 0.6)` over images
- Dark surface dividers: `rgba(255, 255, 255, 0.08)`

No frosted-glass cards. No blur on product UI.

### Imagery Vibe

- **Real photography for listings** — honest, as-is walkthrough and exterior photos are the brand on the deal board (this is an off-market board, not a staging catalog). Drone/twilight/architectural shots welcome when available; never staged family shots. All photos must be EXIF-normalized before upload (bake rotation AND clear the orientation flag — `magick -auto-orient` does both) so nothing renders sideways.
- **Portrait photos** — letterboxed on navy, centered, never cropped or stretched to fill. Galleries support swipe on touch plus arrows, and lightboxes size with viewport units (`svh`/`vw` + `object-fit: contain`) so every aspect ratio renders whole.
- **Hero imagery** — real Arizona landscape photography, full-bleed as the section background with the two v1.1 overlay gradients (see Backgrounds). The old 40%-opacity treatment is retired.
- **Logo** — purple gradient mountain with orange-to-amber sun at the peak. Modern, bold, layered geometric — never flat, retro, or hand-drawn. See `assets/zona-logo-mark.png` and variants.
- **No illustrations, no icons-as-hero, no abstract gradients-as-background.**

### Layout Rules

- Max content width: `1360px` hero and header, `1200px` body sections on marketing; `1440px` for admin
- Admin grid: `240px` sidebar + `1fr` main content. Collapsed: `64px + 1fr`.
- Marketing: centered single-column with 3-col feature grids. Mobile-first at `zonadesert.com` and `partners.zonadesert.com`.
- Marketing header (v1.1): three zones — logo hard-left, centered nav with thin vertical dividers (`1px` at `rgba(14,23,42,0.15)`), live-status pill + primary CTA hard-right. Full nav appears at the `xl` breakpoint; the primary header CTA routes to the deal board (**the site is buyer-first** — every major surface funnels to `/deals`).
- Admin sticky sidebar (nav) + scroll main. Marketing sticky header with blur.
- Data tables: full-width inside cards, horizontal-scroll on overflow.

---

## MARKETING V2 COMPONENT PATTERNS (v1.1)

Patterns that shipped on zonadesert.com and are now part of the system. The live site is the reference implementation — read `app/(v2)/` in `vandekkers/zona-desert-site` for the exact code.

### Eyebrow dash
Eyebrows pair the tracked-uppercase label with a short leading bar: `1.5px × 18px` rule, then the text. Amber bar + amber text on dark surfaces; purple-mid bar + deep-purple text on light. This is the standard section opener across marketing.

### Audience strip
A full-width band under the hero listing the audiences (LANDLORDS · FLIPPERS · BRRRR INVESTORS · SELLERS · AGENTS · WHOLESALERS) in Sora 600 at 40% navy, separated by thin vertical dividers. Desktop: static, centered, wraps. Mobile: the sanctioned continuous marquee (see Animation).

### Hero stat row
Real numbers over the hero photo: Sora 600 26px white values (unit suffixes in 14px amber), 11px tracked-uppercase labels at 50% white, sitting on a `rgba(255,255,255,0.15)` top hairline.

### Honest stats — hard rule
Every number shown on marketing is **computed from real deal data at build time** (live-deal count, total ARV on the board, etc.). No aspirational placeholders, no invented metrics, ever. If a number can't be computed, don't show it.

### Deal-board control bar
Search + filtering stays quiet and tucked: one search input (address/city/state/zip/type/strategy) plus small dropdown selects (Sort / Strategy / Price / Beds), a muted result count, and a clear button that only appears when filters are active. All controls use the marketing input treatment. The board renders complete server-side; filtering is a client-side enhancement.

### Intake forms
Sand-filled inputs (see Borders), 20px-radius white card with hairline + card-float shadow, segmented buttons and chips that fill navy when selected, one full-width 10px-radius primary CTA. On success the form swaps to a centered confirmation card (green check disc, Sora headline, short reassurance line). **Form data goes straight to the database via a server relay — submissions never open the visitor's mail or SMS app.**

### Contact rules
- Public email is `info@zonadesert.com` — the only address ever shown.
- The phone number is **never displayed as text**. It appears only behind `tel:` / `sms:` links ("Call" / "text").

---

## ICONOGRAPHY

### Approach

Zona's admin portal uses **hand-rolled inline SVG icons** defined directly in component files (e.g. `Submissions`, `Listings`, `Transactions`, `Completed` icons in `apps/admin/pages/index.tsx`). Style is:

- `20×20` viewBox (nav/KPI) or `16×16` (inline)
- `fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round`
- Feather / Lucide aesthetic — thin stroke, rounded caps, geometric

This matches **Lucide** (and Feather) almost exactly. Since the codebase doesn't ship an icon font or sprite, **we standardize on Lucide via CDN** for new work:

```html
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="clipboard-check"></i>
```

Or use Lucide React in JSX prototypes. This is a **substitution** from inline SVG → Lucide — visually indistinguishable, same stroke-weight and feel.

### Icon Color

- Default: `currentColor` (inherits text color — nav icons are `#94A3B8` at rest, `#FFFFFF` active)
- KPI card icons sit inside a `40×40` colored square (`10px` radius) tinted by accent (purple / amber / teal / blue at 12% opacity over the tint)

### Chevrons / Arrows

Admin sidebar uses `▸ / ▾` unicode glyphs (collapsed / expanded) at `10px` — this is an intentional choice from the codebase and should be preserved for the sidebar specifically. Elsewhere, use Lucide `chevron-right` / `chevron-down`.

### Emoji

**Never in product UI.** Allowed only in casual marketing copy (blog posts, occasional internal status notes). One exception observed in code: a `💡` tip prefix in README prose. Do not follow that pattern in UI.

### Unicode Glyphs as Icons

The admin uses `↑ ↓` for sort direction in data tables, `→ ←` for pagination, `▸ ▾` for nav collapse, `·` for bullets. These are fine — consistent and legible. Don't introduce new ones without a reason.

### Logo Usage

- **On off-white / white**: full-color mark + navy wordmark (`assets/zona-wordmark.png` horizontal, `assets/logo-stacked.png` vertical)
- **On dark surfaces**: full-color mark + **white** wordmark
- **Mark-only**: app favicons, compact nav (`assets/zona-logo-mark.png`)
- Minimum mark height: `32px`. Never recolor, stretch, or place on busy backgrounds.

---

## See also

- `preview/*.html` — individual design-system cards (Type, Colors, Spacing, Components, Brand)
- `ui_kits/admin/index.html` — full admin dashboard recreation
- `ui_kits/marketing/index.html` — marketing home + listings
- `ui_kits/partners/index.html` — partner action queue + signing screen
- `SKILL.md` — how to invoke this as a Claude Skill

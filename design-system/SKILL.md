# Zona Desert Design System — Skill Manifest

**Name:** Zona Desert Design System
**Version:** 1.1 (2026-07-09)
**Applies to:** All three Zona Desert products — Admin (`app.zonadesert.com`), Marketing (`zonadesert.com`), Partners (`partners.zonadesert.com`).

> **v1.1:** the live marketing site (site v2, `vandekkers/zona-desert-site`, `app/(v2)/*`) is the **reference implementation for marketing surfaces**. Where this folder and production differ on a marketing pattern, production wins. Key additions folded into README: sand surfaces (`#FBF7F1` / `#F4ECDD`), full-bleed immersive hero, 10px marketing button/input radius, sand-filled inputs, gradient headline word, audience marquee, honest-stats rule, contact rules.

## Purpose

Invoke this skill any time you design, mock, prototype, or build UI **for Zona Desert**. It is the single source of truth for colors, type, spacing, components, voice, and imagery across every surface. Do not mix in other systems. Do not sample colors from screenshots. The tokens below are locked.

## How to Use

1. **Read `README.md` first** — it is the canonical guide (CONTENT FUNDAMENTALS → VISUAL FOUNDATIONS → ICONOGRAPHY).
2. **Link `colors_and_type.css`** in every HTML file you create:
   ```html
   <link rel="stylesheet" href="/path/to/colors_and_type.css">
   ```
   It imports Sora + Inter from Google Fonts and exposes every token as a CSS variable (`--zd-purple-dark`, `--zd-font-display`, `--zd-shadow-card`, etc.).
3. **Copy logos from `assets/`** — use `logo-horizontal.png` by default, `logo-on-dark.png` on navy, `logo-stacked.png` for square formats. Never recreate or recolor.
4. **Reference `ui_kits/`** for the real thing:
   - `ui_kits/admin/index.html` — dashboard patterns (sidebar, KPI cards, pipeline, data tables, activity feed)
   - `ui_kits/marketing/index.html` — public site (hero, trust strip, features, listing grid, CTA band, footer)
   - `ui_kits/partners/index.html` — mobile-first action queue + signing flow

## Non-Negotiables

- **Type:** Sora 600 for hierarchy only (headlines, KPIs, section labels). Inter 400/500 for everything else. Never flip them.
- **Color:** Six brand tokens. Deep Purple `#4A1988` is the primary action color. Orange-red and amber are **warm accents only** — never primary UI. Pure white is reserved for cards on top of off-white pages.
- **No AI slop:** no stock photos of families, no gradient meshes, no emoji in product UI, no "dream home" copy, no rounded-corner-with-colored-left-border containers, no drawn SVG illustrations.
- **Icons:** Lucide (or hand-rolled inline SVG at `stroke-width: 1.75`, rounded caps). Nothing else.
- **Shadows, not borders**, separate cards from the page. Hover adds a purple-tinted shadow + `-translate-y-1`.

## Voice Cheatsheet

- **Title Case** headings and buttons. Oxford comma. No exclamation points in UI.
- Words to use: *Deal, Investor, Creative finance, Private-market, Vetted, Transaction.*
- Words to avoid: *Dream home, Cozy, Revolutionary, AI-powered.*
- Never "I". "We" for Zona, "you" for users.

## When in Doubt

Ground truth order: **the live site code (`app/(v2)/*`) for marketing surfaces** → `README.md` → `colors_and_type.css` → the three `ui_kits/` — in that order. Note: `ui_kits/marketing/index.html` predates site v2 (its hero and backgrounds are the retired v1.0 patterns) — treat it as a component sampler, not a layout reference. If none of them answer your question, ask the user rather than inventing new tokens, colors, or components.

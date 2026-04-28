# DESIGN.md — Zona Desert Visual Design System
**Version:** 1.0
**Last Updated:** April 2026
**Authority:** Read this file before writing any UI code across any of the three Zona Desert platforms. Every visual element must use this system. No exceptions.

---

## 1. DESIGN PHILOSOPHY

The Zona Desert platform targets top 5 in the market. Every UI must look and feel like it belongs to a company worth $1B — not a startup MVP. Clean, data-dense, premium, professional. The brand is present everywhere but never decorative.

Two audiences:
- **zona-admin**: Internal operator tool. Information density prioritized.
- **zonadesert.com + partners.zonadesert.com**: External-facing. Trust-building. Premium marketplace. Mobile-optimized.

---

## 2. COLOR SYSTEM

### Brand Tokens

| Token | Hex | Role |
|-------|-----|------|
| `--color-purple-dark` | `#4A1988` | Primary brand anchor. Primary buttons. Active nav. Key metrics. |
| `--color-purple-mid` | `#7025B6` | Accents. Secondary CTAs. Links. Sub-headings. |
| `--color-orange` | `#FE642D` | Highlights. Urgency. Error states. Destructive actions. |
| `--color-amber` | `#FEA91E` | Warmth. Secondary accents. Warnings. |
| `--color-navy` | `#0E172A` | Primary text. Page headings. Dark surfaces. |
| `--color-off-white` | `#F1F2EF` | Page backgrounds. Content areas. |

### Functional Colors

| Use | Value |
|-----|-------|
| Body text | `#0E172A` |
| Secondary text | `#475569` |
| Tertiary text | `#94A3B8` |
| Border default | `#E2E8F0` |
| Border focus | `#7025B6` |
| Surface white | `#FFFFFF` |
| Surface alt | `#F5F5F7` |
| Success | `#166534` text / `#F0FDF4` bg |
| Warning | `#92400E` text / `#FFFBEB` bg |
| Error/Urgent | `#991B1B` text / `#FEF2F2` bg |
| Info | `#1E40AF` text / `#EFF6FF` bg |

### Status Badge Colors

| Status | Background | Text |
|--------|-----------|------|
| Live / Active / Verified | `#DCFCE7` | `#166534` |
| Pending / In Progress | `#FEF3C7` | `#92400E` |
| Overdue / Failed / Critical | `#FEE2E2` | `#991B1B` |
| Sold / Closed | `#4A1988` | `#FFFFFF` |
| Archived / Inactive | `#F1F5F9` | `#64748B` |
| Review Required | `#EDE9FE` | `#5B21B6` |

---

## 3. TYPOGRAPHY

### Fonts
- **Sora SemiBold** — Brand presence: page titles, section headers, metric values. Creates hierarchy. Do not use for functional UI.
- **Inter Regular/Medium** — All functional UI: nav, tables, forms, buttons, body copy, labels.

### Loading
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Type Scale

| Level | Font | Size | Use |
|-------|------|------|-----|
| Display | Sora | 48px | Hero headlines |
| H1 | Sora | 32px | Page titles |
| H2 | Sora | 24px | Section headers |
| H3 | Sora | 20px | Sub-section headers |
| Metric Value | Sora | 32-48px | KPI numbers |
| Nav/UI Label | Inter | 16px | Navigation, buttons, tabs |
| Body | Inter | 15px | Body copy |
| Body Small | Inter | 13px | Table cells, secondary info |
| Caption | Inter | 12px | Timestamps, helper text |
| Logo Wordmark | Sora | 42-56px | Navy `#0E172A` only |

### Typography Rules
- Sora is for hierarchy — never for body copy or functional UI elements
- Inter weights: 400 (Regular) and 500 (Medium) only
- Sora weight: 600 (SemiBold) only
- Line heights: 1.2 for headings, 1.5-1.6 for body
- No tracked-out letter spacing

---

## 4. SPACING SYSTEM

8px base grid. All spacing is multiples of 4px or 8px.

| Token | Value | Use |
|-------|-------|-----|
| spacing-1 | 4px | Micro gaps |
| spacing-2 | 8px | Within components |
| spacing-3 | 12px | Input padding, tags |
| spacing-4 | 16px | Card padding, default gaps |
| spacing-6 | 24px | Between sections |
| spacing-8 | 32px | Large section spacing |
| spacing-12 | 48px | XL spacing |
| spacing-16 | 64px | XXL — hero sections |

---

## 5. COMPONENT PATTERNS

### 5.1 Buttons

**Primary** — Deep Purple background, white text
```css
background: #4A1988; color: #FFFFFF;
font-family: Inter; font-size: 15px; font-weight: 500;
padding: 10px 20px; border-radius: 8px; border: none;
/* hover */ background: #3d1570;
```

**Secondary** — Outlined
```css
background: transparent; color: #7025B6;
border: 2px solid #7025B6;
padding: 10px 20px; border-radius: 8px;
```

**Destructive** — Orange-Red
```css
background: #FE642D; color: #FFFFFF;
```

**Large CTA** (listing pages, portals)
```css
background: #4A1988; color: #FFFFFF;
font-size: 17px; font-weight: 600;
padding: 14px 28px; border-radius: 10px; width: 100%;
box-shadow: 0 4px 14px rgba(74, 25, 136, 0.3);
```

### 5.2 Cards
```css
background: #FFFFFF;
border: 1px solid #E2E8F0;
border-radius: 12px;
padding: 24px;
/* hover (clickable) */
border-color: #7025B6;
box-shadow: 0 2px 8px rgba(74, 25, 136, 0.08);
```

### 5.3 Data Tables
```css
/* Container */
border: 1px solid #E2E8F0; border-radius: 10px; overflow: hidden;
/* Header */
background: #4A1988; color: #FFFFFF;
font-size: 13px; font-weight: 600; padding: 12px 16px;
text-transform: uppercase; letter-spacing: 0.5px;
/* Data rows */
font-size: 14px; color: #0E172A; padding: 12px 16px;
border-bottom: 1px solid #F1F2EF;
/* Alternating: odd #FFFFFF, even #F5F5F7 */
/* Hover: background #F0EBF8 */
```

### 5.4 Form Inputs
```css
/* Input */
background: #FFFFFF; border: 1px solid #E2E8F0;
border-radius: 8px; padding: 10px 14px;
font-family: Inter; font-size: 15px; color: #0E172A; width: 100%;
/* Focus */
border-color: #7025B6;
box-shadow: 0 0 0 3px rgba(112, 37, 182, 0.12);
/* Label */
font-size: 13px; font-weight: 500; color: #475569; margin-bottom: 6px;
/* Required asterisk: color: #FE642D */
/* Error: border-color: #FE642D */
```

### 5.5 Navigation (Admin Portal)
```css
/* Rail background: #0E172A, width: 240px */
/* Nav item default: color: #94A3B8, font-size: 14px, font-weight: 500 */
/* Nav item hover: background rgba(255,255,255,0.06), color: #FFFFFF */
/* Nav item active: background: #4A1988, color: #FFFFFF */
/* Sub-menu: padding-left: 44px, font-size: 13px */
/* Divider: border-top: 1px solid rgba(255,255,255,0.08) */
```

### 5.6 Status Badges
```css
display: inline-flex; align-items: center;
padding: 3px 10px; border-radius: 9999px;
font-family: Inter; font-size: 12px; font-weight: 500;
/* Apply colors from Section 2 Status Badge Colors */
```

### 5.7 Metric Cards (KPI / Admin)
```css
background: #FFFFFF; border: 1px solid #E2E8F0;
border-radius: 12px; padding: 24px;
/* Metric value: Sora 36px SemiBold #0E172A */
/* Metric label: Inter 13px Medium #475569 */
/* Trend positive: #166534 */
/* Trend negative: #991B1B */
```

### 5.8 Modals
```css
/* Overlay: rgba(14, 23, 42, 0.5) */
/* Container: background #FFFFFF, border-radius: 16px, padding: 28px */
/* Width: min(560px, 90vw), max-height: 90vh */
/* Shadow: 0 20px 60px rgba(14, 23, 42, 0.2) */
/* Header: Sora 20px SemiBold #0E172A */
```

### 5.9 Callout Blocks
```css
/* Purple callout */
background: #F0EBF8; border-left: 4px solid #7025B6;
padding: 14px 16px; border-radius: 0 8px 8px 0;
/* Orange callout: border-left-color: #FE642D, background: #FEF2F2 */
/* Amber callout: border-left-color: #FEA91E, background: #FFFBEB */
```

### 5.10 Charts
- Primary color: `#4A1988` (Zona metrics)
- Secondary: `#FE642D` (comparison, costs)
- Tertiary: `#7025B6`
- No 3D. No gradients on bars. Clean and flat.
- Grid lines: `#F1F2EF` subtle
- Tooltips: white bg, navy text, purple border

---

## 6. LOGO USAGE

### 6.1 Asset Inventory

All logo assets live in `public/brand/` in each repo. The complete asset library is identical across zona-admin, zona-partners, and zona-desert-site so any platform can present any variant.

| Filename | Dimensions | When to use |
|----------|------------|-------------|
| `zona-logo-icon.png` | 1536×1024 | Compact spaces. Mountain mark only — no wordmark. Favicons, app icons, small UI badges, single-character avatars. |
| `zona-logo-primary-dark.png` | 1536×1024 | Standard lockup (mark + Zona Desert wordmark) on LIGHT backgrounds. Default choice for white/off-white surfaces. Wordmark navy `#0E172A`. |
| `zona-logo-primary-light.png` | 1536×1024 | Standard lockup on DARK backgrounds. Wordmark white. Use on purple-deep `#4A1988`, navy `#0E172A`, or photographic dark surfaces. |
| `zona-logo-secondary-dark.png` | 1536×1024 | Alternate lockup on LIGHT backgrounds. Use when primary lockup competes with adjacent UI or needs different proportions. |
| `zona-logo-secondary-light.png` | 1536×1024 | Alternate lockup on DARK backgrounds. Used on the public site coming-soon wall. |

### 6.2 Background Imagery

| Filename | Dimensions | When to use |
|----------|------------|-------------|
| `desert-site-wall-background.png` | 1672×941 | Hero/landing/coming-soon contexts on `zonadesert.com`. Full-bleed, `background-size: cover`. Pair with `zona-logo-secondary-light.png` and white text. |

### 6.3 Usage Rules

- All assets are 1536×1024 (3:2 aspect). Render with `width={N} height={Math.round(N * 2/3)}` to preserve ratio. Squashing is a brand violation.
- Light variants on dark backgrounds. Dark variants on light backgrounds. Never invert.
- Mountain mark minimum height: **32px**. Below this, use `zona-logo-icon.png` cropped tighter.
- Never recolor any element of the logo.
- Never stretch or distort.
- Never place on busy or low-contrast backgrounds without an overlay.
- Never combine the wordmark from one variant with the mark from another.
- All assets ship with transparent backgrounds. Do NOT re-encode without preserving alpha.

---

## 7. PLATFORM-SPECIFIC SURFACE RULES

### zona-admin
- Page bg: `#F1F2EF`
- Left nav: `#0E172A`
- Top bar: `#FFFFFF` with bottom border `#E2E8F0`
- Cards: `#FFFFFF`
- Table headers: `#4A1988`

### zonadesert.com
- Page bg: `#FFFFFF` or `#F1F2EF` by section
- Hero sections: `#0E172A` dark with white text optional
- Trust signals prominent

### partners.zonadesert.com
- Page bg: `#F1F2EF`
- Cards: `#FFFFFF`
- Mobile-first
- Action-needed badges use urgency colors prominently
- Signing experience: white bg, maximum clarity

---

## 8. RULES CLAUDE CODE MUST FOLLOW

1. **Read this file before writing any UI.** No exceptions.
2. **Never use default browser styles unmodified.** Everything must be explicitly styled.
3. **Never use colors not in Section 2.**
4. **Never use fonts other than Sora and Inter.**
5. **All three platforms must feel like the same brand.**
6. **Sora is for hierarchy. Inter is for function.** Do not swap them.
7. **No decorative gradients on UI components.**
8. **Status colors are semantic.** Never decorative.
9. **Mobile-first on zonadesert.com and partners.zonadesert.com.**
10. **When a component pattern doesn't exist in Section 5, flag it** — do not invent a new pattern.

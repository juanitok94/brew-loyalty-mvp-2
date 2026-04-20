# Rowan Coffee — Design System

**Maintained by:** Peachy Kean DevOps LLC  
**Brand:** Rowan Coffee — Asheville, NC  
**Product:** Brew Loyalty MVP — multi-tenant digital stamp card platform

---

## Sources

| Source | Path / URL | Notes |
|---|---|---|
| Brand logo | `assets/rowan-logo.webp` | Final brand file, provided directly |
| Website | `https://rowancoffee.com` | Shopify theme; HTML snapshot in `uploads/` |
| Website screenshot (above fold) | `uploads/rowan-home-above-fold.png` | Hero + nav |
| Website screenshot (below fold) | `uploads/rowan-home-below-fold.png` | Products + about block |
| App codebase | `github.com/juanitok94/brew-loyalty-mvp` (master) | Next.js/React, Vercel, Supabase |
| Session brief | `uploads/SESSION-BRIEF-rowan-onboarding.md` | Sprint brief: onboarding Rowan as tenant #2 |
| Claude context | `uploads/CLAUDE.md` | Full product + constraint context |

---

## Product Overview

**Brew Loyalty** is a multi-tenant digital loyalty stamp card platform for independent coffee shops. No app download required — customers enter a phone number, receive a digital stamp card, and show a QR code at the counter.

**Rowan Coffee** is tenant #2 (slug: `rowan`). Pilot tenant is **Odds Café** (slug: `odds`, West Asheville NC).

### User roles
- **Customer** — enters phone number, views stamp progress, shows QR to barista
- **Barista (admin)** — password-gated; looks up customers, adds/removes stamps, redeems rewards

### Core screens
| Route | Audience | Description |
|---|---|---|
| `/rowan` | Customer | Phone entry, Rowan-branded |
| `/rowan/card` | Customer | 3×3 stamp grid, QR code, progress |
| `/rowan/admin` | Barista | Password login |
| `/rowan/admin/customer` | Barista | Add stamp / remove / redeem |
| `/rowan/qr` | Barista | Printable QR for counter |

**Reward:** 9 stamps → 1 free drink ("Free drink"). Resets on redemption.

---

## CONTENT FUNDAMENTALS

### Voice & tone
- **Warm, unhurried, craft-forward.** Rowan presents itself as thoughtful and intentional — not precious, not corporate.
- **First-person brand voice:** "Rowan was founded on finding balance." Direct, declarative statements.
- **Second-person customer copy:** "See My Card," "Show this to your barista." Action-oriented, friendly imperative.
- **No emoji in brand copy.** The website uses no emoji at all. The loyalty app currently uses ☕ as a stamp icon — treat as a UI affordance, not brand voice.
- **Sentence case everywhere.** Nav items, CTAs, labels — all sentence case. ("Shop coffee", "Read more", "See my card")
- **Tagline:** "Striving for balance" — displayed in uppercase with very wide letter-spacing on the website. This is the only all-caps treatment.
- **Terse, minimal copy.** No marketing fluff. Short phrases over long sentences. Copy earns its place.
- **Local identity:** Both Asheville locations mentioned (60 Broadway St / 67 Haywood Rd). Community-rooted.

### Example copy
> "Rowan was founded on finding balance."  
> "Striving for balance"  
> "Coffee Subscriptions now available →"  
> "Show this at the counter"  
> "Not valid on smoothies or frappes. One stamp per drink"

---

## VISUAL FOUNDATIONS

### Colors
**Website palette:**
- Background: `#DFDFD8` (warm grey-cream) — dominant page background
- Black: `#000000` — hero, dark sections, nav background
- Teal accent: `#4C6762` — secondary brand color, links
- Gold-brown: `#8F6B41` / `#855832` — CTA labels, button text

**Logo palette:**
- Text fill: `#E8D9B0` (warm cream/tan)
- Diamond outline: `#7B5A2A` (warm brown)

**App palette (globals.css):**
- Background: `#FAF8F5`
- Brown primary: `#6B4F36`
- Brown muted: `#8B6F56`
- Brown dark: `#4A3526`
- Cream surface: `#F5EFE6`
- Stamp empty: `#E8DDD4`

→ Full token definitions in `colors_and_type.css`

### Typography
- **Display/heading:** Inknut Antiqua (serif, weight 500) — used on rowancoffee.com for all headings. Dignified, editorial feel.
- **Body/UI:** Instrument Sans (humanist sans, weight 400/600) — used on rowancoffee.com. Clean, legible.
- **App (current):** System font stack only (no custom fonts yet in the loyalty app). The design system spec upgrades this to Inknut Antiqua + Instrument Sans for Rowan's tenant.
- Both fonts available on Google Fonts — no substitution needed.

### Backgrounds & surfaces
- Website: full-bleed dark photography (espresso on wood tray, high contrast, warm light/shadow). Black nav on photos. Warm cream (#DFDFD8) for content sections.
- App: clean off-white (#FAF8F5), cream cards (#F5EFE6), white panels with 1.5px border.
- No gradients, no textures, no patterns.

### Imagery
- **Color vibe:** Warm, high-contrast. Rich browns, natural wood, white marble surfaces. Selective desaturation (the exterior building photo is B&W).
- **Style:** Still life / editorial photography. Quiet, deliberate composition. Heavy use of natural light and shadow.
- **No illustrations.** No hand-drawn elements. No icons as decorative elements.

### Corner radii
- Inputs: 8–12px (`--radius-sm` / `--radius-md`)
- Buttons: 12px (`--radius-md`)
- Cards / panels: 16–24px (`--radius-lg` / `--radius-2xl`)
- Stamps: full circle (`--radius-full`)
- Website: 0px — Shopify theme uses **zero radius** on all product cards and media. Very flat, architectural.

### Borders & shadows
- App: `1.5px solid #E8DDD4` on card containers. No drop shadows in app.
- Website: no visible borders, no shadows on product cards (`shadow-opacity: 0.0`).
- Shadow tokens defined for design use: subtle warm-brown tint.

### Animations
- **Stamp pop:** scale(0.5→1.15→1) with spring easing, 350ms, staggered 60ms per stamp.
- **Celebrate (reward ready):** gentle scale+rotate pulse, 600ms.
- **Easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)` — spring/bounce feel for stamps. Smooth ease-in-out for page transitions.
- **Website:** No visible animations observed.

### Hover / press states
- Buttons: `opacity: 0.85` on hover (disabled state uses `opacity: 0.6`). No color change.
- Links: color change to teal (#4C6762) on website.
- No scale transforms on press in current app.

### Layout rules
- App: centered single-column, max-width 384px (max-w-sm), px-6 gutters.
- Website: max-width 120rem, centered. Full-bleed hero images.
- Mobile-first. Verified on iPhone Safari.

### Use of transparency & blur
- Logo uses transparent background (PNG/WebP).
- No frosted glass / backdrop-filter observed.

### Iconography approach
See ICONOGRAPHY section below.

---

## ICONOGRAPHY

- **No icon system.** Neither the website nor the app uses an icon font, SVG sprite, or icon library.
- **Website:** Pure text navigation. No icons in nav, footer, or product cards.
- **App:** Only icon in use is the ☕ emoji as the stamp fill. This is a functional affordance, not decorative.
- **QR code:** Rendered programmatically via the `qrcode` npm package.
- **Arrows:** Website uses `→` (unicode right arrow) for CTAs like "Coffee Subscriptions now available →".
- **Design system recommendation:** If icons become necessary (e.g. barista action buttons), use [Lucide](https://lucide.dev) (CDN available) — stroke-based, minimal, pairs well with Instrument Sans. Flag any usage and keep it sparse.

---

## FILE INDEX

```
/
├── README.md                     ← This file
├── SKILL.md                      ← Agent skill descriptor
├── colors_and_type.css           ← Full CSS token system (colors, type, spacing, animation)
├── assets/
│   └── rowan-logo.webp           ← Final brand logo (transparent bg)
├── preview/                      ← Design System tab cards
│   ├── colors-brand.html
│   ├── colors-app.html
│   ├── colors-semantic.html
│   ├── type-display.html
│   ├── type-ui.html
│   ├── spacing-tokens.html
│   ├── spacing-radii.html
│   ├── component-buttons.html
│   ├── component-inputs.html
│   ├── component-stamp.html
│   ├── component-card.html
│   └── brand-logo.html
├── ui_kits/
│   └── loyalty-app/
│       ├── README.md
│       ├── index.html            ← Interactive click-thru prototype
│       ├── HomeScreen.jsx
│       ├── CardScreen.jsx
│       ├── AdminLogin.jsx
│       └── AdminDashboard.jsx
└── uploads/                      ← Source reference files (do not edit)
```

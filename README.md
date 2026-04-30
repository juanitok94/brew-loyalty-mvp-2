# Brew Loyalty — Rowan Coffee

Digital loyalty stamp card platform for independent coffee shops.
Built by Peachy Kean DevOps LLC.

---

## What it does

Customers enter their phone number at the counter (no app download required) and receive a digital stamp card. Baristas add stamps via a password-protected dashboard. After reaching the stamp target, customers earn a free drink.

---

## URLs staff need

| URL | Who uses it | Purpose |
|-----|-------------|---------|
| `/` | Customers | Enter phone number, see stamp card |
| `/admin?token=TOKEN` | Baristas | Login link — bookmarked on POS device |
| `/qr` | Owner | Printable QR code to post at counter |

The barista dashboard loads automatically after the token is verified. Give staff the `/admin?token=TOKEN` bookmark — they never type the token manually.

---

## Swapping branding for a new tenant

All shop-specific values live in one file:

```
src/config/shop.ts
```

Edit the exported `shopConfig` object:

```ts
export const shopConfig = {
  name: "Rowan Coffee",
  tagline: "Striving for balance",
  logoPath: "/rowan-logo.png",       // drop logo in /public
  location: "Asheville, NC",
  phone: "(828) 555-0123",           // used as input placeholder
  rewardDescription: "free drink",
  finePrint: "Not valid on smoothies or frappes. One stamp per drink",
  stampsRequired: 9,
  colors: { ... },
}
```

No other application files need to change for a rebrand.

---

## Environment variables

Set these in Vercel (or `.env.local` for local dev):

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SECRET_KEY` | Yes | Supabase service role key (server-only) |
| `NEXT_PUBLIC_SHOP_SLUG` | Yes | Shop slug matching the `shops` table row (e.g. `rowan-coffee`) |
| `ROWAN_ADMIN_TOKEN` | Yes | Secret token for the barista login link |

---

## Deploying

1. Push to `master` — Vercel auto-deploys
2. Set the four env vars above in the Vercel project dashboard
3. Confirm the `shops` table in Supabase has a row with a matching `slug`
4. Share the `/admin?token=TOKEN` link with staff

---

## Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS 4
- Supabase (Postgres) — server-side only, service role key
- Vercel

---

## Repo structure

```
src/
  app/
    page.tsx               ← customer phone entry
    card/page.tsx          ← customer stamp card
    admin/page.tsx         ← barista login gate
    admin/customer/page.tsx← barista dashboard
    qr/page.tsx            ← printable QR code
    api/
      stamps/              ← customer card GET/POST
      admin/               ← stamp, remove-stamp, redeem, lookup*
  config/
    shop.ts                ← ALL shop-specific values (single edit point)
  lib/
    stamps.ts              ← data access layer (Supabase)
    auth.ts                ← admin token verification
    db.ts                  ← Supabase client
    constants.ts           ← re-exports stampsRequired from shopConfig
docs/
  HANDOFF.md               ← new shop onboarding checklist
  URLS.md                  ← quick URL reference
  DECISIONS.md             ← locked architecture decisions
design-system/             ← Rowan-owned assets, do not modify
```

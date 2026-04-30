# New Shop Onboarding Checklist

Use this when adding a new tenant to Brew Loyalty. Each shop is a separate Vercel deployment of this repo (or a fork of it).

---

## 1. Gather config values from the shop owner

You need the following before touching any code:

| Value | Example | Notes |
|-------|---------|-------|
| Shop name | `Battlecat Coffee Bar` | Display name, used in UI and metadata |
| Tagline | `West Asheville's finest` | Shown under logo on homepage |
| Slug | `battlecat` | URL-safe, lowercase, matches `shops` table row |
| Location | `Asheville, NC` | Shown on printable QR page |
| Phone | `(828) 555-0199` | Used as input placeholder only |
| Reward description | `free drink` | e.g. "free coffee", "free pastry" |
| Fine print | `One stamp per drink` | Exclusion/terms shown on homepage |
| Stamps required | `9` | Number of stamps to earn the reward |
| Brand colors | hex values | headerBg, headerText, brandPrimary, etc. |
| Logo file | `battlecat-logo.png` | See logo spec below |

---

## 2. Logo spec

- Format: PNG with transparent background
- Size: at least 144×144px (displayed at 72×72px)
- Drop the file in `/public/` as `[slug]-logo.png`
- Reference it in `shopConfig.logoPath` as `"/[slug]-logo.png"`

---

## 3. Supabase — add the shop row

In the Supabase dashboard (or via SQL), insert a row into the `shops` table:

```sql
INSERT INTO shops (slug, name, stamps_required)
VALUES ('battlecat', 'Battlecat Coffee Bar', 9);
```

The `slug` value here must exactly match `NEXT_PUBLIC_SHOP_SLUG` in Vercel.

---

## 4. Update src/config/shop.ts

Edit the single config object:

```ts
export const shopConfig = {
  name: "Battlecat Coffee Bar",
  tagline: "West Asheville's finest",
  logoPath: "/battlecat-logo.png",
  location: "Asheville, NC",
  phone: "(828) 555-0199",
  rewardDescription: "free drink",
  finePrint: "One stamp per drink",
  stampsRequired: 9,
  colors: {
    background: "#...",
    foreground: "#...",
    headerBg: "#...",
    headerText: "#...",
    headerTextMuted: "rgba(...)",
    brandPrimary: "#...",
    brandLight: "#...",
    brandDark: "#...",
    cream: "#...",
    stampEmpty: "#...",
    stampFilled: "#...",
    rewardBg: "#...",
  },
} as const;
```

No other application files need to change.

---

## 5. Set environment variables in Vercel

In the Vercel project dashboard → Settings → Environment Variables, set:

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SECRET_KEY` | Supabase service role key |
| `NEXT_PUBLIC_SHOP_SLUG` | The shop slug (e.g. `battlecat`) |
| `SHOP_ADMIN_TOKEN` | A secret token you generate (see step 6) |

> Note: `SHOP_ADMIN_TOKEN` is the env var name in `src/lib/auth.ts`. If you fork for a new tenant, rename it to `[SHOP]_ADMIN_TOKEN` and update `auth.ts` accordingly.

---

## 6. Generate the admin token

The token can be any hard-to-guess string. Generate one:

```bash
openssl rand -hex 32
```

Set it as `SHOP_ADMIN_TOKEN` in Vercel. This is the value staff will use in the login URL.

---

## 7. Deploy

Push to `master` — Vercel auto-deploys. Confirm the deployment completes without errors in the Vercel dashboard.

---

## 8. Verify

- `/` — loads customer homepage with correct branding
- `/card?phone=8285550001` — shows a stamp card (creates a new customer)
- `/admin?token=YOUR_TOKEN` — redirects to barista dashboard
- `/admin/customer` — barista can look up customers and add stamps
- `/qr` — shows printable QR code

---

## 9. Hand off to the shop owner

Give them exactly two things:

| What | URL |
|------|-----|
| Customer-facing URL (for QR code / counter signage) | `https://your-deployment.vercel.app/` |
| Barista login link (bookmark on POS or phone) | `https://your-deployment.vercel.app/admin?token=YOUR_TOKEN` |

The barista link should be bookmarked on the device used at the counter. Staff never type the token — they just tap the bookmark.

# Rowan Coffee Loyalty App — UI Kit

**Product:** Brew Loyalty MVP — Rowan Coffee tenant  
**Design width:** 390px (iPhone-sized)  
**Stack reference:** Next.js / React / Tailwind / Supabase

## Screens

| File | Screen | Route |
|---|---|---|
| `HomeScreen.jsx` | Phone entry | `/rowan` |
| `CardScreen.jsx` | Customer stamp card + QR | `/rowan/card` |
| `AdminLogin.jsx` | Barista password login | `/rowan/admin` |
| `AdminDashboard.jsx` | Barista actions panel | `/rowan/admin/customer` |

## Usage

Open `index.html` in a browser — it renders all screens inside an iPhone frame with a tab switcher. Screens are interactive click-throughs (mock data only, no real API calls).

**Admin login demo password:** `demo`

## Component notes

- All components accept simple props; no context/store required
- Navigation is handled by the parent `App` in `index.html` via callbacks (`onSubmit`, `onBack`, `onLogin`, `onLogout`)
- Stamp count, redeemed count, and phone are passed as props to `CardScreen` and computed locally in `AdminDashboard`
- Mock action delay: 400–600ms to simulate API calls

## Fonts

- **Inknut Antiqua** (Google Fonts) — headings, brand name
- **Instrument Sans** (Google Fonts) — all body/UI copy

## Brand tokens (quick ref)

```
--brown:        #6B4F36   primary CTA, stamp filled
--brown-light:  #8B6F56   muted text
--brown-dark:   #4A3526   headings
--cream:        #F5EFE6   card surfaces
--bg:           #FAF8F5   page background
--stamp-empty:  #E8DDD4   unfilled stamps
--teal:         #4C6762   secondary accent
```

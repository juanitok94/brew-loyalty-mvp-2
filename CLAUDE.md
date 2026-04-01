# brew-loyalty-mvp — Claude Context

## Project Summary

Digital loyalty stamp card MVP for **Odds Cafe**, West Asheville NC (owner: Audrie Blomquist).

- Customer scans QR → enters phone → sees 8-stamp card → earns free drink
- Owner uses /admin to add stamps and redeem rewards
- No database — JSON file only (src/data/stamps.json)
- PWA (no app download required)

## Stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS 4
- Data: `src/data/stamps.json` (flat file, no DB)
- Deploy: Vercel + GitHub (juanitok94/brew-loyalty-mvp)

## Brand

- Coffee brown accent: `#6B4F36`
- CSS vars: `--brown`, `--brown-light`, `--brown-dark`, `--cream`, `--stamp-empty`, `--stamp-filled`
- System font stack (-apple-system), Apple.com aesthetic, mobile-first

## Key Files

| File | Purpose |
|------|---------|
| `src/data/stamps.json` | All customer data (phone → stamps/lastVisit/redeemed) |
| `src/lib/stamps.ts` | Data access layer: readDB/writeDB/addStamp/redeemReward |
| `src/lib/auth.ts` | Admin password check (ODDS_ADMIN_PASSWORD env var) |
| `src/app/api/stamps/route.ts` | GET/POST — customer lookup/create |
| `src/app/api/admin/stamp/route.ts` | POST — add stamp (password protected) |
| `src/app/api/admin/redeem/route.ts` | POST — redeem reward (password protected) |
| `src/app/api/admin/lookup/route.ts` | POST — lookup customer (password protected) |
| `src/app/page.tsx` | Customer: enter phone number |
| `src/app/card/page.tsx` | Customer: view stamp card |
| `src/app/admin/page.tsx` | Admin: password login |
| `src/app/admin/customer/page.tsx` | Admin: stamp + redeem dashboard |
| `src/app/qr/page.tsx` | Printable QR code for counter display |

## Data Shape

```json
{
  "+18285550123": {
    "stamps": 3,
    "lastVisit": "2026-04-01",
    "redeemed": 1
  }
}
```

Phone keys are always stored as E.164 (`+1XXXXXXXXXX`).

## Environment Variables

```
ODDS_ADMIN_PASSWORD=your-secure-password-here
```

Set in `.env.local` for dev, and in Vercel dashboard for production.

## Stamp Logic

- 8 stamps = 1 free drink reward unlocked
- On redeem: stamps reset to 0, redeemed count increments
- Customers are auto-created on first phone lookup

## Admin Auth Pattern

Admin password is sent with every API request body (not a session cookie). The admin page stores it in `sessionStorage` for the session. This is MVP-grade security appropriate for a small cafe.

## Vercel Deployment Note

`src/data/stamps.json` is writable in development but **read-only on Vercel's serverless filesystem**. For production persistence, upgrade to Vercel KV (Redis) or a simple Postgres. The data layer is isolated in `src/lib/stamps.ts` — swapping the backend is a single-file change.

# Brew Loyalty MVP — Odds Cafe

Digital loyalty stamp card for **Odds Cafe**, West Asheville NC.

Buy 8 coffees → Get 1 FREE. No app download needed.

## Quick Start

```bash
npm install
cp .env.example .env.local
# Edit .env.local and set ODDS_ADMIN_PASSWORD
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Who | What |
|-------|-----|------|
| `/` | Customer | Enter phone number |
| `/card?phone=XXXXXXXXXX` | Customer | View stamp card |
| `/admin` | Audrie | Password login |
| `/admin/customer` | Audrie | Add stamp / redeem reward |
| `/qr` | Audrie | Printable QR code for counter |

## Environment Variables

```
ODDS_ADMIN_PASSWORD=your-secure-password-here
```

Set in `.env.local` locally. Set in Vercel dashboard for production.

## Deploy to Vercel

1. Push to GitHub: `juanitok94/brew-loyalty-mvp`
2. Import repo in Vercel dashboard
3. Add `ODDS_ADMIN_PASSWORD` environment variable
4. Deploy

> **Note:** The JSON file store works in development. For production with persistent data across deployments, upgrade to Vercel KV. See `src/lib/stamps.ts` to swap the backend — it is one file.

## Tech Stack

- Next.js 15, TypeScript, Tailwind CSS 4, App Router
- PWA (manifest + apple-touch-icon)
- Data: `src/data/stamps.json` (flat file, no database)

## Owner: Peachy Kean DevOps LLC

Built for Audrie Blomquist / Odds Cafe by John Kean.

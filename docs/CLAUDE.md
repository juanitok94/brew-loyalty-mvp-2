# CLAUDE.md
## BrewLoyalty — Claude Code Auto-Context

> Auto-loaded at Claude Code session start.
> Keep this short. Full context in `/docs/PROJECT-BRAIN.md`.

---

## One-Liner
Digital loyalty stamp card for coffee shops. Customer scans QR, barista taps "Add Stamp," card updates in 5s via polling. No app download needed.

## Status
MVP live and demoed. Post-MVP. NDA in progress with Odd's Cafe (West Asheville NC).

## Repo / Deploy
- GitHub: https://github.com/juanitok94/brew-loyalty-mvp
- Live: https://brew-loyalty-mvp.vercel.app
- Deploy: auto on `git push` to main

## Stack
- Next.js 15 / TypeScript / Tailwind CSS 4 / PWA
- **Data: LanceDB** (not Vercel KV — see DECISIONS.md)
- All data access via `src/lib/stamps.ts` only

## Critical Numbers
- Stamp target: **9**
- Polling interval: **5 seconds**
- QR encodes: **full URL**
- Auth: `ODDS_ADMIN_PASSWORD` env var (writes only)

## Key Files
```
src/lib/stamps.ts       ← only entry point to LanceDB. touch this first.
src/app/page.tsx        ← customer card (polling lives here)
src/app/admin/page.tsx  ← barista stamp UI
```

## Rules
- Never bypass `stamps.ts` to access data directly
- Never commit secrets — password is env var only
- Don't break PWA manifest or Vercel auto-deploy

## For Full Context
`/docs/PROJECT-BRAIN.md` — stack, flows, roadmap, business context
`/docs/DECISIONS.md` — why things are the way they are
`/docs/CODEX-PROMPTS/` — implementation specs for Codex

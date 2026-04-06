# PROJECT-BRAIN.md
## BrewLoyalty — Master Context Document

> Rule: If it's not in `/docs`, it doesn't exist.
> Primary source of truth. Update when reality changes.

**Last Updated:** 2026-04-06
**Status:** MVP live. Demo complete. Post-MVP refinement in progress.
**Repo:** https://github.com/juanitok94/brew-loyalty-mvp
**Live URL:** https://brew-loyalty-mvp.vercel.app

---

## 1. What Is This?

Digital loyalty stamp card for SMB coffee shops. No app download required.

- Customer scans QR code → stamp card loads on their phone
- Barista uses native iPhone camera → opens link → taps "Add Stamp"
- Card updates automatically via polling
- MVP deployed and demoed at Odd's Cafe, West Asheville NC

---

## 2. Current Stack

```
Frontend:   Next.js 15 (App Router)
            TypeScript
            Tailwind CSS 4
            PWA (manifest, apple-touch-icon)
            Official BrewLoyalty logo (replaces emoji placeholders)

Data:       LanceDB  ← current MVP data store (remote URI + API key, persistence confirmed)
            Planned: PostgreSQL via Supabase (by choice, when scaling to SaaS)
            src/lib/stamps.ts  ← ALL data access goes through here (never bypass)

Auth:       ODDS_ADMIN_PASSWORD  ← env var, protects all write operations

Deploy:     Vercel (auto-deploy on git push)
```

---

## 3. Core Product Settings

| Setting | Value |
|---------|-------|
| Stamp target | **9 stamps** |
| Card polling interval | **5 seconds** |
| QR code content | **Full URL** (routes directly to correct page) |
| Customer identity | **Phone number** (no account, no password) |
| Scanner method | **Native iPhone camera** (no in-app scanner library) |

---

## 4. User Flows

### Customer Flow
1. Open iPhone camera → scan QR code posted at counter
2. Camera auto-opens URL in Safari (no app install needed)
3. Enter phone number → stamp card loads
4. Card shows stamps (e.g. "5 / 9")
5. Page polls every 5s → updates automatically after barista stamps

### Barista Flow
1. Customer shows QR code (or barista scans counter QR)
2. Native iPhone camera opens link
3. Tap **"Add Stamp"**
4. Customer's card updates within 5 seconds

---

## 5. API Routes

### Read (no auth required)
```
GET /api/customers?phone={phone}
  → { name, stamps, stampsUntilReward }
```

### Write (requires ODDS_ADMIN_PASSWORD)
```
POST /api/admin/stamp    { phone, adminPassword }   → +1 stamp, log transaction
POST /api/admin/redeem   { phone, adminPassword }   → mark redeemed, reset stamps
GET  /api/admin/customers?adminPassword={pw}        → all customers
```

---

## 6. What's Done vs. What's Next

### ✅ Done (MVP)
- Full stamp/redeem flow end-to-end
- LanceDB data store (remote URI, persistence confirmed)
- QR code with full URL routing
- 5s polling on customer card
- Official logo replacing emoji placeholders
- PWA (add to home screen)
- Demo completed with Audrie (Odd's Cafe) — positive feedback received
- NDA in progress: Peachy Kean DevOps LLC ↔ Odd's Cafe

### 🔧 Next (V1.1)
- Confirm stamp target with Audrie (9 is current)
- UX refinements from real usage feedback
- Possible: SMS on reward earned (Twilio)

### 📋 V2
- Square POS webhook → auto-stamp on purchase
- Multi-location support

### 🔮 V3
- Multi-tenant SaaS, Stripe billing, analytics

---

## 7. Business Context

**Peachy Kean DevOps, LLC** — Owner: Juan. DevOps + AI-assisted development.
**Odd's Cafe** — Owner: Audrie. West Asheville NC. First pilot client. NDA in progress.
**Model:** SaaS recurring ($29–$59/mo per location), not one-time project fee.

---

## 8. AI Tool Roles

| Tool | Use For |
|------|---------|
| **Claude** | Docs, architecture, contracts, long-form reasoning |
| **ChatGPT** | Fast decisions, debugging, UX iteration |
| **Codex** | Multi-file implementation from `/docs/CODEX-PROMPTS/` specs |
| **Claude Code** | Terminal, git, tests, Vercel CLI |

---

## 9. Key Files

```
src/lib/stamps.ts          ← all data logic — only entry point to LanceDB
src/app/page.tsx           ← customer card page (polling here)
src/app/admin/page.tsx     ← barista stamp UI
docs/PROJECT-BRAIN.md      ← you are here
docs/DECISIONS.md          ← why things are the way they are
docs/CODEX-PROMPTS/        ← implementation prompt templates
CLAUDE.md                  ← auto-loaded by Claude Code
README.md                  ← public
```

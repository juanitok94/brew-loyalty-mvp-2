# brew-loyalty-mvp — Claude Context

## Project Summary

Digital loyalty stamp card MVP for **Odds Cafe**, West Asheville NC (owner: Audrie Blomquist).

* Customer scans QR → enters phone → sees stamp card → earns free drink
* Owner uses /admin to add stamps and redeem rewards
* Current data layer: JSON file (src/data/stamps.json) → migrating to Supabase
* PWA (no app download required)

---

## Global Workflow & Patterns

This project follows the Peachy Kean DevOps AI playbook:

https://github.com/juanitok94/ai-playbook

Use that repo for:

* **AI-OPERATING-SYSTEM.md** → roles, rules, XP loop
* **XP-WORKFLOW.md** → sprint execution
* **PATTERNS/SUPABASE.md** → database + persistence patterns

---

## Project Source of Truth

All project-specific context lives here:

* `docs/PROJECT-BRAIN.md` → master context
* `docs/DECISIONS.md` → locked decisions only
* `docs/ARCHITECTURE.md` → system design

If it’s not in `/docs`, it doesn’t exist.

---

## Execution Model

* Implementation is driven by **SESSION-BRIEF.md**
* SESSION-BRIEF is generated fresh each sprint (not permanent)
* Claude Code executes only from SESSION-BRIEF
* Do not infer beyond the brief
* Stop and ask if anything is ambiguous

---

## Stack

* Next.js 15 (App Router), TypeScript, Tailwind CSS 4
* Current data: `src/data/stamps.json` (flat file, being replaced)
* Target data layer: Supabase (Postgres, server-side only)
* Deploy: Vercel + GitHub (juanitok94/brew-loyalty-mvp)

---

## Core Constraints (V1.1)

* Supabase = persistence layer
* No Supabase Auth
* Phone = lookup only (not a security boundary)
* All DB access = server-side only (service role)
* Event-based model (stamp_events → derived state)
* No client-side Supabase usage

---

## Key Files

| File                                | Purpose                                            |
| ----------------------------------- | -------------------------------------------------- |
| `src/data/stamps.json`              | Current MVP data store (temporary)                 |
| `src/lib/stamps.ts`                 | Data access layer (will transition to Supabase)    |
| `src/lib/auth.ts`                   | Admin password check (ODDS_ADMIN_PASSWORD env var) |
| `src/app/api/stamps/route.ts`       | GET/POST — customer lookup/create                  |
| `src/app/api/admin/stamp/route.ts`  | POST — add stamp                                   |
| `src/app/api/admin/redeem/route.ts` | POST — redeem reward                               |
| `src/app/api/admin/lookup/route.ts` | POST — lookup customer                             |
| `src/app/page.tsx`                  | Customer: enter phone                              |
| `src/app/card/page.tsx`             | Customer: view card                                |
| `src/app/admin/page.tsx`            | Admin login                                        |
| `src/app/admin/customer/page.tsx`   | Admin dashboard                                    |
| `src/app/qr/page.tsx`               | QR code display                                    |

---

## Current Data Shape (MVP)

```json
{
  "+18285550123": {
    "stamps": 3,
    "lastVisit": "2026-04-01",
    "redeemed": 1
  }
}
```

Phone keys are stored as E.164 (`+1XXXXXXXXXX`).

---

## Stamp Logic

* 9 stamps = 1 free drink reward unlocked
* On redeem: stamps reset to 0, redeemed count increments
* Customers are auto-created on first phone lookup

---

## Admin Auth Pattern

* Admin password sent with each API request body
* Stored in `sessionStorage` during session
* No cookies or session auth (MVP-grade, acceptable risk)

---

## Guardrails

* Do not make architecture decisions during implementation
* Do not expand scope beyond SESSION-BRIEF
* Do not bypass `src/lib/stamps.ts` for data access
* Never expose service role key to client code
* Stop and ask if anything is unclear

---

## Definition of Done

* Acceptance tests in SESSION-BRIEF pass
* DECISIONS.md updated if needed
* Feature verified in preview or production
* Claude + ChatGPT review complete
* Juan signs off

---

## Migration Note (Current Priority)

`src/data/stamps.json` is writable in development but **read-only on Vercel**.

Next step:

→ Replace JSON storage with Supabase using patterns from `ai-playbook/PATTERNS/SUPABASE.md`

This should be implemented without changing UI behavior.

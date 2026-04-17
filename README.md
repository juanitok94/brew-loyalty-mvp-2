# Brew Loyalty MVP — Project Summary

## Overview

Digital loyalty stamp card for **Odd’s Cafe** (West Asheville, NC).

Customers scan a QR code, enter their phone number, and receive a digital stamp card. Baristas add stamps via an admin interface. After reaching the stamp target, customers earn a free drink.

No app download required. Mobile-first PWA.

---

## Stack

* Next.js 15 (App Router)
* TypeScript
* Tailwind CSS 4
* Vercel (hosting + deployment)
* Supabase (Postgres) — persistence layer (V1.1)

---

## Current Status

```text
MVP UI + flows        ✅ complete
AI system + workflow  ✅ complete
Schema + decisions    ✅ locked
Persistence           ⏳ in progress (Supabase migration)
```

---

## Core Product Flow

1. Customer scans QR code
2. Enters phone number
3. Views stamp card
4. Barista adds stamps via `/admin`
5. Customer earns reward after reaching stamp target

---

## Architecture (V1.1)

### Identity Model

* Phone number = lookup key
* No user accounts
* No authentication for customers

### Admin Access

* Protected by environment variable:

  ```
  ODDS_ADMIN_PASSWORD
  ```

---

## Data Model (Supabase)

Tables:

* `customers`
* `locations`
* `customer_location_cards`
* `stamp_events` (append-only event log)

Derived:

* `stamp_progress` (SQL view — never written to directly)

---

## Key Design Decisions

* **Supabase Postgres** replaces JSON-based storage
* **Server-side only DB access** (service role, never client-side)
* **No Supabase Auth** (overkill for this use case)
* **Event-based model** (no mutable counters)
* **SQL view for aggregation** (not app-side logic)
* **Migration files are the source of truth** (not dashboard edits)

Full details: see `docs/DECISIONS.md`

---

## AI-Assisted Development System

This project uses a structured XP-style workflow with multiple AI tools:

* **Claude** → architecture, schema, docs, reasoning
* **ChatGPT** → implementation clarity, SESSION-BRIEF generation
* **Claude Code** → execution (writes code from spec)

All work is driven by:

* `AI-OPERATING-SYSTEM.md`
* `XP-WORKFLOW.md`
* `PATTERNS/SUPABASE.md`

---

## Workflow

1. Define task via `SESSION-BRIEF.md`
2. Execute via Claude Code
3. Review + refine
4. Commit + deploy
5. Merge to `master` after promotion

No architecture changes during implementation.

---

## Constraints (V1.1)

* No authentication system
* No client-side database access
* No UI redesign
* Single location (Odd’s Cafe)
* Keep implementation simple (KISS / Occam’s Razor)

---

## Repository Structure (high-level)

```
src/
  app/
    api/
    admin/
    card/
  lib/
    stamps.ts   ← data access layer (single source of truth)

docs/
  DECISIONS.md
  PROJECT-BRAIN.md (optional)

ai-playbook/
  AI-OPERATING-SYSTEM.md
  XP-WORKFLOW.md
  PATTERNS/
```

---

## Next Step

Implement Supabase migration:

* Create migration files
* Add `db.ts` (server-only client)
* Refactor `stamps.ts`
* Update API routes
* Preserve existing UX

---

## Notes

This project prioritizes:

* Simplicity over completeness
* Speed of iteration
* Real-world usability for a small business

Future features (analytics, multi-location, user accounts) will be added only when justified by actual usage.

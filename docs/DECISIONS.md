# DECISIONS.md
## BrewLoyalty — Decision Log

> Anti-amnesia system. Every decision that cost time goes here.
> When in doubt, check here before re-deciding.

**Last Updated:** 2026-04-06

---

## Scan Flow

### Native iPhone camera over in-app QR scanner
- Faster and more reliable than any JS scanner library
- Zero code, zero dependency, zero maintenance
- Works on all modern iPhones out of the box
- Trade-off: Android behavior varies — acceptable for MVP (Odd's Cafe is iPhone-heavy)

### QR encodes a full URL (not a code or token)
- Camera auto-opens Safari without any intermediate step
- URL routes directly to the correct page (admin or customer)
- Simpler than encoding an ID and resolving it server-side
- Trade-off: URL exposed in QR — acceptable, no sensitive data in URL

---

## Data & State

### LanceDB as data store
- Lightweight, no server to manage, runs embedded
- Good fit for read-heavy loyalty data (stamp counts, not transactions)
- Trade-off: not a traditional relational DB; no complex joins needed so not a problem
- Note: Vercel KV was considered and documented — LanceDB won for simplicity at MVP scale

### LanceDB is MVP-only — not the long-term system of record
- Good enough to validate the flow, ship the MVP, and run the demo
- **Persistence confirmed:** `stamps.ts` connects via remote URI + API key, not a local path. Data survives Vercel redeployments. No data loss risk.
- **MVP-only by choice**, not due to risk — Supabase/Postgres is the planned migration for SaaS scale (see below)

### Long-term data store: PostgreSQL via Supabase
- **Why Supabase over raw Postgres:** Managed, fast to stand up, good dashboard, easy for solo operator workflow, easy to outgrow if needed
- **Why Postgres over LanceDB long-term:** Stronger durability, relational model, multi-location reporting, multi-tenant SaaS growth
- **Migration approach:** Swap the backend behind `stamps.ts` only — the app and API routes do not change
- **Minimal target schema:**
  - `customers` — id, phone, name, location_id, stamps, redeemed_count, last_visit, created_at
  - `stamp_transactions` — id, customer_id, action, stamp_delta, resulting_stamps, created_at
  - `locations` — id, slug, name, stamp_target, reward_text, created_at
- **Timing:** Not urgent — design schema first, then migrate. Not a current emergency.

### stamps.ts as the only data access layer
- Pages never import from DB directly
- One file to swap if we change backends (LanceDB → KV → Postgres)
- Rule: all DB calls go through `src/lib/stamps.ts`, nothing else

### Stamp target = 9
- Set based on Odd's Cafe context (Audrie's preference)
- Not hardcoded in UI — confirm with Audrie before changing
- Should be configurable per location in V2

---

## Real-Time vs. Polling

### Polling every 5 seconds over WebSockets or SSE
- Simpler to implement and maintain
- 5s lag is invisible to users in practice (barista stamps → customer looks down)
- WebSockets add server complexity with no meaningful UX benefit at this scale
- Re-evaluate only if lag becomes a real complaint from baristas or customers

---

## Identity & Auth

### Phone number as customer identity (no account creation)
- Lowest friction possible — customers won't sign up for a stamp card
- Phone is memorable and universally available
- Trade-off: anyone knowing a phone number can look up that card — acceptable, no sensitive data shown
- Not changing this for V2 unless a customer explicitly requests it

### Single shared admin password (no per-user auth)
- Audrie is the only admin at MVP
- Adding user accounts adds complexity with zero V1 benefit
- Password lives in Vercel env var only — never in code or git
- Re-evaluate for V2 if multi-barista or franchise model emerges

---

## Frontend

### PWA over native app
- No App Store, no install friction for customers
- Baristas bookmark the admin URL — no install needed
- Trade-off: no push notifications without extra work — not needed for V1

### Official logo over emoji placeholders
- Completed during MVP polish before Audrie demo
- Sets professional tone for client presentation

---

## Business

### Pilot with Odd's Cafe before productizing
- Real-world validation shaped the UX (especially scan flow and polling interval)
- NDA in progress — formalizes the relationship before V1.1 handoff

### SaaS model ($29–$59/mo), not project fee
- Recurring revenue is the goal, not one-time builds
- Odd's Cafe is the proof point — then expand to other SMB cafes

### locationId as human-readable slug (e.g. `odds`)
- Easier to debug in logs and DB than UUIDs
- Convention: short lowercase café name slug
- Multi-location is additive — add new slugs, existing data untouched

---

## AI Tooling

### CLAUDE.md auto-loaded by Claude Code
- Eliminates re-explaining the project at session start
- Keep it under one page — full context in PROJECT-BRAIN.md

### Docs in `/docs` are the source of truth, not chat history
- Chat history is ephemeral and scattered across tools
- If a decision was made in chat but not written here, it doesn't count
- Rule: after any AI session that produces a decision, update this file

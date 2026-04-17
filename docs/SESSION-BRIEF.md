## SESSION-BRIEF — brew-loyalty-mvp — 2026-04-08 — Supabase migration implementation

### 0. Context source
- AI-OPERATING-SYSTEM.md
- XP-WORKFLOW.md
- SUPABASE.md
- DECISIONS.md
- SCHEMA-V1-PROPOSAL.sql
- CLAUDE.md

### 1. Project snapshot
Digital loyalty stamp card MVP for Odd’s Cafe, West Asheville NC. Customer scans QR, enters phone, and views a stamp card; admin adds stamps and redeems rewards through `/admin`. Current persistence is JSON-based and must be replaced with Supabase Postgres using the already locked event-based schema and server-only access pattern. The implementation executor is Claude Code, and this sprint is implementation only — not design. :contentReference[oaicite:0]{index=0} :contentReference[oaicite:1]{index=1} :contentReference[oaicite:2]{index=2}

### 2. Decision already made (do not re-litigate)
- Supabase Postgres is the persistence layer replacing ephemeral JSON/LanceDB-style storage. :contentReference[oaicite:3]{index=3}
- No Supabase Auth for V1.1; phone is a lookup key only, not a security boundary. :contentReference[oaicite:4]{index=4}
- All Supabase access is server-side only using the service role key; no client-side Supabase access of any kind. :contentReference[oaicite:5]{index=5} :contentReference[oaicite:6]{index=6}
- Migration files are the source of truth for schema; dashboard is for inspection only. :contentReference[oaicite:7]{index=7} :contentReference[oaicite:8]{index=8}
- `customer_location_cards` is included in V1 and is the canonical loyalty card entity. :contentReference[oaicite:9]{index=9}
- `stamp_events` is append-only; never update or delete rows. :contentReference[oaicite:10]{index=10}
- `stamp_events.type` is `TEXT + CHECK`, not enum. :contentReference[oaicite:11]{index=11}
- `idempotency_key` exists but is not UNIQUE-enforced in V1. :contentReference[oaicite:12]{index=12}
- `stamp_progress` is a standard SQL view, not a materialized view and not app-side aggregation. :contentReference[oaicite:13]{index=13}
- `stamps_until_reward` is clamped with `GREATEST(0, ...)`. :contentReference[oaicite:14]{index=14}
- `locations.stamp_target` has `CHECK (stamp_target > 0)`. :contentReference[oaicite:15]{index=15}
- Default location seed is Odd’s Cafe via idempotent insert on slug conflict. :contentReference[oaicite:16]{index=16}
- All Supabase access must flow through a single server entry point and the domain layer; for this project, `src/lib/stamps.ts` remains the single source of truth for business/data access. :contentReference[oaicite:17]{index=17} :contentReference[oaicite:18]{index=18}

### 3. Decision still open (input wanted)
None

### 4. Task
Replace JSON-based persistence with Supabase Postgres using the locked schema, by creating committed SQL migrations, adding a server-only Supabase client, refactoring `src/lib/stamps.ts`, and updating the four server API routes without changing existing UI/UX behavior.

### 5. Constraints / non-goals
- Do not redesign architecture, schema, or workflow.
- Do not modify locked decisions in `DECISIONS.md`.
- Do not change table/view design from `SCHEMA-V1-PROPOSAL.sql`; translate it into migration files as-is.
- Do not introduce Supabase Auth, OTP, sessions, JWTs, RLS, or customer accounts. :contentReference[oaicite:19]{index=19}
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` or any DB client to browser/client code. :contentReference[oaicite:20]{index=20}
- Do not bypass `src/lib/stamps.ts` with direct route-level queries. :contentReference[oaicite:21]{index=21}
- Do not compute loyalty state in app code if it belongs in `stamp_progress`.
- Do not change customer-facing or admin-facing UI components, flow, copy, routing, or visual behavior.
- Do not keep JSON persistence in the production code path after migration.
- Do not expand scope beyond the files and behaviors needed for persistence migration.

### 6. Files in scope
- `supabase/migrations/*` (new migration file(s) generated from locked schema)
- `src/lib/db.ts` (new, server-only Supabase client helper)
- `src/lib/stamps.ts` (refactor to Supabase-backed domain/data layer)
- `src/app/api/stamps/route.ts`
- `src/app/api/admin/stamp/route.ts`
- `src/app/api/admin/redeem/route.ts`
- `src/app/api/admin/lookup/route.ts`
- `.env.local` (local env wiring only, if needed for development)
- Any minimal import/update sites required to remove JSON-backed production persistence

### 7. Implementation plan
1. Create an initial SQL migration file under `supabase/migrations/` using the locked schema from `SCHEMA-V1-PROPOSAL.sql`, preserving migration order, constraints, indexes, view definition, and Odd’s Cafe seed exactly as specified. :contentReference[oaicite:22]{index=22}
2. Ensure the migration creates these objects in order: `customers`, `locations`, `customer_location_cards`, `stamp_events`, then `stamp_progress` view. :contentReference[oaicite:23]{index=23}
3. Add `src/lib/db.ts` as the only Supabase client entry point using `createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)`, and keep it server-only. :contentReference[oaicite:24]{index=24}
4. Refactor `src/lib/stamps.ts` so it becomes the sole domain access layer for customer lookup/create, card lookup/create, stamp append, redeem append, and progress reads from Supabase. Keep business logic centralized there. :contentReference[oaicite:25]{index=25}
5. Implement or adapt minimal helper functions in `src/lib/stamps.ts` to support the current routes and behavior, following the event model:
   - lookup existing customer by phone
   - create customer if missing
   - get or create card for Odd’s Cafe
   - append `stamp` event
   - append `redeem` event
   - read derived progress from `stamp_progress`
6. Update `/api/stamps` so customer lookup works for both existing and new customers via Supabase, preserving current request/response behavior expected by the UI.
7. Update `/api/admin/stamp` so stamp creation appends a `stamp_events` row and the customer card reflects updated progress on refresh/polling without UI changes.
8. Update `/api/admin/redeem` so redemption appends a `redeem` event and the customer’s derived progress resets correctly according to the SQL view logic rather than mutable counters.
9. Update `/api/admin/lookup` so admin customer search uses the Supabase-backed domain layer and returns the same behavior/shape the admin UI expects.
10. Remove JSON file usage from the active production persistence path; no route or domain logic should rely on `src/data/stamps.json` after the migration is complete.
11. Verify imports and boundaries so no Supabase code is reachable from client components or browser bundles.
12. Validate locally against the migrated schema and confirm the existing UI flow still works unchanged.

### 8. Acceptance test
1. Apply the migration successfully and confirm the following exist in Supabase: `customers`, `locations`, `customer_location_cards`, `stamp_events`, and `stamp_progress`.
2. Confirm `locations` contains the seeded Odd’s Cafe row with slug `odds-cafe`.
3. Open the customer flow and look up a brand-new phone number:
   - customer record is created if missing
   - customer card loads successfully
   - no JSON file write/read is required for the result
4. Look up an existing phone number:
   - existing customer loads correctly
   - current stamp count matches derived progress from Supabase
5. From admin, add a stamp for a customer:
   - API succeeds
   - one `stamp_events` row with `type = 'stamp'` is inserted
   - customer view reflects the updated stamp count under existing UI behavior
6. Add multiple stamps up to the reward threshold:
   - `current_stamps` increments correctly
   - `stamps_until_reward` never goes negative
7. Redeem reward from admin:
   - API succeeds
   - one `stamp_events` row with `type = 'redeem'` is inserted
   - derived progress resets correctly according to the locked SQL view
8. Reload the customer card page:
   - data persists
   - counts remain correct after reload
9. Redeploy the app and retest lookup:
   - customer data and progress still persist after redeploy
10. Confirm production path no longer depends on JSON persistence:
   - no active route/domain logic reads or writes the JSON store for stamp state
11. Confirm there is no client-side Supabase usage:
   - no browser bundle imports `src/lib/db.ts`
   - no client component imports `@supabase/supabase-js`
   - no service role key is exposed to client code or logs

### 9. Risks / gotchas
- Route handlers may currently assume mutable counter-style JSON behavior; refactor carefully so event-derived state preserves the same outward UX.
- `stamp_progress` must exist before any code queries it; migration order matters. :contentReference[oaicite:26]{index=26}
- New customers need both customer creation and card creation for Odd’s Cafe; forgetting card creation will break progress reads.
- Supabase `.single()` calls can throw when no row exists; handle lookup/create flows deliberately.
- Service role leakage is the most critical implementation failure; enforce strict server-only imports. :contentReference[oaicite:27]{index=27}
- Redeem behavior must remain derived from append-only events, not from resetting a mutable stamp counter.
- Avoid accidental schema drift by editing in dashboard instead of migration files. :contentReference[oaicite:28]{index=28}
- Keep the implementation KISS: this sprint is persistence migration only, not optimization or feature expansion.

### 10. Do not touch
- Any customer UI components
- Any admin UI components
- QR generation or QR page behavior
- PWA manifest, service worker, or frontend shell
- Admin auth pattern (`ODDS_ADMIN_PASSWORD` flow)
- Any architecture docs or locked decisions unless a true blocker is found and surfaced
- Any schema redesign beyond translating the locked proposal into migrations
- Any feature work unrelated to Supabase persistence migration
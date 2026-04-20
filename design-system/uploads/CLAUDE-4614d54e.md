# Brew Loyalty MVP — Claude Context

## Overview

Brew Loyalty is a production-ready multi-tenant loyalty stamp card platform for independent coffee shops, built by Peachy Kean DevOps LLC.

Customers:
- Enter a phone number (no app required)
- Receive a digital loyalty card
- Show a QR code at the counter

Baristas:
- Look up customers by phone or QR scan
- Add stamps
- Remove incorrect stamps (correction)
- Redeem rewards

---

## Tech Stack

- Next.js (App Router, TypeScript)
- Supabase (Postgres) — **migration from JSON flat file complete; Supabase is the live data layer**
- Vercel (deployment)
- No Supabase Auth
- Server-side DB access only (service role key)

---

## Core Data Model

### shops
| Column | Notes |
|---|---|
| id | |
| slug | URL-safe shop identifier (e.g. `odds`, `rowan`) |
| name | Display name |
| stamps_required | Stamp goal per reward cycle |

### customers
| Column | Notes |
|---|---|
| id | |
| phone | Normalized E.164 format |

### loyalty_cards
| Column | Notes |
|---|---|
| id | |
| shop_id | FK → shops |
| customer_id | FK → customers |
| stamp_count | Current derived state |
| reward_count | Lifetime redemptions |
| last_stamp_at | |

### stamp_events (append-only ledger)
| Column | Notes |
|---|---|
| id | |
| shop_id | FK → shops |
| customer_id | FK → customers |
| loyalty_card_id | FK → loyalty_cards |
| event_type | `stamp_added`, `stamp_removed`, `reward_redeemed` |
| stamp_delta | +1, -1, or 0 |
| note | e.g. `admin_correction` |
| created_at | |

### Key relationships
- Customer ↔ shop via `loyalty_cards`
- `loyalty_cards` holds current state (`stamp_count`)
- `stamp_events` is the source of truth for audit and history
- **Multi-tenancy is enforced via `shop_id` on every `loyalty_cards` and `stamp_events` row — never query without scoping to a shop**

---

## Core Business Logic

### addStamp(phone, shopId)
- Increments `stamp_count` by 1
- Logs event: `event_type = "stamp_added"`, `stamp_delta = +1`

### removeStamp(phone, shopId)
- Decrements `stamp_count` by 1, floor 0
- Logs event: `event_type = "stamp_added"`, `stamp_delta = -1`, `note = "admin_correction"`

### redeemReward(phone, shopId)
- Resets `stamp_count` to 0
- Increments `reward_count`
- Logs event: `event_type = "reward_redeemed"`

---

## QR System

### Customer QR
Encodes a URL: `/card?phone=+1XXXXXXXXXX`

### Admin Scanner
- Accepts: raw phone numbers, formatted numbers, URLs with phone query param
- Uses: BarcodeDetector (primary), jsQR (fallback)
- Includes scan guard to prevent repeated triggers

---

## UI Structure

### Homepage (`/`)
- Phone input + "See My Card" button
- Marketing copy (shop-branded)

### Customer Card (`/card`)
- Logo (transparent PNG, per-shop)
- Stamp grid (3×3)
- Progress display (e.g. 3 / 9)
- QR code

### Admin (`/admin`)
- Login via password (per-shop env var)
- Lookup by phone or QR scan
- Actions: Add Stamp, Remove Stamp, Redeem Reward

---

## Multi-Tenant Architecture

Each shop is a row in `shops`. Per-shop config (name, slug, stamp goal, branding) lives in the DB — no code changes required to add a new tenant.

Per-shop admin passwords are stored as environment variables:
- `ODDS_ADMIN_PASSWORD`
- `[SHOP_SLUG]_ADMIN_PASSWORD` for each additional tenant

Per-shop branding (logo, colors, reward copy) is injected via shop config — not hardcoded in components.

**Do not query `loyalty_cards` or `stamp_events` without a `shop_id` filter. Cross-tenant data leakage is a critical bug.**

---

## UX Decisions

- No app download required
- Phone number = identity
- Admin UI optimized for speed at counter
- Customer UI optimized for clarity
- Stamp correction (remove) is supported and audit-logged

---

## Constraints (non-negotiable)

- Do NOT redesign architecture
- Prefer minimal, surgical changes
- Do NOT introduce Supabase Auth
- Do NOT expose DB or service role key to client
- Maintain production stability
- Do NOT query across tenants

---

## Current Status

- Fully working in production (Odds Café, West Asheville NC — pilot tenant)
- Cross-device QR scanning verified (iPhone Safari + DuckDuckGo)
- Transparent logo, 3×3 stamp grid, admin UX all implemented
- Supabase migration complete — JSON flat file no longer in use
- Multi-tenant schema live (`shop_id` scoping on all loyalty tables)

---

## Active Work

- Onboarding second tenant (in progress)
- Per-shop branding system (colors, logo, reward copy via shop config)
- Homepage copy updates per shop

---

## Expectations for Claude

- Locate correct files before editing
- Make minimal, surgical changes only
- Preserve all working flows
- Always scope DB queries to `shop_id`
- Avoid touching unrelated components
- Prefer clarity over cleverness
- If unsure, inspect the repo and infer — do not guess

---

## Global Workflow & Patterns

This project follows the Peachy Kean DevOps AI playbook:
https://github.com/juanitok94/ai-playbook

Reference for: roles, XP loop, sprint execution, Supabase patterns.

---

## Execution Model

- Implementation is driven by SESSION-BRIEF.md (generated fresh each sprint)
- Claude Code executes only from SESSION-BRIEF
- Do not infer beyond the brief
- Stop and ask if anything is ambiguous

---

## Definition of Done

- Acceptance tests in SESSION-BRIEF pass
- DECISIONS.md updated if a locked decision changed
- Feature verified in preview or production
- Claude + ChatGPT review complete
- Juan signs off

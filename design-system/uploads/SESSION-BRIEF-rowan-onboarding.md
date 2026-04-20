# SESSION-BRIEF — Tenant #2 Onboarding (Rowan Coffee)

## Context

brew-loyalty is live in production with one tenant (Odds Café, slug: `odds`).
Supabase migration is complete. Multi-tenant schema is live — `shop_id` exists on
`loyalty_cards` and `stamp_events`. This brief onboards a second tenant.

**This is a config + branding task. No architecture changes. No new tables.**

---

## Scope

1. Insert Rowan Coffee into the `shops` table
2. Add per-shop admin password env var
3. Wire per-shop branding (logo, colors, reward copy) from shop config
4. Verify tenant isolation — all queries scoped to `shop_id`

---

## Step 1 — Supabase: insert new shop row

```sql
INSERT INTO shops (slug, name, stamps_required)
VALUES ('rowan', 'Rowan Coffee', 9);
```

Note the returned `id` — you will need it for the env var and any seeding.

---

## Step 2 — Environment variable

Add to Vercel dashboard and `.env.local`:

```
ROWAN_ADMIN_PASSWORD=your-secure-password-here
```

Pattern matches the existing `ODDS_ADMIN_PASSWORD`. The admin auth layer should
already support per-shop password lookup by slug — verify this before adding new
logic. If it does not, extend `src/lib/auth.ts` minimally to map slug → env var.

---

## Step 3 — Branding config

The Claude Design handoff (attached) provides:
- Primary color hex
- Secondary color hex
- Font family + weight
- Logo file (add to `/public/rowan-logo.png`)
- Reward copy: "Free drink"

If a `shop_config` or branding object does not already exist in the codebase,
create one in `src/lib/shops.ts` (or equivalent) structured as:

```ts
type ShopBranding = {
  logoPath: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  rewardText: string
}
```

Inject via slug — resolved server-side, passed as props. Do not hardcode per-shop
values in components.

---

## Step 4 — Routes

Rowan tenant routes follow the same pattern as Odds:

| Route | Who | What |
|---|---|---|
| `/rowan` | Customer | Phone entry, Rowan-branded |
| `/rowan/card` | Customer | Stamp card, Rowan-branded |
| `/rowan/admin` | Barista | Password login |
| `/rowan/admin/customer` | Barista | Add stamp / redeem |
| `/rowan/qr` | Barista | Printable QR for counter |

If the routing is already slug-based (e.g. `/[shop]/card`), confirm the existing
pattern handles this without new routes. If it is not yet slug-based, this is the
sprint to introduce it — but do not refactor Odds routes mid-sprint. Add Rowan
routes first, validate, then propose a follow-up refactor.

---

## Step 5 — Tenant isolation audit

Before merging, verify:

- [ ] Every Supabase query in `loyalty_cards` includes a `shop_id` filter
- [ ] Every Supabase query in `stamp_events` includes a `shop_id` filter
- [ ] Admin auth resolves shop from slug before any DB access
- [ ] No customer from Odds is visible in Rowan admin (and vice versa)
- [ ] QR codes encode the correct shop-scoped URL

**Cross-tenant data leakage is a critical bug. Do not skip this step.**

---

## Out of scope for this sprint

- SMS nudges
- Haywood Hoppers integration
- Monthly owner reports
- Any changes to Odds Café routes, data, or branding

---

## Acceptance criteria

- [ ] Rowan Coffee row exists in `shops` table
- [ ] `/rowan` loads phone entry with Rowan branding
- [ ] `/rowan/card` shows stamp grid with Rowan logo and colors
- [ ] `/rowan/admin` is password-gated by `ROWAN_ADMIN_PASSWORD`
- [ ] Add Stamp increments `stamp_count` for Rowan customer only
- [ ] Redeem resets `stamp_count` and increments `reward_count`
- [ ] stamp_events rows have correct `shop_id` for Rowan
- [ ] Odds Café routes and data completely unaffected
- [ ] Verified on mobile (iPhone Safari)

---

## Reference

- `CLAUDE.md` — full project context and constraints
- `docs/ARCHITECTURE.md` — system design
- `docs/DECISIONS.md` — locked decisions (do not override without sign-off)
- `https://github.com/juanitok94/ai-playbook` — PKDO AI playbook

## Sign-off

Juan Kean / Peachy Kean DevOps LLC

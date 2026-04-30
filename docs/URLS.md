# URL Quick Reference

## Customer-facing

| URL | Who | What happens |
|-----|-----|-------------|
| `/` | Customer | Enters phone number → redirected to their stamp card |
| `/card?phone=PHONE` | Customer | Stamp card view — shows stamp grid, progress, last visit |

## Staff

| URL | Who | What happens |
|-----|-----|-------------|
| `/admin?token=TOKEN` | Barista | Verifies token, sets session, redirects to dashboard |
| `/admin/customer` | Barista | Dashboard — look up customer, add/remove stamps, redeem reward |

The `/admin?token=TOKEN` URL is the **only link staff need**. Bookmark it on the counter device. After the first tap, the session is stored and the barista goes straight to the dashboard on reload (until the session is cleared).

## Owner / setup

| URL | Who | What happens |
|-----|-----|-------------|
| `/qr` | Owner | Printable QR code that points to `/` — post at counter or on table tents |

---

## Admin lookup flow

1. Barista taps bookmark → `/admin?token=TOKEN`
2. Token verified → redirected to `/admin/customer`
3. Enter last 4 digits of customer phone → auto-submits on 4th digit
4. If one match: customer card loads immediately
5. If multiple matches: picker shown, barista selects correct customer
6. If no match: full phone fallback appears → creates new customer if needed

## Notes

- `TOKEN` is the value of the `SHOP_ADMIN_TOKEN` environment variable
- Customer phone numbers are stored in E.164 format (`+18285550123`) but displayed formatted
- The stamp target is set in `src/config/shop.ts` → `stampsRequired`

// New route: last-4-digit customer lookup for barista flow
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { db } from "@/lib/db";

const DEFAULT_SHOP_SLUG = "rowan";

type ShopRow = { id: string };
type CustomerRow = { id: string; phone: string; display_name: string | null };
type CardRow = {
  stamp_count: number;
  reward_count: number;
  last_stamp_at: string | null;
};

function todayString() {
  return new Date().toISOString().split("T")[0];
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { last4 } = body as { last4?: string };

  if (!last4 || !/^\d{4}$/.test(last4)) {
    return NextResponse.json({ error: "last4 must be exactly 4 digits" }, { status: 400 });
  }

  // Resolve default shop — matches getDefaultShop() pattern in stamps.ts
  const { data: shopData, error: shopError } = await db
    .from("shops")
    .select("id")
    .eq("slug", DEFAULT_SHOP_SLUG)
    .single();

  if (shopError || !shopData) {
    return NextResponse.json({ error: "Shop not found" }, { status: 500 });
  }
  const shop = shopData as ShopRow;

  // Find all customers whose E.164 phone ends with last4
  const { data: customers, error: custError } = await db
    .from("customers")
    .select("id, phone, display_name")
    .ilike("phone", `%${last4}`);

  if (custError) {
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
  if (!customers || customers.length === 0) {
    return NextResponse.json({ error: "No customers found" }, { status: 404 });
  }

  // For each matching customer, fetch their loyalty card for this shop
  const results: {
    phone: string;
    name: string | null;
    stamps: number;
    lastVisit: string;
    redeemed: number;
  }[] = [];

  for (const customer of customers as CustomerRow[]) {
    const { data: card } = await db
      .from("loyalty_cards")
      .select("stamp_count, reward_count, last_stamp_at")
      .eq("shop_id", shop.id)
      .eq("customer_id", customer.id)
      .maybeSingle();

    const c = card as CardRow | null;
    results.push({
      phone: customer.phone,
      name: customer.display_name,
      stamps: c?.stamp_count ?? 0,
      lastVisit: c?.last_stamp_at ? c.last_stamp_at.split("T")[0] : todayString(),
      redeemed: c?.reward_count ?? 0,
    });
  }

  return NextResponse.json(results);
}

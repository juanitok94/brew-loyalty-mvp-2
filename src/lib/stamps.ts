import { db } from "@/lib/db";
import { STAMPS_REQUIRED } from "@/lib/constants";

export type CustomerRecord = {
  stamps: number;
  lastVisit: string;
  redeemed: number;
};

type ShopRow = {
  id: string;
  slug: string;
  name: string;
  stamps_required: number;
};

type CustomerRow = {
  id: string;
  phone: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
};

type LoyaltyCardRow = {
  id: string;
  shop_id: string;
  customer_id: string;
  stamp_count: number;
  reward_count: number;
  last_stamp_at: string | null;
  last_redeem_at: string | null;
  created_at: string;
  updated_at: string;
};

const DEFAULT_SHOP_SLUG = "odds-cafe";

export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

function isoNow(): string {
  return new Date().toISOString();
}

function toCustomerRecord(card: LoyaltyCardRow): CustomerRecord {
  return {
    stamps: card.stamp_count,
    lastVisit: card.last_stamp_at ? card.last_stamp_at.split("T")[0] : todayString(),
    redeemed: card.reward_count,
  };
}

async function getDefaultShop(): Promise<ShopRow> {
  const { data, error } = await db
    .from("shops")
    .select("id, slug, name, stamps_required")
    .eq("slug", DEFAULT_SHOP_SLUG)
    .single();

  if (error || !data) {
    throw new Error(`Default shop not found for slug "${DEFAULT_SHOP_SLUG}"`);
  }

  return data as ShopRow;
}

async function findCustomerByPhone(phone: string): Promise<CustomerRow | null> {
  const normalizedPhone = normalizePhone(phone);

  const { data, error } = await db
    .from("customers")
    .select("id, phone, display_name, created_at, updated_at")
    .eq("phone", normalizedPhone)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to find customer: ${error.message}`);
  }

  return (data as CustomerRow | null) ?? null;
}

async function createCustomer(phone: string): Promise<CustomerRow> {
  const normalizedPhone = normalizePhone(phone);

  const { data, error } = await db
    .from("customers")
    .insert({
      phone: normalizedPhone,
    })
    .select("id, phone, display_name, created_at, updated_at")
    .single();

  if (error || !data) {
    throw new Error(`Failed to create customer: ${error?.message ?? "Unknown error"}`);
  }

  return data as CustomerRow;
}

async function findLoyaltyCard(shopId: string, customerId: string): Promise<LoyaltyCardRow | null> {
  const { data, error } = await db
    .from("loyalty_cards")
    .select(
      "id, shop_id, customer_id, stamp_count, reward_count, last_stamp_at, last_redeem_at, created_at, updated_at",
    )
    .eq("shop_id", shopId)
    .eq("customer_id", customerId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to find loyalty card: ${error.message}`);
  }

  return (data as LoyaltyCardRow | null) ?? null;
}

async function createLoyaltyCard(shopId: string, customerId: string): Promise<LoyaltyCardRow> {
  const { data, error } = await db
    .from("loyalty_cards")
    .insert({
      shop_id: shopId,
      customer_id: customerId,
      stamp_count: 0,
      reward_count: 0,
    })
    .select(
      "id, shop_id, customer_id, stamp_count, reward_count, last_stamp_at, last_redeem_at, created_at, updated_at",
    )
    .single();

  if (error || !data) {
    throw new Error(`Failed to create loyalty card: ${error?.message ?? "Unknown error"}`);
  }

  return data as LoyaltyCardRow;
}

async function getOrCreateCustomer(phone: string): Promise<CustomerRow> {
  const existing = await findCustomerByPhone(phone);
  if (existing) return existing;
  return createCustomer(phone);
}

async function getOrCreateCard(shopId: string, customerId: string): Promise<LoyaltyCardRow> {
  const existing = await findLoyaltyCard(shopId, customerId);
  if (existing) return existing;
  return createLoyaltyCard(shopId, customerId);
}

async function updateCard(
  cardId: string,
  updates: Partial<
    Pick<LoyaltyCardRow, "stamp_count" | "reward_count" | "last_stamp_at" | "last_redeem_at">
  >,
): Promise<LoyaltyCardRow> {
  const { data, error } = await db
    .from("loyalty_cards")
    .update(updates)
    .eq("id", cardId)
    .select(
      "id, shop_id, customer_id, stamp_count, reward_count, last_stamp_at, last_redeem_at, created_at, updated_at",
    )
    .single();

  if (error || !data) {
    throw new Error(`Failed to update loyalty card: ${error?.message ?? "Unknown error"}`);
  }

  return data as LoyaltyCardRow;
}

async function logEvent(params: {
  shopId: string;
  customerId: string;
  loyaltyCardId: string;
  eventType: "stamp_added" | "reward_redeemed";
  stampDelta: number;
  note?: string;
}): Promise<void> {
  const { error } = await db.from("stamp_events").insert({
    shop_id: params.shopId,
    customer_id: params.customerId,
    loyalty_card_id: params.loyaltyCardId,
    event_type: params.eventType,
    stamp_delta: params.stampDelta,
    note: params.note ?? null,
    created_at: isoNow(),
  });

  if (error) {
    throw new Error(`Failed to log stamp event: ${error.message}`);
  }
}

export async function getCustomer(phone: string): Promise<CustomerRecord | null> {
  const shop = await getDefaultShop();
  const customer = await findCustomerByPhone(phone);

  if (!customer) {
    return null;
  }

  const card = await findLoyaltyCard(shop.id, customer.id);
  if (!card) {
    return {
      stamps: 0,
      lastVisit: todayString(),
      redeemed: 0,
    };
  }

  return toCustomerRecord(card);
}

export async function upsertCustomer(phone: string): Promise<CustomerRecord> {
  const shop = await getDefaultShop();
  const customer = await getOrCreateCustomer(phone);
  const card = await getOrCreateCard(shop.id, customer.id);

  return toCustomerRecord(card);
}

export async function addStamp(phone: string): Promise<CustomerRecord> {
  const shop = await getDefaultShop();
  const customer = await getOrCreateCustomer(phone);
  const card = await getOrCreateCard(shop.id, customer.id);

  const now = isoNow();

  const updatedCard = await updateCard(card.id, {
    stamp_count: card.stamp_count + 1,
    reward_count: card.reward_count,
    last_stamp_at: now,
  });

  await logEvent({
    shopId: shop.id,
    customerId: customer.id,
    loyaltyCardId: card.id,
    eventType: "stamp_added",
    stampDelta: 1,
  });

  return toCustomerRecord(updatedCard);
}

export async function redeemReward(phone: string): Promise<CustomerRecord | null> {
  const shop = await getDefaultShop();
  const customer = await findCustomerByPhone(phone);

  if (!customer) {
    return null;
  }

  const card = await findLoyaltyCard(shop.id, customer.id);

  if (!card || card.stamp_count < STAMPS_REQUIRED) {
    return null;
  }

  const now = isoNow();

  const updatedCard = await updateCard(card.id, {
    stamp_count: 0,
    reward_count: card.reward_count + 1,
    last_redeem_at: now,
  });

  await logEvent({
    shopId: shop.id,
    customerId: customer.id,
    loyaltyCardId: card.id,
    eventType: "reward_redeemed",
    stampDelta: -card.stamp_count,
  });

  return toCustomerRecord(updatedCard);
}
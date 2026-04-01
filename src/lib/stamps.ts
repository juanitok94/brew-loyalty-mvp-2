import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/stamps.json");

export type CustomerRecord = {
  stamps: number;
  lastVisit: string;
  redeemed: number;
};

export type StampsDB = Record<string, CustomerRecord>;

export function readDB(): StampsDB {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify({}), "utf-8");
  }
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as StampsDB;
}

export function writeDB(db: StampsDB): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

export function getCustomer(phone: string): CustomerRecord | null {
  const db = readDB();
  return db[phone] ?? null;
}

export function upsertCustomer(phone: string): CustomerRecord {
  const db = readDB();
  if (!db[phone]) {
    db[phone] = { stamps: 0, lastVisit: new Date().toISOString().split("T")[0], redeemed: 0 };
    writeDB(db);
  }
  return db[phone];
}

export function addStamp(phone: string): CustomerRecord {
  const db = readDB();
  if (!db[phone]) {
    db[phone] = { stamps: 0, lastVisit: new Date().toISOString().split("T")[0], redeemed: 0 };
  }
  db[phone].stamps += 1;
  db[phone].lastVisit = new Date().toISOString().split("T")[0];
  writeDB(db);
  return db[phone];
}

export function redeemReward(phone: string): CustomerRecord | null {
  const db = readDB();
  if (!db[phone] || db[phone].stamps < 8) return null;
  db[phone].stamps = 0;
  db[phone].redeemed += 1;
  db[phone].lastVisit = new Date().toISOString().split("T")[0];
  writeDB(db);
  return db[phone];
}

export { STAMPS_REQUIRED } from "@/lib/constants";

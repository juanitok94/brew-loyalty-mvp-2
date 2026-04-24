import { NextRequest } from "next/server";

export function verifyAdminToken(req: NextRequest): boolean {
  const expected = process.env.ROWAN_ADMIN_TOKEN;
  if (!expected) return false;
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;
  return header.slice(7) === expected;
}

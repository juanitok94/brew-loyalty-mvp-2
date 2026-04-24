import { NextRequest, NextResponse } from "next/server";
import { addStamp, normalizePhone } from "@/lib/stamps";
import { verifyAdminToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { phone } = body;

  if (!phone) {
    return NextResponse.json({ error: "phone required" }, { status: 400 });
  }

  const normalized = normalizePhone(phone);
  const customer = await addStamp(normalized);
  return NextResponse.json({ phone: normalized, ...customer });
}

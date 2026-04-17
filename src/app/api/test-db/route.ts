import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const { data, error } = await db
    .from("shops")
    .select("id, slug, name, stamps_required")
    .limit(5);

  return NextResponse.json({
    hasUrl: !!process.env.SUPABASE_URL,
    hasSecret: !!process.env.SUPABASE_SECRET_KEY,
    data,
    error,
  });
}
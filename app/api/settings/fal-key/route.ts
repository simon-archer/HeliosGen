import { NextRequest, NextResponse } from "next/server";
import { deleteFalApiKey, getFalApiKey, setFalApiKey } from "@/lib/guest/db";

export async function GET() {
  return NextResponse.json({ hasToken: !!getFalApiKey() });
}

export async function POST(req: NextRequest) {
  const { falApiKey } = await req.json();
  if (typeof falApiKey !== "string" || !falApiKey.trim()) {
    return NextResponse.json({ error: "falApiKey is required" }, { status: 400 });
  }
  setFalApiKey(falApiKey.trim());
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  deleteFalApiKey();
  return NextResponse.json({ ok: true });
}

// app/api/healthz/route.ts
import { NextResponse } from "next/server";
import { kv } from "../../../lib/kv";

export async function GET() {
  try {
    await kv.get("healthcheck-test-key"); // simple check
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Health check failed:", err);
    return NextResponse.json({ ok: false, error: "Cannot access KV" }, { status: 500 });
  }
}

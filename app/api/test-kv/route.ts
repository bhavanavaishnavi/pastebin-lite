// app/api/test-kv/route.ts
import { NextResponse } from "next/server";
import { kv } from "../../../lib/kv";

export async function GET() {
  try {
    await kv.set("test", "hello");
    const val = await kv.get("test");
    return NextResponse.json({ ok: true, value: val });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) });
  }
}

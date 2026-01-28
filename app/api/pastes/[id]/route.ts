import { NextRequest, NextResponse } from "next/server";
import { kv } from "../../../../lib/kv";

// GET route
export async function GET(req: NextRequest, context: { params: { id: string } | Promise<{ id: string }> }) {
  // Unwrap params if it's a promise
  const { id } = "then" in context.params ? await context.params : context.params;

  if (!id) {
    return NextResponse.json({ error: "Missing paste id" }, { status: 400 });
  }

  // Fetch from Redis/KV
  const pasteStr = await kv.get<string>(`paste:${id}`);
  if (!pasteStr) {
    return NextResponse.json({ error: "Paste not found" }, { status: 404 });
  }

  const paste = JSON.parse(pasteStr);

  // TTL check
  if (paste.ttl_seconds && Date.now() > paste.created_at + paste.ttl_seconds * 1000) {
    return NextResponse.json({ error: "Paste expired" }, { status: 404 });
  }

  // Max views check
  if (paste.max_views && paste.views >= paste.max_views) {
    return NextResponse.json({ error: "Paste view limit exceeded" }, { status: 404 });
  }

  // Increment views
  paste.views++;
  await kv.set(`paste:${id}`, JSON.stringify(paste));

  return NextResponse.json({
    content: paste.content,
    remaining_views: paste.max_views ? paste.max_views - paste.views : null,
    expires_at: paste.ttl_seconds ? new Date(paste.created_at + paste.ttl_seconds * 1000).toISOString() : null,
  });
}

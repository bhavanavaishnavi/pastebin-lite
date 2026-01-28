import { NextRequest, NextResponse } from "next/server";
import { kv } from "../../../../lib/kv";

type Paste = {
  content: string;
  created_at: number;
  ttl_seconds?: number;
  max_views?: number;
  views: number;
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const paste = await kv.get<Paste>(`paste:${id}`);

  if (!paste) {
    return NextResponse.json({ error: "Paste not found" }, { status: 404 });
  }

  // TTL check
  if (paste.ttl_seconds) {
    const expired = paste.created_at + paste.ttl_seconds * 1000 < Date.now();
    if (expired) {
      await kv.del(`paste:${id}`);
      return NextResponse.json({ error: "Paste expired" }, { status: 410 });
    }
  }

  // Max views check
  if (paste.max_views && paste.views >= paste.max_views) {
    await kv.del(`paste:${id}`);
    return NextResponse.json({ error: "Paste view limit reached" }, { status: 410 });
  }

  paste.views++;
  await kv.set(`paste:${id}`, paste);

  return NextResponse.json({
    content: paste.content,
    remaining_views: paste.max_views ? paste.max_views - paste.views : null,
    expires_at: paste.ttl_seconds
      ? new Date(paste.created_at + paste.ttl_seconds * 1000).toISOString()
      : null,
  });
}

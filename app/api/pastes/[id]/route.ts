// app/api/pastes/[id]/route.ts
import { NextResponse } from "next/server";
import { pastes } from "../../../../lib/data";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const paste = pastes[params.id];
  if (!paste) return NextResponse.json({ error: "Paste not found" }, { status: 404 });

  const now = Date.now();

  if ((paste.ttl_seconds && now > paste.created_at + paste.ttl_seconds * 1000) ||
      (paste.max_views && paste.views >= paste.max_views)) {
    return NextResponse.json({ error: "Paste unavailable" }, { status: 404 });
  }

  paste.views++;

  return NextResponse.json({
    content: paste.content,
    remaining_views: paste.max_views ? paste.max_views - paste.views : null,
    expires_at: paste.ttl_seconds ? new Date(paste.created_at + paste.ttl_seconds * 1000).toISOString() : null,
  });
}

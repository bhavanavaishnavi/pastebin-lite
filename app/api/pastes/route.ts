// app/api/pastes/route.ts
import { NextResponse } from "next/server";
import { kv } from "../../../lib/kv";
import { v4 as uuidv4 } from "uuid";

// Type for a paste
type Paste = {
  content: string;
  created_at: number;
  ttl_seconds?: number;
  max_views?: number;
  views: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    // ---------- Validation ----------
    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return NextResponse.json({ error: "ttl_seconds must be an integer >= 1" }, { status: 400 });
    }

    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return NextResponse.json({ error: "max_views must be an integer >= 1" }, { status: 400 });
    }

    // ---------- Create paste ----------
    const id = uuidv4();
    const paste: Paste = {
      content,
      created_at: Date.now(),
      ttl_seconds,
      max_views,
      views: 0,
    };

    // Store in KV
    await kv.set(`paste:${id}`, paste);

    // Return response
    const host = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    return NextResponse.json({
      id,
      url: `${host}/p/${id}`,
    });
  } catch (err) {
    console.error("Error creating paste:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

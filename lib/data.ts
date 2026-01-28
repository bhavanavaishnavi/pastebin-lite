// lib/data.ts
export type Paste = {
  content: string;
  created_at: number;
  ttl_seconds?: number;
  max_views?: number;
  views: number;
};

// in-memory storage for pastes

export const pastes: Record<string, Paste> = {
  "123": {
    content: "Hello, this is a test paste!",
    created_at: Date.now(),
    ttl_seconds: 3600, // 1 hour
    max_views: 5,
    views: 0
  }
};

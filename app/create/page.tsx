"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const [text, setText] = useState("");
  const [ttl, setTtl] = useState<number | undefined>();
  const [maxViews, setMaxViews] = useState<number | undefined>();
  const router = useRouter();

  const handleSave = async () => {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text, ttl_seconds: ttl, max_views: maxViews }),
    });

    const data = await res.json();
    if (res.ok) {
      router.push(data.url); // redirect to /p/:id
    } else {
      alert(data.error);
    }
  };

  return (
    <div>
      <h1>Create Paste</h1>
      <textarea
        rows={10}
        cols={50}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      TTL (seconds): <input type="number" value={ttl ?? ""} onChange={e => setTtl(Number(e.target.value) || undefined)} />
      <br />
      Max views: <input type="number" value={maxViews ?? ""} onChange={e => setMaxViews(Number(e.target.value) || undefined)} />
      <br />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

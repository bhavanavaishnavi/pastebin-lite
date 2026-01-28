"use client"; // client component
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text) return;

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/p/${data.id}`); // redirect to paste page
    } else {
      alert("Failed to save paste");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem" }}>
      <h1>Pastebin-Lite</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={10}
          style={{ width: "100%", marginBottom: "1rem" }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your paste here..."
          required
        />
        <button type="submit">Save Paste</button>
      </form>
    </div>
  );
}

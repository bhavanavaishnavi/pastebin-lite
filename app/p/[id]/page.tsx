import { pastes } from "../../../lib/data";

interface PastePageProps {
  params: { id: string } | Promise<{ id: string }>;
}

export default async function PastePage({ params }: PastePageProps) {
  // Unwrap params if it's a Promise
  const { id } = "then" in params ? await params : params;

  const paste = pastes[id];

  if (!paste) return <p>Paste not found</p>;

  const now = Date.now();
  if ((paste.ttl_seconds && now > paste.created_at + paste.ttl_seconds * 1000) ||
      (paste.max_views && paste.views >= paste.max_views)) {
    return <p>Paste not available</p>;
  }

  paste.views++;

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem" }}>
      <h2>Paste ID: {id}</h2>
      <pre>{paste.content}</pre>
    </div>
  );
}

import type { DevToArticle, DevToStyleProfile, GenerateResult } from "./types";
import { extractDevToPath } from "./validation";

export async function fetchArticleStyle(url: string): Promise<{
  article: DevToArticle;
  styleProfile: DevToStyleProfile;
}> {
  const path = extractDevToPath(url);
  const res = await fetch(
    `/api/fetch-article?path=${encodeURIComponent(path)}`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? "Failed to fetch reference article");
  }
  return res.json();
}

export async function generateArticle(payload: {
  topic: string;
  roughNotes: string;
  styleProfile?: DevToStyleProfile;
}): Promise<GenerateResult> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? "Failed to generate article");
  }
  return res.json();
}

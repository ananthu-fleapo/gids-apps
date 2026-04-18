const STORAGE_KEY = "devto_api_key";

function safeLocalStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getStoredApiKey(): string | null {
  return safeLocalStorage()?.getItem(STORAGE_KEY) ?? null;
}

export function saveApiKey(key: string): void {
  safeLocalStorage()?.setItem(STORAGE_KEY, key);
}

export function clearApiKey(): void {
  safeLocalStorage()?.removeItem(STORAGE_KEY);
}

export async function pushDraftToDevTo(
  markdown: string,
  apiKey: string
): Promise<{ id: number; url: string }> {
  // Extract title from YAML front matter
  const titleMatch = markdown.match(/^title:\s*(.+)$/m);
  const title = titleMatch?.[1]?.trim() ?? "Untitled Article";

  const res = await fetch("https://dev.to/api/articles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      article: {
        title,
        body_markdown: markdown,
        published: false,
      },
    }),
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(
        "Invalid Dev.to API key. Please check your key and try again."
      );
    }
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? `Dev.to API error: ${res.status}`);
  }

  const data = await res.json() as { id: number; url: string };
  return { id: data.id, url: data.url };
}

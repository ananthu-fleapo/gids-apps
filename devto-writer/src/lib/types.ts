// ── Inputs ────────────────────────────────────────────────────────────────────

export interface ArticleInputs {
  topic: string;
  roughNotes: string;
  referenceUrl?: string;
}

// ── Dev.to API shapes ─────────────────────────────────────────────────────────

export interface DevToArticle {
  id: number;
  title: string;
  body_markdown: string;
  description?: string;
  tag_list: string[];
  canonical_url?: string;
  url: string;
}

export interface DevToStyleProfile {
  toneDescription: string;
  structureNotes: string;
  liquidTagUsage: string;
  examplePhrases: string[];
}

// ── Generate API ───────────────────────────────────────────────────────────────

export interface GenerateRequest {
  topic: string;
  roughNotes: string;
  styleProfile?: DevToStyleProfile;
}

export interface GenerateResult {
  markdown: string;
}

// ── Publish ────────────────────────────────────────────────────────────────────

export interface PublishResult {
  id: number;
  url: string;
}

// ── State machine ──────────────────────────────────────────────────────────────

export type WriterState =
  | { status: "idle" }
  | { status: "fetching-style" }
  | { status: "style-ready"; styleProfile: DevToStyleProfile }
  | { status: "generating" }
  | { status: "done"; markdown: string }
  | { status: "publishing" }
  | { status: "published"; url: string }
  | { status: "error"; message: string };

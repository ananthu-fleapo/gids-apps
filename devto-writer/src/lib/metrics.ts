export interface ArticleMetrics {
  wordCount: number;
  readingTimeMinutes: number;
  seoScore: number;
  seoIssues: string[];
}

export function stripFrontMatter(md: string): string {
  if (!md.startsWith("---")) return md;
  const end = md.indexOf("\n---", 3);
  return end !== -1 ? md.slice(end + 4).trimStart() : md;
}

export function computeMetrics(markdown: string, topic: string): ArticleMetrics {
  const body = stripFrontMatter(markdown);
  const words = body.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 238));

  const topicKeywords = topic
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const issues: string[] = [];
  let score = 100;

  // Check 1: keyword in first paragraph
  const firstParagraph = body.split("\n\n")[0]?.toLowerCase() ?? "";
  const keywordInOpening = topicKeywords.some((kw) =>
    firstParagraph.includes(kw)
  );
  if (!keywordInOpening && topicKeywords.length > 0) {
    issues.push("Topic keyword missing from opening paragraph");
    score -= 20;
  }

  // Check 2: keyword in at least one H2
  const h2s = [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1].toLowerCase());
  const keywordInH2 = h2s.some((h) =>
    topicKeywords.some((kw) => h.includes(kw))
  );
  if (!keywordInH2 && topicKeywords.length > 0) {
    issues.push("Topic keyword missing from H2 headings");
    score -= 15;
  }

  // Check 3: meta description in front matter
  const hasDescription = /^description:\s*.+/m.test(markdown);
  if (!hasDescription) {
    issues.push("Missing meta description in front matter");
    score -= 15;
  }

  // Check 4: tags present
  const hasTags = /^tags:\s*.+/m.test(markdown);
  if (!hasTags) {
    issues.push("Missing tags in front matter");
    score -= 10;
  }

  // Check 5: at least one code block
  const hasCode = /```/.test(body);
  if (!hasCode) {
    issues.push("No code blocks detected");
    score -= 10;
  }

  // Check 6: conclusion section
  const hasConclusion = /^## Conclusion/im.test(body);
  if (!hasConclusion) {
    issues.push("No ## Conclusion section found");
    score -= 10;
  }

  return {
    wordCount,
    readingTimeMinutes,
    seoScore: Math.max(0, score),
    seoIssues: issues,
  };
}

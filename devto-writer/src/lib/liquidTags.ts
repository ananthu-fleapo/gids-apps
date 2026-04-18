export interface LiquidTagSuggestion {
  location: string; // e.g. "after section heading 'Getting Started'"
  tag: string; // e.g. "{% embed https://... %}"
  reason: string;
}

export function parseLiquidTagSuggestions(
  markdown: string
): LiquidTagSuggestion[] {
  const match = markdown.match(
    /<!--\s*LIQUID_TAG_SUGGESTIONS\s*([\s\S]*?)\s*-->/
  );
  if (!match) return [];
  try {
    const parsed = JSON.parse(match[1]);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function stripLiquidTagComment(markdown: string): string {
  return markdown
    .replace(/<!--\s*LIQUID_TAG_SUGGESTIONS[\s\S]*?-->/, "")
    .trimEnd();
}

/**
 * Insert a liquid tag after the section heading matching the suggestion's location.
 * Falls back to appending at end of document if heading not found.
 */
export function insertLiquidTag(
  markdown: string,
  suggestion: LiquidTagSuggestion
): string {
  // Extract heading name from location string like "after section heading 'Foo Bar'"
  const headingMatch = suggestion.location.match(/['"](.+?)['"]/);
  if (!headingMatch) {
    return markdown + "\n\n" + suggestion.tag;
  }

  const heading = headingMatch[1];
  const lines = markdown.split("\n");
  const headingIndex = lines.findIndex(
    (l) => l.startsWith("## ") && l.toLowerCase().includes(heading.toLowerCase())
  );

  if (headingIndex === -1) {
    return markdown + "\n\n" + suggestion.tag;
  }

  // Find the end of this section (next ## heading or end of file)
  let insertAt = headingIndex + 1;
  while (insertAt < lines.length && !lines[insertAt].startsWith("## ")) {
    insertAt++;
  }

  lines.splice(insertAt, 0, "", suggestion.tag, "");
  return lines.join("\n");
}

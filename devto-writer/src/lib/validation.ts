import { z } from "zod";

export const ArticleInputSchema = z.object({
  topic: z
    .string()
    .min(3, "Topic must be at least 3 characters")
    .max(200, "Topic must be under 200 characters"),
  roughNotes: z
    .string()
    .min(20, "Please provide at least 20 characters of notes")
    .max(10000, "Notes must be under 10,000 characters"),
  referenceUrl: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        try {
          const u = new URL(val);
          return u.hostname === "dev.to";
        } catch {
          return false;
        }
      },
      { message: "Must be a valid dev.to article URL" }
    )
    .optional()
    .or(z.literal("")),
});

export type ArticleInputValues = z.infer<typeof ArticleInputSchema>;

export const DevToApiKeySchema = z
  .string()
  .min(10, "API key appears too short — please check and try again");

export const StyleProfileSchema = z.object({
  toneDescription: z.string(),
  structureNotes: z.string(),
  liquidTagUsage: z.string(),
  examplePhrases: z.array(z.string()).min(1).max(10),
});

export const GenerateRequestSchema = z.object({
  topic: z.string().min(3).max(200),
  roughNotes: z.string().min(20).max(10000),
  styleProfile: StyleProfileSchema.optional(),
});

/**
 * Extract the Dev.to path from a full URL.
 * e.g. "https://dev.to/username/my-article-slug" → "username/my-article-slug"
 */
export function extractDevToPath(url: string): string {
  try {
    const u = new URL(url);
    // Strip leading slash and any query/hash
    return u.pathname.replace(/^\//, "").split("?")[0].split("#")[0];
  } catch {
    return url.replace(/^https?:\/\/dev\.to\//, "");
  }
}

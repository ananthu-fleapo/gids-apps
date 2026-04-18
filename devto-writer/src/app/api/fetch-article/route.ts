import { NextResponse } from "next/server";
import OpenAI from "openai";
import { EXTRACT_STYLE_SYSTEM_PROMPT } from "@/lib/prompts";
import type { DevToArticle, DevToStyleProfile } from "@/lib/types";

const meshClient = new OpenAI({
  baseURL: process.env.MESH_API_URL ?? "http://localhost:8000/v1",
  apiKey: process.env.MESH_API_KEY ?? "",
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "path is required" }, { status: 400 });
  }

  // 1. Fetch article from Dev.to public API
  let devToRes: Response;
  try {
    devToRes = await fetch(
      `https://dev.to/api/articles/by_path?url=${encodeURIComponent(path)}`,
      {
        headers: { Accept: "application/vnd.forem.api-v1+json" },
        next: { revalidate: 3600 },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Network error reaching Dev.to" },
      { status: 502 }
    );
  }

  if (!devToRes.ok) {
    if (devToRes.status === 404) {
      return NextResponse.json(
        {
          error:
            "Article not found on Dev.to. Make sure the article is published and the URL is correct.",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: `Dev.to returned ${devToRes.status}` },
      { status: 502 }
    );
  }

  const article = (await devToRes.json()) as DevToArticle;

  // 2. Truncate body to keep token budget manageable for style extraction
  const bodyForAnalysis = article.body_markdown?.slice(0, 4000) ?? "";

  // 3. Extract style profile with Gemini 2.5 Flash
  let styleProfile: DevToStyleProfile;
  try {
    const extraction = await meshClient.chat.completions.create({
      model: "google/gemini-2-5-flash",
      temperature: 0.1,
      messages: [
        { role: "system", content: EXTRACT_STYLE_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Analyze the writing style of this Dev.to article:\n\nTitle: ${article.title}\n\n${bodyForAnalysis}`,
        },
      ],
    });

    const content = extraction.choices[0]?.message?.content ?? "";
    // Handle models that wrap JSON in markdown code fences
    const jsonMatch =
      content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/) ?? [null, content];
    styleProfile = JSON.parse(jsonMatch[1] ?? content);
  } catch (err) {
    return NextResponse.json(
      {
        error:
          "Failed to extract style profile from article. " +
          (err instanceof Error ? err.message : ""),
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ article, styleProfile });
}

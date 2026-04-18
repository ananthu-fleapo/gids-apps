import { NextResponse } from "next/server";
import OpenAI from "openai";
import { GENERATE_ARTICLE_SYSTEM_PROMPT, buildStyleInstruction } from "@/lib/prompts";
import { GenerateRequestSchema } from "@/lib/validation";

const meshClient = new OpenAI({
  baseURL: process.env.MESH_API_URL ?? "http://localhost:8000/v1",
  apiKey: process.env.MESH_API_KEY ?? "",
});

function unwrapCodeFence(text: string): string {
  const fenced = text.match(/^```(?:markdown|md)?\s*\n([\s\S]*)\n```\s*$/);
  return fenced ? fenced[1] : text;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = GenerateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const { topic, roughNotes, styleProfile } = parsed.data;

  let userContent = `Write a Dev.to article about the following topic using the provided rough notes.\n\n## Topic\n${topic}\n\n## Rough Notes\n${roughNotes}`;

  if (styleProfile) {
    userContent += buildStyleInstruction(styleProfile);
  }

  try {
    const response = await meshClient.chat.completions.create({
      model: "anthropic/claude-sonnet-4-6",
      temperature: 0.4,
      messages: [
        { role: "system", content: GENERATE_ARTICLE_SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
    });

    const raw = response.choices[0]?.message?.content ?? "";
    if (!raw) {
      throw new Error("No content returned from model");
    }

    const markdown = unwrapCodeFence(raw.trim());
    return NextResponse.json({ markdown });
  } catch (err) {
    console.error("[generate] error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Article generation failed",
      },
      { status: 500 }
    );
  }
}

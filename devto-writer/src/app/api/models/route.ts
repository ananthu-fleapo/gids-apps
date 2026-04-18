import { NextResponse } from "next/server";
import OpenAI from "openai";

const meshClient = new OpenAI({
  baseURL: process.env.MESH_API_URL ?? "http://localhost:8000/v1",
  apiKey: process.env.MESH_API_KEY ?? "",
});

export async function GET() {
  try {
    const models = await meshClient.models.list();
    return NextResponse.json(models);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to list models" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { uploadToGCS } from "@/lib/gcs";
import { extractTextFromDocument } from "@/lib/documentExtract";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File must be under 10 MB" },
        { status: 400 },
      );
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    const isDocx =
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.toLowerCase().endsWith(".docx");

    if (!isPdf && !isDocx) {
      return NextResponse.json(
        { error: "Only PDF and DOCX files are supported" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");

    const id = nanoid();
    const gcsPath = `user-uploads/${id}/${safeName}`;
    const contentType =
      file.type ||
      (isPdf
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    // Upload file to GCS
    const fileUrl = await uploadToGCS(Buffer.from(data), gcsPath, contentType);

    // Extract text from document
    const extractedText = await extractTextFromDocument(
      data,
      isPdf
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );

    return NextResponse.json({
      gcsPath,
      fileUrl,
      extractedText,
    });
  } catch (error) {
    console.error("[upload] error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 },
    );
  }
}

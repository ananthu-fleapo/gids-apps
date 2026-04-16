import { PDFParse } from "pdf-parse"; // v2 is now class-based

export async function extractTextFromDocument(
  data: Uint8Array | Buffer,
  fileType: string,
): Promise<string> {
  const isPdf = fileType === "application/pdf";
  const isDocx =
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  if (isPdf) {
    return extractPdfText(data);
  } else if (isDocx) {
    return extractDocxText(data);
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}

async function extractPdfText(data: Uint8Array | Buffer): Promise<string> {
  // v2 allows passing the data directly in the constructor
  const parser = new PDFParse({ data });

  try {
    // .getText() replaces the old functional call
    const result = await parser.getText();

    let text = (result.text || "").replace(/\s{2,}/g, " ").trim();

    // Your custom slicing logic for token management
    if (text.length > 24000) {
      text = text.slice(0, 12000) + "\n...\n" + text.slice(-12000);
    }

    if (!text) {
      throw new Error("No extractable text found in PDF.");
    }

    return text;
  } catch (error: any) {
    throw new Error(`PDF Extraction failed: ${error.message}`);
  } finally {
    // CRITICAL: v2 requires calling destroy() to prevent memory leaks,
    // especially important in Next.js serverless functions.
    await parser.destroy();
  }
}

async function extractDocxText(data: Uint8Array | Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  // Mammoth works best with Buffer in Node environments
  const buffer = data instanceof Buffer ? data : Buffer.from(data);

  const result = await mammoth.extractRawText({ buffer });
  let text = result.value.trim();

  if (!text) {
    throw new Error("No extractable text found in DOCX.");
  }

  if (text.length > 24000) {
    text = text.slice(0, 12000) + "\n...\n" + text.slice(-12000);
  }

  return text;
}

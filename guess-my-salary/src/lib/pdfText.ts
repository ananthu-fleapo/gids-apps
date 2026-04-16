// Client-side PDF text extraction using pdfjs-dist (browser only)
// This runs entirely in the browser — no server file upload needed.

export async function extractTextFromPdf(file: File): Promise<string> {
  // Dynamic import so this module is never bundled for SSR
  const pdfjsLib = await import("pdfjs-dist");

  // Use the CDN worker to avoid bundling the large worker file
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s{2,}/g, " ")
      .trim();

    if (pageText) {
      pageTexts.push(pageText);
    }
  }

  const fullText = pageTexts.join("\n\n").trim();

  if (!fullText) {
    throw new Error(
      "No extractable text found in this PDF. Please upload a text-based PDF (not a scanned image)."
    );
  }

  // Cap at 24,000 chars to stay within LLM context limits
  return fullText.slice(0, 24000);
}

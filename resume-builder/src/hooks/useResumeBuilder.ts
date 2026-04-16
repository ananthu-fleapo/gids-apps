"use client";

import { useState } from "react";
import type { BuilderState, BuilderInputs } from "@/lib/types";
import { scrapeProfiles, uploadDocument, generateResume } from "@/lib/api";
import { extractTextFromPdf } from "@/lib/pdfText";

export function useResumeBuilder() {
  const [state, setState] = useState<BuilderState>({ status: "idle" });

  async function build(inputs: BuilderInputs) {
    const { linkedInUrl, githubUsername, documentFile } = inputs;

    if (!linkedInUrl && !githubUsername && !documentFile) {
      setState({
        status: "error",
        message: "Please provide at least one input.",
      });
      return;
    }

    try {
      let documentText: string | undefined;
      let uploadedFileGcsPath: string | undefined;

      // Step 1 (optional): Upload document to GCS and extract text
      if (documentFile) {
        setState({ status: "uploading" });
        await new Promise((r) => setTimeout(r, 50)); // yield to paint

        const isPdf =
          documentFile.type === "application/pdf" ||
          documentFile.name.endsWith(".pdf");

        if (isPdf) {
          // Extract text client-side for speed; still upload file server-side
          documentText = await extractTextFromPdf(documentFile);
          console.log("Document text extracted:", documentText);
        }

        // Upload to GCS (also extracts DOCX text server-side if needed)
        const uploadResult = await uploadDocument(documentFile);
        uploadedFileGcsPath = uploadResult.gcsPath;

        // For DOCX or if client-side extraction failed, use server-extracted text
        if (!documentText) {
          documentText = uploadResult.extractedText;
        }
      }

      // Step 2 (optional): Scrape LinkedIn/GitHub
      let linkedInData: unknown;
      let githubData: unknown;

      if (linkedInUrl || githubUsername) {
        setState({ status: "scraping" });
        await new Promise((r) => setTimeout(r, 50));

        const scrapeResult = await scrapeProfiles(linkedInUrl, githubUsername);
        linkedInData = scrapeResult.linkedIn;
        githubData = scrapeResult.github;
      }

      // Step 3: AI profile extraction
      setState({ status: "parsing" });
      await new Promise((r) => setTimeout(r, 50));

      // Step 4: Resume generation + PDF rendering
      setState({ status: "generating" });
      await new Promise((r) => setTimeout(r, 50));

      const result = await generateResume({
        linkedInData,
        githubData,
        documentText,
        uploadedFileGcsPath,
      });

      setState({ status: "done", result });
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
      });
    }
  }

  function reset() {
    setState({ status: "idle" });
  }

  return { state, build, reset };
}

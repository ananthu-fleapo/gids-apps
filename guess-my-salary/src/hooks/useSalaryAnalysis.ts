"use client";

import { useState, useCallback } from "react";
import { extractTextFromPdf } from "@/lib/pdfText";
import { analyzeSalary } from "@/lib/api";
import type { AnalysisState } from "@/lib/types";

export function useSalaryAnalysis() {
  const [state, setState] = useState<AnalysisState>({ status: "idle" });

  const analyze = useCallback(async (file: File) => {
    try {
      setState({ status: "parsing" });
      const resumeText = await extractTextFromPdf(file);

      setState({ status: "predicting" });
      // Small yield so the UI can paint the "predicting" state before the long fetch
      await new Promise((resolve) => setTimeout(resolve, 50));

      // The API does prediction + explanation server-side sequentially,
      // so we show "explaining" state after a short delay to give feedback
      const resultPromise = analyzeSalary(resumeText);

      // After 3 s assume prediction done, show explaining state
      const explainTimer = setTimeout(() => {
        setState({ status: "explaining" });
      }, 3000);

      const result = await resultPromise;
      clearTimeout(explainTimer);

      setState({ status: "done", result });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: "idle" });
  }, []);

  return { state, analyze, reset };
}

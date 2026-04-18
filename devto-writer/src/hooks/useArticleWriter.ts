"use client";

import { useState } from "react";
import type { ArticleInputs, DevToStyleProfile, WriterState } from "@/lib/types";
import { fetchArticleStyle, generateArticle } from "@/lib/api";
import { getStoredApiKey, pushDraftToDevTo } from "@/lib/devToService";
import {
  parseLiquidTagSuggestions,
  stripLiquidTagComment,
  type LiquidTagSuggestion,
} from "@/lib/liquidTags";

export function useArticleWriter() {
  const [state, setState] = useState<WriterState>({ status: "idle" });
  const [markdown, setMarkdown] = useState("");
  const [liquidSuggestions, setLiquidSuggestions] = useState<LiquidTagSuggestion[]>([]);
  // Store original inputs so StyleProfileEditor can trigger generate
  const [pendingInputs, setPendingInputs] = useState<{
    topic: string;
    roughNotes: string;
  } | null>(null);

  async function write(inputs: ArticleInputs) {
    const { topic, roughNotes, referenceUrl } = inputs;
    setPendingInputs({ topic, roughNotes });

    try {
      if (referenceUrl) {
        setState({ status: "fetching-style" });
        // Small yield to ensure the UI paints before the blocking fetch
        await new Promise((r) => setTimeout(r, 50));
        const { styleProfile } = await fetchArticleStyle(referenceUrl);
        setState({ status: "style-ready", styleProfile });
        // Execution pauses here — user edits style, then calls generate()
      } else {
        await generate(topic, roughNotes, undefined);
      }
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }

  async function generate(
    topic: string,
    roughNotes: string,
    styleProfile: DevToStyleProfile | undefined
  ) {
    setState({ status: "generating" });
    await new Promise((r) => setTimeout(r, 50));

    try {
      const result = await generateArticle({ topic, roughNotes, styleProfile });

      // Parse and strip the liquid tag suggestions comment before showing the editor
      const suggestions = parseLiquidTagSuggestions(result.markdown);
      const cleanMarkdown = stripLiquidTagComment(result.markdown);

      setMarkdown(cleanMarkdown);
      setLiquidSuggestions(suggestions);
      setState({ status: "done", markdown: cleanMarkdown });
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error ? err.message : "Generation failed.",
      });
    }
  }

  function generateWithStyle(editedProfile: DevToStyleProfile) {
    if (!pendingInputs) return;
    generate(pendingInputs.topic, pendingInputs.roughNotes, editedProfile);
  }

  function skipStyleMirroring() {
    if (!pendingInputs) return;
    generate(pendingInputs.topic, pendingInputs.roughNotes, undefined);
  }

  async function publish() {
    const apiKey = getStoredApiKey();
    if (!apiKey) return "needs-key" as const;

    setState({ status: "publishing" });
    try {
      const { url } = await pushDraftToDevTo(markdown, apiKey);
      setState({ status: "published", url });
      return "published" as const;
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error ? err.message : "Failed to push to Dev.to",
      });
      return "error" as const;
    }
  }

  async function publishWithKey(apiKey: string) {
    setState({ status: "publishing" });
    try {
      const { url } = await pushDraftToDevTo(markdown, apiKey);
      setState({ status: "published", url });
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error ? err.message : "Failed to push to Dev.to",
      });
    }
  }

  function reset() {
    setState({ status: "idle" });
    setMarkdown("");
    setLiquidSuggestions([]);
    setPendingInputs(null);
  }

  return {
    state,
    markdown,
    setMarkdown,
    liquidSuggestions,
    setLiquidSuggestions,
    pendingInputs,
    write,
    generateWithStyle,
    skipStyleMirroring,
    publish,
    publishWithKey,
    reset,
  };
}

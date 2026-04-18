"use client";

import { useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArticleForm } from "@/components/ArticleForm";
import { StyleProfileEditor } from "@/components/StyleProfileEditor";
import { SplitPreview } from "@/components/SplitPreview";
import { StatusBanner } from "@/components/StatusBanner";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { useArticleWriter } from "@/hooks/useArticleWriter";
import { insertLiquidTag } from "@/lib/liquidTags";
import type { LiquidTagSuggestion } from "@/lib/liquidTags";
import { getStoredApiKey } from "@/lib/devToService";

export default function Home() {
  const {
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
  } = useArticleWriter();

  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const isLoading =
    state.status === "fetching-style" || state.status === "generating";

  const isInEditor =
    state.status === "done" ||
    state.status === "publishing" ||
    state.status === "published";

  async function handlePublishClick() {
    const storedKey = getStoredApiKey();
    if (!storedKey) {
      setShowApiKeyModal(true);
    } else {
      await publish();
    }
  }

  function handleApiKeyConfirm(apiKey: string) {
    setShowApiKeyModal(false);
    publishWithKey(apiKey);
  }

  function handleInsertSuggestion(suggestion: LiquidTagSuggestion) {
    const updated = insertLiquidTag(markdown, suggestion);
    setMarkdown(updated);
    // Remove inserted suggestion from the list
    setLiquidSuggestions((prev) =>
      prev.filter((s) => s.tag !== suggestion.tag || s.location !== suggestion.location)
    );
  }

  function handleDismissSuggestion(index: number) {
    setLiquidSuggestions((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-900 leading-none">
                Dev.to Article Writer
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Rough notes → polished drafts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-1 text-xs">
              <Sparkles className="h-3 w-3" />
              Claude Sonnet 4.6
            </Badge>
            {(isInEditor || state.status === "error" || state.status === "style-ready") && (
              <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" />
                Start Over
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <StatusBanner state={state} onReset={reset} />

        {/* Form — shown when idle or error */}
        {(state.status === "idle" || state.status === "error") && (
          <div className="mt-4 max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Turn your notes into a great Dev.to post
              </h2>
              <p className="text-slate-500">
                Paste your rough notes, optionally add a reference article to match its style,
                and let AI do the writing.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <ArticleForm onSubmit={write} isLoading={isLoading} />
            </div>
          </div>
        )}

        {/* Loading states */}
        {(state.status === "fetching-style" || state.status === "generating") && (
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
            <p className="text-slate-500 text-sm">
              {state.status === "fetching-style"
                ? "Analyzing reference article style…"
                : "Generating your article…"}
            </p>
          </div>
        )}

        {/* Style Profile Editor — pause state */}
        {state.status === "style-ready" && (
          <div className="mt-4 max-w-2xl mx-auto">
            <StyleProfileEditor
              styleProfile={state.styleProfile}
              onGenerate={generateWithStyle}
              onSkip={skipStyleMirroring}
            />
          </div>
        )}

        {/* Split Preview Editor */}
        {isInEditor && (
          <div className="mt-4 h-[calc(100vh-200px)] min-h-[500px]">
            <SplitPreview
              markdown={markdown}
              topic={pendingInputs?.topic ?? ""}
              onMarkdownChange={setMarkdown}
              onPublish={handlePublishClick}
              isPublishing={state.status === "publishing"}
              liquidSuggestions={liquidSuggestions}
              onInsertSuggestion={handleInsertSuggestion}
              onDismissSuggestion={handleDismissSuggestion}
            />
          </div>
        )}
      </main>

      {/* API Key Modal */}
      <ApiKeyModal
        open={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onConfirm={handleApiKeyConfirm}
      />
    </div>
  );
}

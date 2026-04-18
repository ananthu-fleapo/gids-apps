"use client";

import { useState } from "react";
import { Copy, Upload, Check, Tag, X, ChevronDown, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MetricsBar } from "@/components/MetricsBar";
import { insertLiquidTag, type LiquidTagSuggestion } from "@/lib/liquidTags";
import { stripFrontMatter } from "@/lib/metrics";
import { cn } from "@/lib/utils";

interface Props {
  markdown: string;
  topic: string;
  onMarkdownChange: (md: string) => void;
  onPublish: () => void;
  isPublishing: boolean;
  liquidSuggestions: LiquidTagSuggestion[];
  onDismissSuggestion: (index: number) => void;
  onInsertSuggestion: (suggestion: LiquidTagSuggestion) => void;
}

type Tab = "editor" | "preview";

export function SplitPreview({
  markdown,
  topic,
  onMarkdownChange,
  onPublish,
  isPublishing,
  liquidSuggestions,
  onDismissSuggestion,
  onInsertSuggestion,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("editor");
  const [copied, setCopied] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);

  async function handleCopy() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const previewMarkdown = stripFrontMatter(markdown);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between py-3 gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Markdown
              </>
            )}
          </Button>
        </div>
        <Button
          onClick={onPublish}
          disabled={isPublishing}
          size="sm"
          className="gap-1.5"
        >
          <Upload className="h-3.5 w-3.5" />
          {isPublishing ? "Pushing…" : "Push to Dev.to as Draft"}
        </Button>
      </div>

      {/* Metrics */}
      <MetricsBar markdown={markdown} topic={topic} />

      {/* Liquid Tag Suggestions */}
      {liquidSuggestions.length > 0 && (
        <div className="border-b border-slate-100 py-2">
          <button
            onClick={() => setSuggestionsOpen((o) => !o)}
            className="flex items-center gap-1.5 text-xs font-medium text-violet-700 hover:text-violet-900 transition-colors mb-2"
          >
            <Tag className="h-3.5 w-3.5" />
            Suggested Liquid Tags ({liquidSuggestions.length})
            {suggestionsOpen ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
          {suggestionsOpen && (
            <div className="flex flex-wrap gap-2">
              {liquidSuggestions.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 pl-3 pr-1 py-1 text-xs text-violet-800"
                  title={s.reason}
                >
                  <span className="font-mono text-violet-600">{s.tag}</span>
                  <span className="text-violet-400 mx-1">·</span>
                  <span className="text-slate-500 max-w-[140px] truncate">{s.location}</span>
                  <button
                    onClick={() => onInsertSuggestion(s)}
                    className="ml-1 rounded-full bg-violet-200 hover:bg-violet-300 px-1.5 py-0.5 font-medium transition-colors"
                  >
                    Insert
                  </button>
                  <button
                    onClick={() => onDismissSuggestion(i)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-violet-200 transition-colors"
                    aria-label="Dismiss suggestion"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex border-b border-slate-200 shrink-0">
        {(["editor", "preview"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-2 text-sm font-medium capitalize transition-colors",
              activeTab === tab
                ? "border-b-2 border-slate-900 text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Panes */}
      <div className="flex flex-row gap-4 flex-1 overflow-hidden mt-3 min-h-0">
        {/* Editor pane */}
        <div
          className={cn(
            "flex-1 overflow-auto",
            // Mobile: show/hide based on active tab
            "hidden md:flex md:flex-col",
            activeTab === "editor" && "!flex flex-col"
          )}
        >
          <p className="hidden md:block text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
            Editor
          </p>
          <Textarea
            value={markdown}
            onChange={(e) => onMarkdownChange(e.target.value)}
            className="flex-1 font-mono text-sm resize-none h-full min-h-[60vh]"
            spellCheck={false}
          />
        </div>

        {/* Divider (desktop only) */}
        <div className="hidden md:block w-px bg-slate-100 shrink-0" />

        {/* Preview pane */}
        <div
          className={cn(
            "flex-1 overflow-auto",
            "hidden md:flex md:flex-col",
            activeTab === "preview" && "!flex flex-col"
          )}
        >
          <p className="hidden md:block text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
            Preview
          </p>
          <div className="prose prose-slate max-w-none text-sm overflow-auto min-h-[60vh] border border-slate-100 rounded-lg p-4 bg-white">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const isBlock = className?.includes("language-");
                  if (isBlock) {
                    return (
                      <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-xs">
                        <code className={className}>{children}</code>
                      </pre>
                    );
                  }
                  return (
                    <code
                      className="bg-slate-100 text-slate-800 rounded px-1 text-xs"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {previewMarkdown}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

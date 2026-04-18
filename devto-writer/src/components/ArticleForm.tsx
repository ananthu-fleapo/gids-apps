"use client";

import { useState } from "react";
import { Loader2, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArticleInputSchema, type ArticleInputValues } from "@/lib/validation";
import type { ArticleInputs } from "@/lib/types";

interface Props {
  onSubmit: (inputs: ArticleInputs) => void;
  isLoading: boolean;
}

export function ArticleForm({ onSubmit, isLoading }: Props) {
  const [topic, setTopic] = useState("");
  const [roughNotes, setRoughNotes] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ArticleInputValues, string[]>>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = ArticleInputSchema.safeParse({
      topic,
      roughNotes,
      referenceUrl: referenceUrl || undefined,
    });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onSubmit(result.data as ArticleInputs);
  }

  const notesShort = roughNotes.length > 0 && roughNotes.length < 100;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Topic */}
      <div className="space-y-2">
        <Label htmlFor="topic">
          Topic <span className="text-red-500">*</span>
        </Label>
        <Input
          id="topic"
          placeholder="e.g. Why I switched from REST to tRPC"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={isLoading}
          className="text-base"
        />
        {errors.topic && (
          <p className="text-sm text-red-500">{errors.topic[0]}</p>
        )}
      </div>

      {/* Rough Notes */}
      <div className="space-y-2">
        <Label htmlFor="roughNotes">
          Rough Notes <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="roughNotes"
          placeholder="Dump everything here — bullet points, code snippets, links, half-formed thoughts. The messier the better."
          value={roughNotes}
          onChange={(e) => setRoughNotes(e.target.value)}
          disabled={isLoading}
          rows={9}
          className="font-mono text-sm resize-y"
        />
        <div className="flex items-center justify-between">
          <div>
            {errors.roughNotes && (
              <p className="text-sm text-red-500">{errors.roughNotes[0]}</p>
            )}
            {notesShort && !errors.roughNotes && (
              <p className="text-sm text-amber-600">
                Brief notes may produce a shorter article. More context = better output.
              </p>
            )}
          </div>
          <span className="text-xs text-slate-400">
            {roughNotes.length.toLocaleString()} / 10,000
          </span>
        </div>
      </div>

      {/* Reference URL */}
      <div className="space-y-2">
        <Label htmlFor="referenceUrl">
          Reference Dev.to Article{" "}
          <span className="text-slate-400 font-normal">(optional)</span>
        </Label>
        <Input
          id="referenceUrl"
          placeholder="https://dev.to/username/article-slug"
          value={referenceUrl}
          onChange={(e) => setReferenceUrl(e.target.value)}
          disabled={isLoading}
          type="url"
        />
        {errors.referenceUrl && (
          <p className="text-sm text-red-500">{errors.referenceUrl[0]}</p>
        )}
        <p className="text-xs text-slate-500">
          Paste a published Dev.to article URL to mirror that author&apos;s writing style.
        </p>
      </div>

      <Button type="submit" disabled={isLoading} size="lg" className="w-full gap-2">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Working…
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate Article
          </>
        )}
      </Button>

      <p className="text-xs text-center text-slate-400">
        Powered by Claude Sonnet 4.6 via{" "}
        <a
          href="https://dev.to/settings/extensions"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-slate-600 inline-flex items-center gap-0.5"
        >
          Mesh API <ExternalLink className="h-3 w-3" />
        </a>
      </p>
    </form>
  );
}

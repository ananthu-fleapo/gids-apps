"use client";

import { useMemo } from "react";
import { Clock, FileText, TrendingUp, AlertCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { computeMetrics } from "@/lib/metrics";
import { cn } from "@/lib/utils";

interface Props {
  markdown: string;
  topic: string;
}

export function MetricsBar({ markdown, topic }: Props) {
  const metrics = useMemo(
    () => computeMetrics(markdown, topic),
    [markdown, topic]
  );

  const seoColor =
    metrics.seoScore >= 80
      ? "text-emerald-600"
      : metrics.seoScore >= 50
      ? "text-amber-600"
      : "text-red-600";

  const seoLabel =
    metrics.seoScore >= 80 ? "Good" : metrics.seoScore >= 50 ? "Fair" : "Needs work";

  return (
    <div className="flex items-center gap-4 px-1 py-2 text-sm text-slate-500 border-b border-slate-100">
      <span className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" />
        {metrics.readingTimeMinutes} min read
      </span>
      <span className="text-slate-200">•</span>
      <span className="flex items-center gap-1.5">
        <FileText className="h-3.5 w-3.5" />
        {metrics.wordCount.toLocaleString()} words
      </span>
      <span className="text-slate-200">•</span>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-1.5 font-medium cursor-pointer hover:opacity-80 transition-opacity",
              seoColor
            )}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            SEO: {metrics.seoScore}/100
            <span className="font-normal text-slate-400">({seoLabel})</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <p className="font-semibold text-sm mb-3">SEO Checklist</p>
          {metrics.seoIssues.length === 0 ? (
            <p className="text-sm text-emerald-600 flex items-center gap-1.5">
              <span>✓</span> All checks passed!
            </p>
          ) : (
            <ul className="space-y-2">
              {metrics.seoIssues.map((issue, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  {issue}
                </li>
              ))}
            </ul>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

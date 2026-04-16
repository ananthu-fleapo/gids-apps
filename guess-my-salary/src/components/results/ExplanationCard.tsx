"use client";

import type { SalaryExplanation } from "@/lib/types";

interface ExplanationCardProps {
  explanation: SalaryExplanation;
}

export function ExplanationCard({ explanation }: ExplanationCardProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Profile tier + Percentile note + Summary */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col gap-3">
        {explanation.profile_tier && (
          <p className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-3">
            🎯 {explanation.profile_tier}
          </p>
        )}
        {explanation.percentile_note && (
          <p className="text-sm font-medium text-indigo-600">
            📊 {explanation.percentile_note}
          </p>
        )}
        <p className="text-gray-700 leading-relaxed">{explanation.summary}</p>
      </div>

      {/* Ceiling + Gap to top-tier + Aspiration — three insights */}
      {(explanation.salary_ceiling || explanation.gap_to_top_tier || explanation.aspiration_comparison) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {explanation.salary_ceiling && (
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 flex flex-col gap-1.5">
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                Current ceiling
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{explanation.salary_ceiling}</p>
            </div>
          )}
          {explanation.gap_to_top_tier && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 flex flex-col gap-1.5">
              <p className="text-xs font-semibold text-rose-600 uppercase tracking-wide">
                Gap to top-tier
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{explanation.gap_to_top_tier}</p>
            </div>
          )}
          {explanation.aspiration_comparison && (
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4 flex flex-col gap-1.5">
              <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide">
                Top of the range
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{explanation.aspiration_comparison}</p>
            </div>
          )}
        </div>
      )}

      {/* Strengths + Gaps side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {explanation.strengths.length > 0 && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-3">
              Strengths
            </p>
            <ul className="flex flex-col gap-2">
              {explanation.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-0.5 text-emerald-500 font-bold shrink-0">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {explanation.gaps.length > 0 && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
            <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-3">
              Gaps
            </p>
            <ul className="flex flex-col gap-2">
              {explanation.gaps.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-0.5 text-red-400 font-bold shrink-0">✕</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* How to improve */}
      {explanation.how_to_improve.length > 0 && (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-3">
            How to increase your salary
          </p>
          <ol className="flex flex-col gap-2">
            {explanation.how_to_improve.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-200 text-indigo-700 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Roast */}
      {explanation.roast && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <span className="text-xl shrink-0">🔥</span>
          <p className="text-sm text-amber-800 italic">{explanation.roast}</p>
        </div>
      )}
    </div>
  );
}

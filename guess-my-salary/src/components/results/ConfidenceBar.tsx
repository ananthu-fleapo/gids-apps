"use client";

import { motion } from "framer-motion";

interface ConfidenceBarProps {
  confidence: number; // 0-1
}

export function ConfidenceBar({ confidence }: ConfidenceBarProps) {
  const pct = Math.round(confidence * 100);

  const color =
    pct >= 85 ? "bg-emerald-400" : pct >= 60 ? "bg-amber-400" : "bg-red-400";

  const label =
    pct >= 85
      ? "High confidence"
      : pct >= 70
        ? "Moderate to high confidence"
        : pct >= 45
          ? "Moderate confidence"
          : "Low confidence — profile details are sparse";

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <span className="text-xs font-semibold text-gray-700">{pct}%</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

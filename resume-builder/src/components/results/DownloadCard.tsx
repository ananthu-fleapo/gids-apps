"use client";

import { motion } from "framer-motion";
import type { GenerateResult } from "@/lib/types";

interface DownloadCardProps {
  result: GenerateResult;
  onReset: () => void;
}

export function DownloadCard({ result, onReset }: DownloadCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-lg">Resume Ready!</p>
          <p className="text-white/70 text-sm">Saved to Google Cloud Storage</p>
        </div>
      </div>

      <a
        href={result.pdfGcsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 bg-white text-indigo-700 font-semibold py-3 rounded-xl hover:bg-indigo-50 transition-colors mb-3"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download PDF
      </a>

      <button
        onClick={onReset}
        className="w-full text-white/70 text-sm hover:text-white transition-colors py-1"
      >
        Build another resume
      </button>
    </motion.div>
  );
}

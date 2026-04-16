"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ResumeUploadProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export function ResumeUpload({ onFile, disabled }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  function validateAndSubmit(file: File) {
    setFileError(null);

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setFileError("Only PDF files are supported.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError("File must be under 10 MB.");
      return;
    }

    onFile(file);
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) validateAndSubmit(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disabled]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSubmit(file);
    // Reset input so same file can be re-uploaded
    e.target.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg">
      <motion.div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        animate={{
          borderColor: isDragging ? "#6366f1" : "#d1d5db",
          backgroundColor: isDragging ? "#eef2ff" : "#fafafa",
          scale: isDragging ? 1.02 : 1,
        }}
        transition={{ duration: 0.15 }}
        className={[
          "w-full rounded-2xl border-2 border-dashed p-10 flex flex-col items-center gap-4 cursor-pointer select-none",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-indigo-400 hover:bg-indigo-50/40",
        ].join(" ")}
      >
        <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4M4 20h16" />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-gray-700 font-medium">Drop your resume here</p>
          <p className="text-sm text-gray-400 mt-1">or click to browse · PDF only · max 10 MB</p>
        </div>
      </motion.div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />

      <AnimatePresence>
        {fileError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-red-500"
          >
            {fileError}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DocumentUploadProps {
  onFile: (file: File) => void;
  currentFile?: File | null;
  disabled?: boolean;
}

export function DocumentUpload({ onFile, currentFile, disabled }: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  function validateAndSubmit(file: File) {
    setFileError(null);

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isDocx =
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.toLowerCase().endsWith(".docx");

    if (!isPdf && !isDocx) {
      setFileError("Only PDF and DOCX files are supported.");
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
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <span className="w-5 h-5 rounded bg-indigo-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </span>
        Upload Existing Resume
      </label>

      <motion.div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        animate={{
          borderColor: currentFile ? "#6366f1" : isDragging ? "#6366f1" : "#d1d5db",
          backgroundColor: currentFile ? "#eef2ff" : isDragging ? "#eef2ff" : "#fafafa",
          scale: isDragging ? 1.01 : 1,
        }}
        transition={{ duration: 0.15 }}
        className={[
          "w-full rounded-xl border-2 border-dashed p-6 flex flex-col items-center gap-3 cursor-pointer select-none",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-indigo-400 hover:bg-indigo-50/40",
        ].join(" ")}
      >
        {currentFile ? (
          <>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-indigo-700">{currentFile.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">Click to replace</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4M4 20h16" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">Drop your resume here</p>
              <p className="text-xs text-gray-400 mt-0.5">PDF or DOCX · max 10 MB</p>
            </div>
          </>
        )}
      </motion.div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
            className="text-xs text-red-500"
          >
            {fileError}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState } from "react";

interface LinkedInInputProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export function LinkedInInput({ value, onChange, disabled }: LinkedInInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <span className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </span>
        LinkedIn Profile URL
      </label>
      <div
        className={[
          "flex items-center rounded-xl border-2 bg-white px-4 py-3 transition-all",
          focused ? "border-blue-500 shadow-sm shadow-blue-100" : "border-gray-200",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
      >
        <input
          type="url"
          placeholder="https://linkedin.com/in/yourprofile"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className="flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-400 text-sm"
        />
      </div>
      <p className="text-xs text-gray-400">e.g. https://linkedin.com/in/johndoe</p>
    </div>
  );
}

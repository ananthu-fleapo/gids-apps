"use client";

import { motion } from "framer-motion";
import type { BuilderState } from "@/lib/types";

const STEPS = [
  { key: "uploading", label: "Uploading document" },
  { key: "scraping", label: "Scraping profiles" },
  { key: "parsing", label: "Extracting profile" },
  { key: "generating", label: "Writing resume" },
];

const STATUS_ORDER = ["uploading", "scraping", "parsing", "generating", "done"];

function getStepIndex(status: string) {
  return STATUS_ORDER.indexOf(status);
}

interface ProgressStepperProps {
  state: BuilderState;
}

export function ProgressStepper({ state }: ProgressStepperProps) {
  const currentIndex = getStepIndex(state.status);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col gap-3">
        {STEPS.map((step, i) => {
          const stepIndex = i; // 0-based matching STATUS_ORDER
          const isCompleted = currentIndex > stepIndex;
          const isActive = currentIndex === stepIndex;

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div
                className={[
                  "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300",
                  isCompleted
                    ? "bg-emerald-500"
                    : isActive
                    ? "bg-indigo-500"
                    : "bg-gray-200",
                ].join(" ")}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : isActive ? (
                  <motion.div
                    className="w-3 h-3 rounded-full bg-white"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-gray-400" />
                )}
              </div>

              <span
                className={[
                  "text-sm transition-colors duration-300",
                  isCompleted
                    ? "text-gray-500 line-through"
                    : isActive
                    ? "text-indigo-700 font-semibold"
                    : "text-gray-400",
                ].join(" ")}
              >
                {step.label}
              </span>

              {isActive && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-xs text-indigo-400 ml-auto"
                >
                  in progress...
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

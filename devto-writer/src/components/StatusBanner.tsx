"use client";

import { Loader2, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WriterState } from "@/lib/types";

interface Props {
  state: WriterState;
  onReset: () => void;
}

export function StatusBanner({ state, onReset }: Props) {
  if (state.status === "idle" || state.status === "done" || state.status === "style-ready") {
    return null;
  }

  if (state.status === "fetching-style") {
    return (
      <Banner color="blue">
        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        <span>Analyzing reference article style…</span>
      </Banner>
    );
  }

  if (state.status === "generating") {
    return (
      <Banner color="blue">
        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        <span>Generating your article…</span>
      </Banner>
    );
  }

  if (state.status === "publishing") {
    return (
      <Banner color="blue">
        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        <span>Pushing draft to Dev.to…</span>
      </Banner>
    );
  }

  if (state.status === "published") {
    return (
      <Banner color="green">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>Draft created on Dev.to!</span>
        <a
          href={state.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline underline-offset-2 font-medium hover:opacity-80"
        >
          View draft <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </Banner>
    );
  }

  if (state.status === "error") {
    return (
      <Banner color="red">
        <XCircle className="h-4 w-4 shrink-0" />
        <span className="flex-1">{state.message}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-7 px-2 text-red-700 hover:text-red-800 hover:bg-red-200"
        >
          Try again
        </Button>
      </Banner>
    );
  }

  return null;
}

function Banner({
  color,
  children,
}: {
  color: "blue" | "green" | "red";
  children: React.ReactNode;
}) {
  const classes = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-emerald-50 border-emerald-200 text-emerald-800",
    red: "bg-red-50 border-red-200 text-red-800",
  }[color];

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${classes}`}
    >
      {children}
    </div>
  );
}

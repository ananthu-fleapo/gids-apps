"use client";

import { useState } from "react";
import { X, Plus, Wand2, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { DevToStyleProfile } from "@/lib/types";

interface Props {
  styleProfile: DevToStyleProfile;
  onGenerate: (editedProfile: DevToStyleProfile) => void;
  onSkip: () => void;
}

function parseBadges(text: string): string[] {
  // Split on commas and periods, trim, filter blanks
  return text
    .split(/[,.\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 80);
}

function BadgeGroup({
  label,
  items,
  onRemove,
  onAdd,
}: {
  label: string;
  items: string[];
  onRemove: (i: number) => void;
  onAdd: (val: string) => void;
}) {
  const [inputVal, setInputVal] = useState("");

  function handleAdd() {
    const v = inputVal.trim();
    if (v) {
      onAdd(v);
      setInputVal("");
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <Badge
            key={i}
            variant="secondary"
            className="gap-1 pr-1 text-sm font-normal"
          >
            {item}
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="ml-0.5 rounded-full hover:bg-slate-300 p-0.5 transition-colors"
              aria-label={`Remove ${item}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <div className="flex items-center gap-1">
          <Input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
            placeholder="Add…"
            className="h-7 w-28 text-xs"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-full p-1 hover:bg-slate-200 transition-colors"
            aria-label="Add"
          >
            <Plus className="h-3.5 w-3.5 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function StyleProfileEditor({ styleProfile, onGenerate, onSkip }: Props) {
  const [toneBadges, setToneBadges] = useState<string[]>(
    parseBadges(styleProfile.toneDescription)
  );
  const [structureBadges, setStructureBadges] = useState<string[]>(
    parseBadges(styleProfile.structureNotes)
  );
  const [liquidBadges, setLiquidBadges] = useState<string[]>(
    parseBadges(styleProfile.liquidTagUsage)
  );
  const [phrases, setPhrases] = useState<string[]>(styleProfile.examplePhrases);

  function handleGenerate() {
    const editedProfile: DevToStyleProfile = {
      toneDescription: toneBadges.join(", "),
      structureNotes: structureBadges.join(", "),
      liquidTagUsage: liquidBadges.join(", ") || "none observed",
      examplePhrases: phrases,
    };
    onGenerate(editedProfile);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Wand2 className="h-5 w-5 text-violet-500" />
          <h2 className="font-semibold text-slate-900">Style Profile Detected</h2>
        </div>
        <p className="text-sm text-slate-500">
          We analyzed the reference article&apos;s writing style. Review and adjust these
          traits before generating — they guide the AI&apos;s voice.
        </p>
      </div>

      <div className="space-y-5">
        <BadgeGroup
          label="Tone"
          items={toneBadges}
          onRemove={(i) => setToneBadges((p) => p.filter((_, idx) => idx !== i))}
          onAdd={(v) => setToneBadges((p) => [...p, v])}
        />
        <BadgeGroup
          label="Structure"
          items={structureBadges}
          onRemove={(i) => setStructureBadges((p) => p.filter((_, idx) => idx !== i))}
          onAdd={(v) => setStructureBadges((p) => [...p, v])}
        />
        <BadgeGroup
          label="Liquid Tags Used"
          items={liquidBadges}
          onRemove={(i) => setLiquidBadges((p) => p.filter((_, idx) => idx !== i))}
          onAdd={(v) => setLiquidBadges((p) => [...p, v])}
        />
        <BadgeGroup
          label="Characteristic Phrases"
          items={phrases}
          onRemove={(i) => setPhrases((p) => p.filter((_, idx) => idx !== i))}
          onAdd={(v) => setPhrases((p) => [...p, v])}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onSkip}
          className="gap-2"
        >
          <SkipForward className="h-4 w-4" />
          Skip Style Mirroring
        </Button>
        <Button onClick={handleGenerate} className="flex-1 gap-2">
          <Wand2 className="h-4 w-4" />
          Generate with This Style
        </Button>
      </div>
    </div>
  );
}

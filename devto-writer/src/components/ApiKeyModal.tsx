"use client";

import { useState, useEffect } from "react";
import { Shield, ExternalLink, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DevToApiKeySchema } from "@/lib/validation";
import { getStoredApiKey, saveApiKey } from "@/lib/devToService";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (apiKey: string) => void;
}

export function ApiKeyModal({ open, onClose, onConfirm }: Props) {
  const [value, setValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-populate with stored key on open
  useEffect(() => {
    if (open) {
      const stored = getStoredApiKey();
      if (stored) setValue(stored);
    }
  }, [open]);

  function handleConfirm() {
    const result = DevToApiKeySchema.safeParse(value);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid API key");
      return;
    }
    setError(null);
    saveApiKey(value);
    onConfirm(value);
  }

  function handleClose() {
    setError(null);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Your Dev.to Account</DialogTitle>
          <DialogDescription>
            Your API key is required to create draft articles on Dev.to.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Security note */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex gap-2.5">
            <Shield className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800">
              Your API key is stored locally in your browser and is only sent
              directly to Dev.to&apos;s official API to create drafts. It never
              passes through our servers.
            </p>
          </div>

          {/* Key input */}
          <div className="space-y-2">
            <Label htmlFor="apiKey">Dev.to API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? "text" : "password"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Paste your API key here"
                className="pr-10"
                onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              />
              <button
                type="button"
                onClick={() => setShowKey((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showKey ? "Hide key" : "Show key"}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <p className="text-xs text-slate-500">
              Get your key at{" "}
              <a
                href="https://dev.to/settings/extensions"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-slate-700 inline-flex items-center gap-0.5"
              >
                Dev.to → Settings → Extensions → Generate API Key
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              Save & Publish
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export type SaveBarProps = {
  dirty: boolean;
  onDiscard: () => void;
  onSave: () => void;
};

export function SaveBar({ dirty, onDiscard, onSave }: SaveBarProps) {
  if (!dirty) {
    return null;
  }

  return (
    <div className="sticky bottom-4 z-20 mt-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-highlight/40 bg-surface/95 px-4 py-3 shadow-xl shadow-black/20 backdrop-blur">
      <p className="flex items-center gap-2 font-mono text-[11px] text-foreground">
        <span
          aria-hidden
          className="size-1.5 rounded-full bg-highlight motion-safe:animate-pulse"
        />
        Unsaved changes
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDiscard}
          className="text-muted-foreground hover:text-foreground"
        >
          Discard
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onSave}
          className="gap-1.5 bg-highlight font-medium text-on-highlight hover:bg-highlight/90 focus-visible:border-highlight focus-visible:ring-highlight/40"
        >
          <CheckIcon aria-hidden />
          Save changes
        </Button>
      </div>
    </div>
  );
}

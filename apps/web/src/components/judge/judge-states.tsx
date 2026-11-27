"use client";

import { useState } from "react";
import { ChevronDownIcon, ScaleIcon } from "lucide-react";

import { JudgeResultsSkeleton } from "@/components/judge/results-skeleton";
import { RunJudgeButton } from "@/components/judge/run-judge-button";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const previewStates = [
  { id: "empty", label: "Empty state" },
  { id: "loading", label: "Loading skeletons" },
] as const;

type PreviewState = (typeof previewStates)[number]["id"];

export function JudgeStatesPreview() {
  const [preview, setPreview] = useState<PreviewState>("empty");
  const current =
    previewStates.find((state) => state.id === preview) ?? previewStates[0];

  return (
    <section className="overflow-hidden rounded-xl border border-dashed border-border/70 bg-surface/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            UI states
          </h2>
          <span className="rounded-full border border-border/60 bg-surface-2/40 px-2 py-0.5 font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
            Dev preview
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-w-44 justify-between gap-2 border-border/70 bg-surface/60 font-mono text-[11px]"
            >
              {current.label}
              <ChevronDownIcon
                aria-hidden
                className="size-3 text-muted-foreground"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-mono text-[10px] tracking-[0.14em] uppercase">
              Preview state
            </DropdownMenuLabel>
            {previewStates.map((state) => (
              <DropdownMenuItem
                key={state.id}
                onSelect={() => setPreview(state.id)}
                className="gap-2 font-mono text-[11px]"
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full",
                    preview === state.id ? "bg-highlight" : "bg-border",
                  )}
                />
                {state.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="p-4 sm:p-5">
        {preview === "empty" ? (
          <EmptyState
            icon={ScaleIcon}
            title="No verdict yet"
            description="Pick a judge model and a rubric, include the answers you want scored, then run the judge. Scores, strengths, weaknesses and the winner appear here."
          />
        ) : (
          <JudgeResultsSkeleton />
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/40 pt-4">
          <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            Run button
          </span>
          <RunJudgeButton />
          <RunJudgeButton state="loading" />
          <RunJudgeButton state="disabled" />
        </div>
      </div>
    </section>
  );
}

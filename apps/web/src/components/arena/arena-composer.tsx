"use client";

import { useId, useMemo, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  LayersIcon,
  SparklesIcon,
} from "lucide-react";

import { RunComparisonButton } from "@/components/arena/run-comparison-button";
import { providerDotClass } from "@/components/shared/model-badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Model, PromptTemplate } from "@/mocks/data";

export type ArenaComposerProps = {
  models: Model[];
  templates: PromptTemplate[];
  defaultPrompt: string;
  defaultSystemPrompt: string;
  defaultModelIds: string[];
};

export function ArenaComposer({
  models,
  templates,
  defaultPrompt,
  defaultSystemPrompt,
  defaultModelIds,
}: ArenaComposerProps) {
  const [systemOpen, setSystemOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultModelIds);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState("1024");

  const promptId = useId();
  const systemId = useId();
  const maxTokensId = useId();

  const tokenEstimate = useMemo(() => {
    const words = prompt.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words * 1.35));
  }, [prompt]);

  const atMinimum = selectedIds.length <= 2;

  function toggleModel(modelId: string) {
    setSelectedIds((current) => {
      if (current.includes(modelId)) {
        return current.length <= 2
          ? current
          : current.filter((id) => id !== modelId);
      }
      return [...current, modelId];
    });
  }

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <Card className="gap-0 overflow-hidden border border-border/70 bg-surface/50 py-0 ring-0 transition-colors duration-200 focus-within:border-border">
        <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/50 px-4 py-3.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-highlight/25 bg-highlight/10 text-highlight">
              <SparklesIcon aria-hidden className="size-4" />
            </span>
            <div className="min-w-0">
              <CardTitle className="truncate text-sm font-medium">
                Compose a comparison
              </CardTitle>
              <p className="mt-0.5 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                {selectedIds.length} of {models.length} models selected
              </p>
            </div>
          </div>
          <span className="hidden items-center gap-1.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
            <span aria-hidden className="size-1.5 rounded-full bg-success" />
            ready
          </span>
        </CardHeader>

        <div className="border-b border-border/50">
          <button
            type="button"
            aria-expanded={systemOpen}
            aria-controls={systemId}
            onClick={() => setSystemOpen((open) => !open)}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-surface-2/30 focus-visible:bg-surface-2/30 focus-visible:outline-none sm:px-5"
          >
            <ChevronRightIcon
              aria-hidden
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
                systemOpen && "rotate-90",
              )}
            />
            <span className="text-xs font-medium text-foreground">
              System prompt
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              optional
            </span>
            <span className="ml-auto font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
              {systemOpen ? "hide" : "show"}
            </span>
          </button>
          {systemOpen && (
            <div id={systemId} className="px-4 pb-3 sm:px-5">
              <Textarea
                value={systemPrompt}
                onChange={(event) => setSystemPrompt(event.target.value)}
                rows={2}
                placeholder="Give every model the same role and constraints…"
                className="min-h-16 resize-y border-border/60 bg-background/40 font-mono text-xs leading-relaxed"
              />
            </div>
          )}
        </div>

        <div className="space-y-2 px-4 pt-4 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor={promptId}
              className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase"
            >
              Your prompt
            </label>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                ≈ {tokenEstimate.toLocaleString()} tokens
              </span>
              <span aria-hidden className="h-3 w-px bg-border/60" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    className="gap-1.5 font-mono text-[10px] text-muted-foreground hover:bg-surface-2/60 hover:text-foreground"
                  >
                    <LayersIcon aria-hidden className="size-3" />
                    Use template
                    <ChevronDownIcon aria-hidden className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72!">
                  <DropdownMenuLabel className="font-mono text-[10px] tracking-[0.14em] uppercase">
                    Prompt templates
                  </DropdownMenuLabel>
                  {templates.map((template) => (
                    <DropdownMenuItem
                      key={template.id}
                      onSelect={() => setPrompt(template.prompt)}
                      className="flex-col items-start gap-0.5 py-1.5"
                    >
                      <span className="text-xs font-medium">
                        {template.title}
                      </span>
                      <span className="line-clamp-1 text-[11px] text-muted-foreground">
                        {template.description}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Textarea
            id={promptId}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={4}
            placeholder="Ask something you can judge by reading…"
            className="min-h-28 max-h-64 resize-y border-border/60 bg-background/40 text-[13px] leading-relaxed focus-visible:border-highlight/60"
          />
        </div>

        <div className="space-y-2 px-4 pt-4 sm:px-5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              Models
            </span>
            <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
              {selectedIds.length} selected · min 2
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {models.map((model) => {
              const selected = selectedIds.includes(model.id);
              const locked = selected && atMinimum;

              return (
                <button
                  key={model.id}
                  type="button"
                  aria-pressed={selected}
                  aria-disabled={locked || undefined}
                  title={
                    locked ? "Keep at least two models selected" : undefined
                  }
                  onClick={() => toggleModel(model.id)}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-lg border px-2.5 transition-colors duration-150 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
                    selected
                      ? "border-highlight/60 bg-highlight/10 text-foreground hover:bg-highlight/15"
                      : "border-border/60 bg-surface-2/20 text-muted-foreground hover:border-border hover:bg-surface-2/40 hover:text-foreground",
                    locked && "cursor-not-allowed",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 rounded-full",
                      providerDotClass[model.provider],
                    )}
                  />
                  <span className="font-mono text-[11px] font-medium">
                    {model.name}
                  </span>
                  <span
                    className={cn(
                      "flex size-3.5 items-center justify-center rounded-full border transition-colors",
                      selected
                        ? "border-highlight/70 bg-highlight text-on-highlight"
                        : "border-border/70",
                    )}
                  >
                    {selected && (
                      <CheckIcon
                        aria-hidden
                        className="size-2.5"
                        strokeWidth={3}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 grid gap-4 border-t border-border/50 px-4 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_8.5rem_auto] lg:items-end">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                Temperature
              </span>
              <span className="font-mono text-[11px] text-foreground tabular-nums">
                {temperature.toFixed(2)}
              </span>
            </div>
            <Slider
              aria-label="Temperature"
              value={[temperature]}
              min={0}
              max={2}
              step={0.05}
              onValueChange={(value) =>
                setTemperature(value[0] ?? temperature)
              }
              className="py-2"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor={maxTokensId}
              className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
            >
              Max tokens
            </label>
            <Input
              id={maxTokensId}
              inputMode="numeric"
              value={maxTokens}
              onChange={(event) =>
                setMaxTokens(event.target.value.replace(/[^0-9]/g, ""))
              }
              className="h-9 border-border/60 bg-background/40 font-mono text-xs tabular-nums"
            />
          </div>

          <div className="flex sm:justify-start lg:justify-end">
            <RunComparisonButton
              type="submit"
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </Card>
    </form>
  );
}

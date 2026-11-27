"use client";

import { useId, useState } from "react";
import { ChevronRightIcon, GaugeIcon } from "lucide-react";

import { RunJudgeButton } from "@/components/judge/run-judge-button";
import { ModelBadge } from "@/components/shared/model-badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { JudgeCriterion, JudgeCriterionId, Model } from "@/mocks/data";

export type JudgeConfigProps = {
  models: Model[];
  criteria: JudgeCriterion[];
  defaultJudgeModelId: string;
  defaultSystemPrompt: string;
  defaultActiveCriteria: JudgeCriterionId[];
  running?: boolean;
  onRun?: () => void;
};

export function JudgeConfig({
  models,
  criteria,
  defaultJudgeModelId,
  defaultSystemPrompt,
  defaultActiveCriteria,
  running = false,
  onRun,
}: JudgeConfigProps) {
  const [judgeModelId, setJudgeModelId] = useState(defaultJudgeModelId);
  const [activeCriteria, setActiveCriteria] = useState<JudgeCriterionId[]>(
    defaultActiveCriteria,
  );
  const [weights, setWeights] = useState<Record<JudgeCriterionId, number>>(
    () => ({
      accuracy: 0.4,
      clarity: 0.25,
      conciseness: 0.15,
      creativity: 0.1,
      safety: 0.1,
    }),
  );
  const [systemOpen, setSystemOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);

  const systemId = useId();
  const judgeModel = models.find((model) => model.id === judgeModelId);

  const activeWeight = activeCriteria.reduce(
    (total, id) => total + weights[id],
    0,
  );

  function toggleCriterion(id: JudgeCriterionId) {
    setActiveCriteria((current) => {
      if (current.includes(id)) {
        return current.length === 1
          ? current
          : current.filter((criterion) => criterion !== id);
      }
      return [...current, id];
    });
  }

  return (
    <Card className="gap-0 overflow-hidden border border-border/70 bg-surface/50 py-0 ring-0">
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/50 px-4 py-3.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-highlight/25 bg-highlight/10 text-foreground">
            <GaugeIcon aria-hidden className="size-4 text-highlight" />
          </span>
          <div className="min-w-0">
            <CardTitle className="truncate text-sm font-medium">
              Judge configuration
            </CardTitle>
            <p className="mt-0.5 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              {activeCriteria.length} of {criteria.length} criteria ·{" "}
              {Math.round(activeWeight * 100)}% weight
            </p>
          </div>
        </div>
        <span className="hidden items-center gap-1.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
          <span aria-hidden className="size-1.5 rounded-full bg-success" />
          ready
        </span>
      </CardHeader>

      <div className="grid gap-4 px-4 py-4 sm:px-5 md:grid-cols-[16rem_minmax(0,1fr)] md:items-start">
        <div className="space-y-2">
          <label
            htmlFor="judge-model"
            className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
          >
            Judge model
          </label>
          <Select value={judgeModelId} onValueChange={setJudgeModelId}>
            <SelectTrigger id="judge-model" className="w-full">
              <SelectValue placeholder="Pick a judge" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {judgeModel && (
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <ModelBadge
                provider={judgeModel.provider}
                name={judgeModel.name}
                className="border-border/50 bg-surface-2/30"
              />
              <span className="font-mono text-[10px] text-muted-foreground">
                reads {models.length} answers
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              Rubric
            </p>
            <div className="flex flex-wrap gap-1.5">
              {criteria.map((criterion) => {
                const active = activeCriteria.includes(criterion.id);

                return (
                  <button
                    key={criterion.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleCriterion(criterion.id)}
                    title={criterion.description}
                    className={cn(
                      "inline-flex h-8 items-center gap-2 rounded-lg border px-2.5 text-xs font-medium transition-colors duration-150 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
                      active
                        ? "border-highlight/60 bg-highlight/10 text-foreground hover:bg-highlight/15"
                        : "border-border/60 bg-surface-2/20 text-muted-foreground hover:border-border hover:bg-surface-2/40 hover:text-foreground",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "size-1.5 rounded-full",
                        active ? "bg-highlight" : "bg-border",
                      )}
                    />
                    {criterion.label}
                  </button>
                );
              })}
            </div>
          </div>

          {activeCriteria.length > 0 && (
            <div className="grid gap-3 rounded-lg border border-border/50 bg-surface-2/20 p-3 sm:grid-cols-2">
              {criteria
                .filter((criterion) =>
                  activeCriteria.includes(criterion.id),
                )
                .map((criterion) => (
                  <div key={criterion.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-foreground">
                        {criterion.label}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                        {Math.round(weights[criterion.id] * 100)}%
                      </span>
                    </div>
                    <Slider
                      aria-label={`${criterion.label} weight`}
                      value={[Math.round(weights[criterion.id] * 100)]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) =>
                        setWeights((current) => ({
                          ...current,
                          [criterion.id]: (value[0] ?? 0) / 100,
                        }))
                      }
                      className="py-1.5"
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border/50">
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
            Judge system prompt
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
              rows={3}
              placeholder="Tell the judge what to reward and what to penalise…"
              className="min-h-20 resize-y border-border/60 bg-background/40 font-mono text-xs leading-relaxed"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-border/50 bg-surface-2/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="font-mono text-[10px] text-muted-foreground">
          weights are normalised · output is strict JSON
        </p>
        <RunJudgeButton
          state={running ? "loading" : "idle"}
          onClick={onRun}
          className="w-full sm:w-auto"
        />
      </div>
    </Card>
  );
}

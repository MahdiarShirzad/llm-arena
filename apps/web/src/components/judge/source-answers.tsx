"use client";

import { useState } from "react";
import { ChevronRightIcon } from "lucide-react";

import { ModelBadge } from "@/components/shared/model-badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { JudgeSourceAnswer, Model } from "@/mocks/data";

export type SourceAnswersProps = {
  answers: JudgeSourceAnswer[];
  models: Model[];
  className?: string;
};

export function SourceAnswers({
  answers,
  models,
  className,
}: SourceAnswersProps) {
  const [included, setIncluded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(answers.map((answer) => [answer.modelId, answer.included])),
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const modelById = new Map(models.map((model) => [model.id, model]));
  const includedCount = answers.filter(
    (answer) => included[answer.modelId],
  ).length;

  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden border border-border/60 bg-surface/50 py-0 ring-0",
        className,
      )}
    >
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/50 px-4 py-3.5 sm:px-5">
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-medium">Source answers</CardTitle>
          <CardDescription className="font-mono text-[10px] tracking-[0.14em] uppercase">
            {includedCount} of {answers.length} included
          </CardDescription>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          run_01
        </span>
      </CardHeader>

      <ul className="divide-y divide-border/40">
        {answers.map((answer) => {
          const model = modelById.get(answer.modelId);
          if (!model) {
            return null;
          }
          const isIncluded = included[answer.modelId];
          const expanded = expandedId === answer.modelId;

          return (
            <li key={answer.modelId}>
              <div className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
                <Checkbox
                  id={`include-${answer.modelId}`}
                  checked={isIncluded}
                  onCheckedChange={(checked) =>
                    setIncluded((current) => ({
                      ...current,
                      [answer.modelId]: checked === true,
                    }))
                  }
                  aria-label={`Include ${model.name} in the judge run`}
                />
                <label
                  htmlFor={`include-${answer.modelId}`}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-2"
                >
                  <ModelBadge
                    provider={model.provider}
                    name={model.name}
                    showProvider={false}
                    className={cn(
                      "border-border/50 bg-surface-2/30",
                      !isIncluded && "opacity-60",
                    )}
                  />
                  <span className="truncate text-[11px] text-muted-foreground">
                    {answer.answer}
                  </span>
                </label>
                <span className="hidden shrink-0 font-mono text-[10px] text-muted-foreground tabular-nums sm:inline">
                  {answer.tokenCount} tok
                </span>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`answer-${answer.modelId}`}
                  aria-label={`${expanded ? "Collapse" : "Expand"} ${model.name} answer`}
                  onClick={() =>
                    setExpandedId(expanded ? null : answer.modelId)
                  }
                  className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-2/60 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                >
                  <ChevronRightIcon
                    aria-hidden
                    className={cn(
                      "size-3.5 transition-transform duration-200",
                      expanded && "rotate-90",
                    )}
                  />
                </button>
              </div>
              {expanded && (
                <div
                  id={`answer-${answer.modelId}`}
                  className="px-4 pb-3 pl-11 sm:px-5 sm:pl-12"
                >
                  <p className="rounded-lg border border-border/50 bg-background/40 px-3 py-2 text-[12px] leading-relaxed text-foreground/85">
                    {answer.answer}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

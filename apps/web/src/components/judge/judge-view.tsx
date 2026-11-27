"use client";

import { useEffect, useState } from "react";
import { TrophyIcon } from "lucide-react";

import { CriteriaRadar } from "@/components/judge/criteria-radar";
import { JudgeCard } from "@/components/judge/judge-card";
import { JudgeConfig } from "@/components/judge/judge-config";
import { JudgeStatesPreview } from "@/components/judge/judge-states";
import { Leaderboard } from "@/components/judge/leaderboard";
import { RawJsonPanel } from "@/components/judge/raw-json-panel";
import { JudgeResultsSkeleton } from "@/components/judge/results-skeleton";
import { SourceAnswers } from "@/components/judge/source-answers";
import {
  judgeCriteria,
  judgeSourceAnswers,
  judgeVerdict,
  models,
} from "@/mocks/data";

const defaultSystemPrompt =
  "You are a strict evaluator for a model arena. Score each answer independently against the rubric, penalise confident errors harder than missing detail, and return JSON only.";

export function JudgeView() {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) {
      return;
    }
    const timer = window.setTimeout(() => setRunning(false), 1600);
    return () => window.clearTimeout(timer);
  }, [running]);

  const judgeModel = models.find(
    (model) => model.id === judgeVerdict.judgeModelId,
  );
  const winner = models.find(
    (model) => model.id === judgeVerdict.winnerModelId,
  );
  const ranked = [...judgeVerdict.scores].sort((a, b) => b.total - a.total);

  return (
    <div className="flex flex-col gap-6">
      <JudgeConfig
        models={models}
        criteria={judgeCriteria}
        defaultJudgeModelId={judgeVerdict.judgeModelId}
        defaultSystemPrompt={defaultSystemPrompt}
        defaultActiveCriteria={["accuracy", "clarity", "conciseness"]}
        running={running}
        onRun={() => setRunning(true)}
      />

      <SourceAnswers answers={judgeSourceAnswers} models={models} />

      <section className="flex flex-col gap-3" aria-busy={running || undefined}>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-foreground">Verdict</h2>
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              {judgeVerdict.id} ·{" "}
              <span className="tracking-normal text-foreground/70 normal-case">
                {judgeModel?.name ?? judgeVerdict.judgeModelId}
              </span>{" "}
              judged · {Math.round(judgeVerdict.confidence * 100)}% confidence
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-highlight/30 bg-highlight/10 px-2 py-1 font-mono text-[10px] text-foreground">
            <TrophyIcon aria-hidden className="size-3 text-highlight" />
            {winner?.name ?? "no winner"} wins
          </span>
        </div>

        {running ? (
          <JudgeResultsSkeleton />
        ) : (
          <>
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
              <CriteriaRadar
                scores={judgeVerdict.scores}
                models={models}
                criteria={judgeCriteria}
              />
              <Leaderboard
                scores={judgeVerdict.scores}
                models={models}
                winnerModelId={judgeVerdict.winnerModelId}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {ranked.map((score, index) => {
                const model = models.find(
                  (entry) => entry.id === score.modelId,
                );
                if (!model) {
                  return null;
                }

                return (
                  <JudgeCard
                    key={score.modelId}
                    score={score}
                    model={model}
                    rank={index + 1}
                    isWinner={score.modelId === judgeVerdict.winnerModelId}
                  />
                );
              })}
            </div>

            <RawJsonPanel rawJson={judgeVerdict.rawJson} />
          </>
        )}
      </section>

      <JudgeStatesPreview />
    </div>
  );
}

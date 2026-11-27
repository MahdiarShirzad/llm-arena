import { ThumbsDownIcon, ThumbsUpIcon, TrophyIcon } from "lucide-react";

import { ModelBadge } from "@/components/shared/model-badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { JudgeScore, Model } from "@/mocks/data";

function ScoreRing({ value, label }: { value: number; label: string }) {
  const percent = Math.max(0, Math.min(100, (value / 10) * 100));

  return (
    <div className="flex shrink-0 items-center gap-3">
      <div className="relative size-16">
        <svg
          viewBox="0 0 36 36"
          className="size-16 -rotate-90"
          aria-hidden
          focusable="false"
        >
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="var(--border)"
            strokeWidth="2.5"
          />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="var(--highlight)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${percent} 100`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-medium text-foreground tabular-nums">
          {value.toFixed(1)}
        </span>
      </div>
      <div className="space-y-0.5">
        <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          {label}
        </p>
        <p className="font-mono text-[11px] text-foreground/80 tabular-nums">
          / 10 weighted
        </p>
      </div>
    </div>
  );
}

function ScoreList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "positive" | "negative";
}) {
  const Icon = tone === "positive" ? ThumbsUpIcon : ThumbsDownIcon;

  return (
    <div className="space-y-1.5">
      <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
        {title}
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-1.5 text-[12px] leading-relaxed">
            <Icon
              aria-hidden
              className={cn(
                "mt-0.5 size-3 shrink-0",
                tone === "positive" ? "text-success" : "text-error",
              )}
            />
            <span className="text-foreground/85">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type JudgeCardProps = {
  score: JudgeScore;
  model: Model;
  rank: number;
  isWinner?: boolean;
  className?: string;
};

export function JudgeCard({
  score,
  model,
  rank,
  isWinner = false,
  className,
}: JudgeCardProps) {
  return (
    <Card
      className={cn(
        "relative gap-4 border border-border/60 bg-surface/50 py-4 ring-0 transition-shadow duration-200 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/30",
        isWinner && "border-highlight/50 ring-1 ring-highlight/25",
        className,
      )}
    >
      <CardHeader className="gap-2 px-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
              #{rank}
            </span>
            <ModelBadge
              provider={model.provider}
              name={model.name}
              showProvider={false}
              className="border-border/50 bg-surface-2/30"
            />
          </div>
          {isWinner && (
            <span className="inline-flex h-5 items-center gap-1 rounded-full bg-highlight px-2 font-mono text-[9px] font-medium tracking-[0.12em] text-on-highlight uppercase">
              <TrophyIcon aria-hidden className="size-2.5" />
              Winner
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ScoreRing value={score.total} label="Judge score" />
          <div className="flex flex-wrap gap-1">
            {Object.entries(score.criteria).map(([criterion, value]) => (
              <span
                key={criterion}
                className="inline-flex h-6 items-center gap-1.5 rounded-md border border-border/60 bg-surface-2/30 px-2 font-mono text-[10px] text-muted-foreground"
              >
                <span className="capitalize">{criterion}</span>
                <span className="text-foreground tabular-nums">
                  {value.toFixed(1)}
                </span>
              </span>
            ))}
          </div>
        </div>
        <CardTitle className="sr-only">{model.name} judge result</CardTitle>
        <CardDescription className="sr-only">
          Rank {rank}, score {score.total.toFixed(2)} out of 10
        </CardDescription>
      </CardHeader>

      <div className="grid gap-4 px-4 sm:grid-cols-2">
        <ScoreList title="Strengths" items={score.strengths} tone="positive" />
        <ScoreList
          title="Weaknesses"
          items={score.weaknesses}
          tone="negative"
        />
      </div>

      <p className="border-t border-border/40 px-4 pt-3 text-[13px] leading-relaxed text-foreground/85">
        {score.reasoning}
      </p>
    </Card>
  );
}

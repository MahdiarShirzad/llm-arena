"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import {
  ModelBadge,
  providerColorVar,
} from "@/components/shared/model-badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { JudgeCriterion, JudgeScore, Model } from "@/mocks/data";

export type CriteriaRadarProps = {
  scores: JudgeScore[];
  models: Model[];
  criteria: JudgeCriterion[];
  className?: string;
};

export function CriteriaRadar({
  scores,
  models,
  criteria,
  className,
}: CriteriaRadarProps) {
  const scored = scores
    .map((score) => ({ score, model: models.find((m) => m.id === score.modelId) }))
    .filter((entry): entry is { score: JudgeScore; model: Model } =>
      Boolean(entry.model),
    );

  const data = criteria.map((criterion) => {
    const row: Record<string, string | number> = { criterion: criterion.label };
    scored.forEach(({ score }, index) => {
      row[`m${index}`] = score.criteria[criterion.id];
    });
    return row;
  });

  return (
    <Card
      className={cn(
        "gap-3 border border-border/60 bg-surface/50 py-4 ring-0",
        className,
      )}
    >
      <CardHeader className="gap-1 px-4">
        <CardTitle className="text-sm font-medium">Criteria comparison</CardTitle>
        <CardDescription className="font-mono text-[10px] tracking-[0.14em] uppercase">
          Scores per rubric criterion · 0–10
        </CardDescription>
      </CardHeader>

      <div className="h-64 w-full px-2 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="var(--border)" strokeOpacity={0.7} />
            <PolarAngleAxis
              dataKey="criterion"
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              tickLine={false}
            />
            {scored.map(({ model, score }, index) => (
              <Radar
                key={score.modelId}
                name={model.name}
                dataKey={`m${index}`}
                stroke={providerColorVar[model.provider]}
                fill={providerColorVar[model.provider]}
                fillOpacity={0.1}
                strokeWidth={1.75}
                isAnimationActive={false}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <ul className="flex flex-wrap gap-1.5 border-t border-border/40 px-4 pt-3">
        {scored.map(({ model }) => (
          <li key={model.id}>
            <ModelBadge
              provider={model.provider}
              name={model.name}
              showProvider={false}
              className="border-border/50 bg-surface-2/30"
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}

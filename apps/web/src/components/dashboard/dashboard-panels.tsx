import Link from "next/link";
import { ArrowUpRightIcon, GaugeIcon, TrophyIcon } from "lucide-react";

import { ModelBadge } from "@/components/shared/model-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  dashboardInsight,
  historyRuns,
  modelUsage,
  models,
  type HistoryRun,
} from "@/mocks/data";

const modeTone: Record<HistoryRun["mode"], string> = {
  Compare: "border-border/70 bg-surface-2/40 text-muted-foreground",
  Judge: "border-highlight/40 bg-highlight/10 text-foreground",
  Brochure: "border-steel/40 bg-steel/10 text-foreground",
};

export function RecentRuns() {
  const recent = historyRuns.slice(0, 5);

  return (
    <Card className="gap-0 overflow-hidden border border-border/60 bg-surface/40 py-0 ring-0">
      <div className="flex items-center justify-between gap-2 border-b border-border/50 px-4 py-3">
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-medium">Recent runs</CardTitle>
          <CardDescription className="font-mono text-[10px] tracking-[0.14em] uppercase">
            last {recent.length} of {historyRuns.length}
          </CardDescription>
        </div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <Link href="/history">
            View all
            <ArrowUpRightIcon aria-hidden />
          </Link>
        </Button>
      </div>

      <ul className="divide-y divide-border/40">
        {recent.map((run) => (
          <li key={run.id}>
            <Link
              href={`/history/${run.id}`}
              className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-surface-2/30 focus-visible:bg-surface-2/30 focus-visible:outline-none"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">
                  {run.title}
                </p>
                <p className="truncate font-mono text-[10px] text-muted-foreground">
                  {run.relativeDate} · {(run.tokensIn + run.tokensOut).toLocaleString()} tok
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-[0.1em] uppercase",
                  modeTone[run.mode],
                )}
              >
                {run.mode}
              </span>
              <span className="shrink-0 font-mono text-[11px] text-foreground/80 tabular-nums">
                ${run.costUsd.toFixed(4)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function InsightCard() {
  const cheapest = models.find(
    (model) => model.id === dashboardInsight.cheapestModelId,
  );
  const fastest = models.find(
    (model) => model.id === dashboardInsight.fastestModelId,
  );
  const cheapestUsage = modelUsage.find(
    (usage) => usage.modelId === dashboardInsight.cheapestModelId,
  );
  const fastestUsage = modelUsage.find(
    (usage) => usage.modelId === dashboardInsight.fastestModelId,
  );

  return (
    <Card className="gap-3 border border-highlight/30 bg-highlight/5 p-4 py-4 ring-0">
      <CardHeader className="gap-1 p-0">
        <CardTitle className="flex items-center gap-1.5 text-sm font-medium">
          <TrophyIcon aria-hidden className="size-3.5 text-highlight" />
          {dashboardInsight.title}
        </CardTitle>
        <CardDescription className="text-[11px]">
          Picked from this range&apos;s per-model totals
        </CardDescription>
      </CardHeader>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1.5 rounded-lg border border-border/50 bg-surface/60 p-2.5">
          <p className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
            Cheapest
          </p>
          {cheapest && (
            <ModelBadge
              provider={cheapest.provider}
              name={cheapest.name}
              showProvider={false}
              className="border-border/50 bg-surface-2/30"
            />
          )}
          <p className="font-mono text-[10px] text-muted-foreground tabular-nums">
            ${(cheapestUsage?.costUsd ?? 0).toFixed(2)} ·{" "}
            {cheapestUsage?.runs ?? 0} runs
          </p>
        </div>
        <div className="space-y-1.5 rounded-lg border border-border/50 bg-surface/60 p-2.5">
          <p className="flex items-center gap-1 font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
            <GaugeIcon aria-hidden className="size-3" />
            Fastest
          </p>
          {fastest && (
            <ModelBadge
              provider={fastest.provider}
              name={fastest.name}
              showProvider={false}
              className="border-border/50 bg-surface-2/30"
            />
          )}
          <p className="font-mono text-[10px] text-muted-foreground tabular-nums">
            {((fastestUsage?.avgLatencyMs ?? 0) / 1000).toFixed(2)}s avg ·{" "}
            {fastestUsage?.runs ?? 0} runs
          </p>
        </div>
      </div>

      <p className="text-[12px] leading-relaxed text-foreground/80">
        {dashboardInsight.body}
      </p>
    </Card>
  );
}

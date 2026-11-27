import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRightIcon,
  PlayIcon,
  ScrollTextIcon,
  Trash2Icon,
} from "lucide-react";

import { JudgeCard } from "@/components/judge/judge-card";
import { CodeBlock } from "@/components/shared/code-block";
import { ResultCard } from "@/components/shared/result-card";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  historyRunDetail,
  historyRuns,
  judgeVerdict,
  models,
} from "@/mocks/data";

// This route reads its id from the URL before rendering, so it opts out of
// the instant-shell requirement rather than streaming a placeholder.
export const instant = false;

export function generateStaticParams() {
  return historyRuns.map((run) => ({ id: run.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const run = historyRuns.find((entry) => entry.id === id);

  return { title: run ? run.title : "Run not found" };
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(iso));
}

function formatCost(usd: number) {
  return usd === 0 ? "$0" : `$${usd.toFixed(4)}`;
}

export default async function HistoryRunPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const run = historyRuns.find((entry) => entry.id === id);

  if (!run) {
    notFound();
  }

  const detail = historyRunDetail;
  const responses = detail.responses;
  const modelById = new Map(models.map((model) => [model.id, model]));

  const totals = responses.reduce(
    (sum, response) => ({
      tokensIn: sum.tokensIn + response.metrics.tokensIn,
      tokensOut: sum.tokensOut + response.metrics.tokensOut,
      costUsd: sum.costUsd + response.metrics.costUsd,
      latencyMs: sum.latencyMs + response.metrics.latencyMs,
    }),
    { tokensIn: 0, tokensOut: 0, costUsd: 0, latencyMs: 0 },
  );

  const winner = modelById.get(detail.winnerModelId);
  const winningScore = judgeVerdict.scores.find(
    (score) => score.modelId === detail.winnerModelId,
  );

  return (
    <div className="flex flex-col gap-5">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
          <li>
            <Link
              href="/history"
              className="rounded-sm transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              History
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRightIcon className="size-3" />
          </li>
          <li>
            <span className="text-foreground/80">{run.id}</span>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
            {run.title}
          </h1>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            <span>{formatDate(detail.createdAt)}</span>
            <span aria-hidden>·</span>
            <span className="rounded-full border border-border/70 bg-surface-2/40 px-2 py-0.5">
              {run.mode}
            </span>
            <span aria-hidden>·</span>
            <span>{run.id}</span>
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            asChild
            className="gap-1.5 bg-highlight font-medium text-on-highlight hover:bg-highlight/90 focus-visible:border-highlight focus-visible:ring-highlight/40"
          >
            <Link href="/">
              <PlayIcon aria-hidden />
              Re-run in Arena
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            aria-label={`Delete ${run.title}`}
            className="gap-1.5 border-border/70 bg-surface/60 text-muted-foreground hover:border-error/40 hover:bg-error/10 hover:text-error"
          >
            <Trash2Icon aria-hidden />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>

      <Card className="gap-0 border border-border/60 bg-surface/50 py-0 ring-0">
        <CardHeader className="border-b border-border/50 px-4 py-3">
          <CardTitle className="text-sm font-medium">Prompt</CardTitle>
          <CardDescription className="font-mono text-[10px] tracking-[0.14em] uppercase">
            system + user · {run.modelIds.length} models
          </CardDescription>
        </CardHeader>
        <div className="space-y-3 p-4">
          <CodeBlock
            code={detail.systemPrompt}
            filename="system.txt"
            className="bg-background/40"
          />
          <CodeBlock
            code={detail.prompt}
            filename="user.txt"
            className="bg-background/40"
          />
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total tokens"
          value={(totals.tokensIn + totals.tokensOut).toLocaleString()}
          hint={`${totals.tokensIn.toLocaleString()} in · ${totals.tokensOut.toLocaleString()} out`}
        />
        <StatCard
          label="Total cost"
          value={formatCost(totals.costUsd)}
          hint="across every model"
        />
        <StatCard
          label="Avg latency"
          value={`${(totals.latencyMs / responses.length / 1000).toFixed(2)}s`}
          hint={`${responses.length} responses`}
        />
        <StatCard
          label="Winner"
          value={winner?.name ?? "—"}
          hint="judge pick"
        />
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-foreground">Responses</h2>
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              side by side · {responses.length} models
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <ScrollTextIcon aria-hidden className="size-3.5" />
            recorded answer
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {responses.map((response) => {
            const model = modelById.get(response.modelId);
            if (!model) {
              return null;
            }

            return (
              <ResultCard
                key={response.modelId}
                response={response}
                model={model}
                isWinner={response.modelId === detail.winnerModelId}
              />
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="space-y-1">
          <h2 className="text-sm font-medium text-foreground">Judge result</h2>
          <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            {judgeVerdict.id} · {Math.round(judgeVerdict.confidence * 100)}%
            confidence
          </p>
        </div>

        {winningScore && winner ? (
          <div className="grid gap-4 md:grid-cols-2">
            <JudgeCard
              score={winningScore}
              model={winner}
              rank={1}
              isWinner
            />
            <Card className="gap-2 border border-border/60 bg-surface/40 p-4 py-4 ring-0">
              <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                Why this one won
              </p>
              <p className="text-[13px] leading-relaxed text-foreground/85">
                {judgeVerdict.scores.find(
                  (score) => score.modelId === judgeVerdict.winnerModelId,
                )?.reasoning ?? "The judge scored this answer highest on the rubric."}
              </p>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-auto w-fit gap-1.5 border-border/70"
              >
                <Link href="/judge">Open full verdict</Link>
              </Button>
            </Card>
          </div>
        ) : (
          <Card className="border border-border/60 bg-surface/40 p-4 py-4 text-sm text-muted-foreground ring-0">
            No judge verdict was recorded for this run.
          </Card>
        )}
      </section>
    </div>
  );
}

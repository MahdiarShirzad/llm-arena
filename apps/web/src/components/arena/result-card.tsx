"use client";

import { useState } from "react";
import {
  CheckIcon,
  CircleAlertIcon,
  ClockIcon,
  CoinsIcon,
  CopyIcon,
  GaugeIcon,
  HashIcon,
  Maximize2Icon,
  RotateCcwIcon,
  ThumbsUpIcon,
  TrophyIcon,
} from "lucide-react";

import { StatusPill } from "@/components/arena/status-pill";
import { CodeBlock } from "@/components/shared/code-block";
import { MetricPill } from "@/components/shared/metric-pill";
import { ModelBadge } from "@/components/shared/model-badge";
import { StreamingCursor } from "@/components/shared/streaming-cursor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Model, ModelMetrics, ModelResponse } from "@/mocks/data";

function formatLatency(ms: number) {
  return ms >= 10_000 ? `${(ms / 1000).toFixed(1)}s` : `${(ms / 1000).toFixed(2)}s`;
}

function formatCost(usd: number) {
  if (usd === 0) {
    return "$0";
  }
  return usd < 0.01 ? `$${usd.toFixed(5)}` : `$${usd.toFixed(3)}`;
}

function WinnerBadge() {
  return (
    <span className="inline-flex h-6 items-center gap-1 rounded-full bg-highlight px-2 font-mono text-[10px] font-medium tracking-[0.12em] text-on-highlight uppercase">
      <TrophyIcon aria-hidden className="size-3" />
      Winner
    </span>
  );
}

function MetricsRow({ metrics }: { metrics: ModelMetrics }) {
  return (
    <>
      <MetricPill
        icon={ClockIcon}
        value={formatLatency(metrics.latencyMs)}
        label="latency"
      />
      <MetricPill
        icon={HashIcon}
        value={`${metrics.tokensIn} in / ${metrics.tokensOut} out`}
        label="tokens"
      />
      <MetricPill
        icon={CoinsIcon}
        value={formatCost(metrics.costUsd)}
        label="cost"
      />
      <MetricPill
        icon={GaugeIcon}
        value={metrics.tokensPerSecond.toFixed(1)}
        label="tok/s"
      />
    </>
  );
}

function ResponseBody({ response }: { response: ModelResponse }) {
  if (response.status === "error") {
    return (
      <div className="flex flex-col items-start gap-3 rounded-lg border border-error/25 bg-error/5 p-3">
        <div className="flex items-start gap-2">
          <CircleAlertIcon
            aria-hidden
            className="mt-0.5 size-4 shrink-0 text-error"
          />
          <p className="text-[13px] leading-relaxed text-foreground">
            {response.error ?? "The request failed before any content arrived."}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 border-error/30 bg-surface/50 font-mono text-[11px] hover:bg-error/10"
        >
          <RotateCcwIcon aria-hidden className="size-3.5" />
          Retry
        </Button>
      </div>
    );
  }

  const paragraphs = response.response
    .split("\n\n")
    .filter((paragraph) => paragraph.trim().length > 0);

  return (
    <div className="space-y-3">
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="text-[13px] leading-relaxed text-foreground/85"
        >
          {paragraph}
          {response.status === "streaming" &&
            index === paragraphs.length - 1 && <StreamingCursor />}
        </p>
      ))}
      {response.code && (
        <CodeBlock
          code={response.code.code}
          language={response.code.language}
          filename={response.code.filename}
          className="mt-4 bg-background/40"
        />
      )}
    </div>
  );
}

export type ResultCardProps = {
  response: ModelResponse;
  model: Model;
  isWinner?: boolean;
  className?: string;
};

export function ResultCard({
  response,
  model,
  isWinner = false,
  className,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [voted, setVoted] = useState(false);

  function copyResponse() {
    const text =
      response.status === "error" ? (response.error ?? "") : response.response;
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <Card
      className={cn(
        "relative flex h-full flex-col gap-0 overflow-hidden border border-border/60 bg-surface/60 py-0 ring-0 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/40",
        isWinner &&
          "border-highlight/50 ring-1 ring-highlight/30 hover:border-highlight/70",
        className,
      )}
    >
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border/50 px-4 py-3">
        <CardTitle className="sr-only">{model.name} response</CardTitle>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <ModelBadge
            provider={model.provider}
            name={model.name}
            showProvider={false}
            className="border-border/50 bg-surface-2/30"
          />
          <StatusPill status={response.status} />
        </div>

        <div className="flex items-center gap-1">
          {isWinner && <WinnerBadge />}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={
                  copied ? "Copied" : `Copy ${model.name} response`
                }
                onClick={copyResponse}
                className="text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
                {copied ? (
                  <CheckIcon aria-hidden className="text-success" />
                ) : (
                  <CopyIcon aria-hidden />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {copied ? "Copied" : "Copy"}
            </TooltipContent>
          </Tooltip>

          <Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Expand ${model.name} response`}
                    className="text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                  >
                    <Maximize2Icon aria-hidden />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Expand</TooltipContent>
            </Tooltip>
            <DialogContent className="flex max-h-[85dvh] w-full max-w-3xl flex-col gap-0 overflow-hidden p-0">
              <DialogHeader className="border-b border-border/60 px-4 py-3 pr-12">
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle className="font-mono text-sm">
                    {model.name}
                  </DialogTitle>
                  <StatusPill status={response.status} />
                  {isWinner && <WinnerBadge />}
                </div>
                <DialogDescription className="sr-only">
                  Full response from {model.name}
                </DialogDescription>
              </DialogHeader>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                <ResponseBody response={response} />
              </div>
              <div className="flex flex-wrap items-center gap-1.5 border-t border-border/60 bg-surface-2/20 px-4 py-3">
                <MetricsRow metrics={response.metrics} />
              </div>
            </DialogContent>
          </Dialog>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`Mark ${model.name} response as helpful`}
                aria-pressed={voted}
                onClick={() => setVoted((value) => !value)}
                className={cn(
                  "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                  voted && "text-highlight hover:text-highlight",
                )}
              >
                <ThumbsUpIcon
                  aria-hidden
                  className={cn(voted && "fill-current")}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Helpful</TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>

      <div className="max-h-[19rem] min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <ResponseBody response={response} />
      </div>

      <CardFooter className="flex flex-wrap items-center gap-1.5 border-border/50 bg-surface-2/20 px-4 py-3">
        <MetricsRow metrics={response.metrics} />
      </CardFooter>
    </Card>
  );
}

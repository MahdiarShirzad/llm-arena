"use client";

import { useRef, useState, type UIEvent } from "react";
import { TrophyIcon } from "lucide-react";

import { ResultCard } from "@/components/arena/result-card";
import { cn } from "@/lib/utils";
import type { Model, ModelResponse } from "@/mocks/data";

export type ResultsGridProps = {
  responses: ModelResponse[];
  models: Model[];
  winnerModelId?: string;
};

const statusDot: Record<ModelResponse["status"], string> = {
  streaming: "bg-steel",
  done: "bg-success",
  error: "bg-error",
};

export function ResultsGrid({
  responses,
  models,
  winnerModelId,
}: ResultsGridProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const modelById = new Map(models.map((model) => [model.id, model]));

  const columns =
    responses.length >= 4
      ? "xl:grid-cols-4"
      : responses.length === 3
        ? "xl:grid-cols-3"
        : "xl:grid-cols-2";

  function scrollToCard(index: number) {
    const scroller = scrollerRef.current;
    const card = scroller?.children[index];
    setActiveIndex(index);
    if (card instanceof HTMLElement) {
      card.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const scroller = event.currentTarget;
    if (!scroller.clientWidth) {
      return;
    }
    const next = Math.round(scroller.scrollLeft / scroller.clientWidth);
    setActiveIndex(Math.min(Math.max(next, 0), responses.length - 1));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 md:hidden">
        <div
          role="tablist"
          aria-label="Model results"
          className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-1"
        >
          {responses.map((response, index) => {
            const model = modelById.get(response.modelId);
            const active = index === activeIndex;

            return (
              <button
                key={response.modelId}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => scrollToCard(index)}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-2.5 font-mono text-[11px] transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
                  active
                    ? "border-highlight/60 bg-highlight/10 text-foreground"
                    : "border-border/60 bg-surface-2/30 text-muted-foreground",
                )}
              >
                <span
                  aria-hidden
                  className={cn("size-1.5 rounded-full", statusDot[response.status])}
                />
                {model?.name ?? response.modelId}
                {response.modelId === winnerModelId && (
                  <TrophyIcon aria-hidden className="size-3 text-highlight" />
                )}
              </button>
            );
          })}
        </div>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          {activeIndex + 1}/{responses.length}
        </span>
      </div>

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className={cn(
          "-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:snap-none md:gap-4 md:overflow-visible md:px-0 md:pb-0",
          "md:grid-cols-2",
          columns,
        )}
      >
        {responses.map((response) => {
          const model = modelById.get(response.modelId);
          if (!model) {
            return null;
          }

          return (
            <div
              key={response.modelId}
              className="w-full shrink-0 snap-center md:w-auto"
            >
              <ResultCard
                response={response}
                model={model}
                isWinner={response.modelId === winnerModelId}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

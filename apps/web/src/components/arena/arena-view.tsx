import { TrophyIcon } from "lucide-react";

import { ArenaComposer } from "@/components/arena/arena-composer";
import { ArenaStatesPreview } from "@/components/arena/arena-states-preview";
import { ArenaSummary } from "@/components/arena/arena-summary";
import { ResultsGrid } from "@/components/arena/results-grid";
import { arenaDemo, arenaSummary, models, promptTemplates } from "@/mocks/data";

export function ArenaView() {
  const winner = models.find((model) => model.id === arenaDemo.winnerModelId);

  return (
    <div className="flex flex-col gap-6">
      <ArenaComposer
        models={models}
        templates={promptTemplates}
        defaultPrompt={arenaDemo.prompt}
        defaultSystemPrompt={arenaDemo.systemPrompt}
        defaultModelIds={arenaDemo.selectedModelIds}
      />

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-foreground">Results</h2>
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              {arenaDemo.id} · {arenaDemo.responses.length} models ·{" "}
              <span className="tracking-normal text-foreground/70 normal-case">
                {winner?.name ?? "no winner"}
              </span>{" "}
              leads
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-highlight/30 bg-highlight/10 px-2 py-1 font-mono text-[10px] text-foreground">
            <TrophyIcon aria-hidden className="size-3 text-highlight" />
            judge pick
          </span>
        </div>

        <ArenaSummary items={arenaSummary} />
        <ResultsGrid
          responses={arenaDemo.responses}
          models={models}
          winnerModelId={arenaDemo.winnerModelId}
        />
      </section>

      <ArenaStatesPreview />
    </div>
  );
}

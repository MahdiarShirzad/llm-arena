import { TrophyIcon } from "lucide-react";

import { ModelBadge, providerDotClass } from "@/components/shared/model-badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { JudgeScore, Model } from "@/mocks/data";

export type LeaderboardProps = {
  scores: JudgeScore[];
  models: Model[];
  winnerModelId: string;
  className?: string;
};

export function Leaderboard({
  scores,
  models,
  winnerModelId,
  className,
}: LeaderboardProps) {
  const modelById = new Map(models.map((model) => [model.id, model]));
  const ranked = [...scores].sort((a, b) => b.total - a.total);
  const max = ranked[0]?.total ?? 10;

  return (
    <Card
      className={cn(
        "gap-0 border border-border/60 bg-surface/50 py-0 ring-0",
        className,
      )}
    >
      <CardHeader className="border-b border-border/50 px-4 py-3.5 sm:px-5">
        <CardTitle className="text-sm font-medium">Leaderboard</CardTitle>
        <CardDescription className="font-mono text-[10px] tracking-[0.14em] uppercase">
          {ranked.length} answers · weighted total / 10
        </CardDescription>
      </CardHeader>

      <div className="px-2 py-1 sm:px-3">
        <Table>
          <TableHeader>
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="w-9 pl-2 font-mono text-[10px] tracking-[0.14em] uppercase">
                #
              </TableHead>
              <TableHead className="font-mono text-[10px] tracking-[0.14em] uppercase">
                Model
              </TableHead>
              <TableHead className="hidden font-mono text-[10px] tracking-[0.14em] uppercase sm:table-cell">
                Score
              </TableHead>
              <TableHead className="pr-2 text-right font-mono text-[10px] tracking-[0.14em] uppercase">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranked.map((score, index) => {
              const model = modelById.get(score.modelId);
              if (!model) {
                return null;
              }
              const rank = index + 1;
              const isWinner = score.modelId === winnerModelId;

              return (
                <TableRow
                  key={score.modelId}
                  className={cn(
                    "border-border/30 transition-colors",
                    isWinner &&
                      "bg-highlight/10 hover:bg-highlight/15 ring-1 ring-highlight/30",
                  )}
                >
                  <TableCell className="pl-2">
                    <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground tabular-nums">
                      {rank === 1 ? (
                        <TrophyIcon
                          aria-hidden
                          className="size-3.5 text-highlight"
                        />
                      ) : (
                        rank
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                      <ModelBadge
                        provider={model.provider}
                        name={model.name}
                        showProvider={false}
                        className="border-border/50 bg-surface-2/30"
                      />
                      {isWinner && (
                        <span className="rounded-full bg-highlight px-1.5 font-mono text-[9px] font-medium tracking-[0.1em] text-on-highlight uppercase">
                          Winner
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div
                      className="h-2 w-full max-w-56 overflow-hidden rounded-full bg-surface-2/60"
                      role="img"
                      aria-label={`${model.name} scored ${score.total.toFixed(2)} out of 10`}
                    >
                      <div
                        className={cn(
                          "h-full rounded-full",
                          providerDotClass[model.provider],
                        )}
                        style={{ width: `${(score.total / max) * 100}%` }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="pr-2 text-right">
                    <span className="font-mono text-xs font-medium text-foreground tabular-nums">
                      {score.total.toFixed(2)}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

import Link from "next/link";
import { ChevronRightIcon, TrophyIcon } from "lucide-react";

import { ModelBadge, providerDotClass } from "@/components/shared/model-badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { HistoryRun, Model } from "@/mocks/data";

function ModelDots({ run, models }: { run: HistoryRun; models: Model[] }) {
  const runModels = run.modelIds
    .map((id) => models.find((model) => model.id === id))
    .filter((model): model is Model => Boolean(model));

  return (
    <span
      className="flex -space-x-1"
      title={runModels.map((model) => model.name).join(", ")}
    >
      {runModels.map((model) => (
        <span
          key={model.id}
          className={cn(
            "size-2.5 rounded-full ring-2 ring-surface",
            providerDotClass[model.provider],
          )}
        />
      ))}
      <span className="sr-only">{run.modelIds.length} models</span>
    </span>
  );
}

function WinnerCell({ run, models }: { run: HistoryRun; models: Model[] }) {
  const winner = models.find((model) => model.id === run.winnerModelId);

  if (!winner) {
    return <span className="font-mono text-[11px] text-muted-foreground">—</span>;
  }

  return (
    <span className="inline-flex items-center gap-1">
      <TrophyIcon aria-hidden className="size-3 text-highlight" />
      <ModelBadge
        provider={winner.provider}
        name={winner.name}
        showProvider={false}
        className="border-highlight/40 bg-highlight/10"
      />
    </span>
  );
}

function ModeBadge({ mode }: { mode: HistoryRun["mode"] }) {
  return (
    <span className="inline-flex h-5 items-center rounded-full border border-border/70 bg-surface-2/40 px-2 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
      {mode}
    </span>
  );
}

function formatCost(usd: number) {
  return usd === 0 ? "$0" : `$${usd.toFixed(4)}`;
}

export type HistoryListProps = {
  runs: HistoryRun[];
  models: Model[];
  selected: string[];
  onToggle: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
};

export function HistoryList({
  runs,
  models,
  selected,
  onToggle,
  onToggleAll,
}: HistoryListProps) {
  const allSelected = runs.length > 0 && runs.every((run) => selected.includes(run.id));

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border/60 bg-surface/40 lg:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-9 pl-4">
                  <Checkbox
                    aria-label="Select all runs on this page"
                    checked={allSelected}
                    onCheckedChange={(checked) => onToggleAll(checked === true)}
                  />
                </TableHead>
                {["Prompt", "Mode", "Models", "Winner", "Tokens", "Cost", "When", ""].map(
                  (heading, index) => (
                    <TableHead
                      key={heading || index}
                      className="font-mono text-[10px] tracking-[0.12em] whitespace-nowrap uppercase"
                    >
                      {heading}
                    </TableHead>
                  ),
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((run) => {
                const checked = selected.includes(run.id);

                return (
                  <TableRow
                    key={run.id}
                    data-state={checked ? "selected" : undefined}
                    className="group border-border/30 transition-colors data-[state=selected]:bg-highlight/5"
                  >
                    <TableCell className="pl-4">
                      <Checkbox
                        aria-label={`Select ${run.title}`}
                        checked={checked}
                        onCheckedChange={() => onToggle(run.id)}
                      />
                    </TableCell>
                    <TableCell className="max-w-[22rem]">
                      <Link
                        href={`/history/${run.id}`}
                        className="block min-w-0 rounded-sm focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                      >
                        <span className="block truncate text-xs font-medium text-foreground">
                          {run.title}
                        </span>
                        <span className="block truncate font-mono text-[10px] text-muted-foreground">
                          {run.prompt}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <ModeBadge mode={run.mode} />
                    </TableCell>
                    <TableCell>
                      <ModelDots run={run} models={models} />
                    </TableCell>
                    <TableCell>
                      <WinnerCell run={run} models={models} />
                    </TableCell>
                    <TableCell className="font-mono text-[11px] whitespace-nowrap text-foreground/80 tabular-nums">
                      {(run.tokensIn + run.tokensOut).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-[11px] whitespace-nowrap text-foreground/80 tabular-nums">
                      {formatCost(run.costUsd)}
                    </TableCell>
                    <TableCell
                      className="font-mono text-[11px] whitespace-nowrap text-muted-foreground"
                      title={run.createdAt}
                    >
                      {run.relativeDate}
                    </TableCell>
                    <TableCell className="pr-4">
                      <Link
                        href={`/history/${run.id}`}
                        aria-label={`Open ${run.title}`}
                        className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                      >
                        <ChevronRightIcon
                          aria-hidden
                          className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <ul className="flex flex-col gap-2 lg:hidden">
        {runs.map((run) => {
          const checked = selected.includes(run.id);

          return (
            <li
              key={run.id}
              className={cn(
                "flex items-start gap-3 rounded-xl border border-border/60 bg-surface/40 p-3",
                checked && "border-highlight/40 bg-highlight/5",
              )}
            >
              <Checkbox
                aria-label={`Select ${run.title}`}
                checked={checked}
                onCheckedChange={() => onToggle(run.id)}
                className="mt-1"
              />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Link
                  href={`/history/${run.id}`}
                  className="block space-y-0.5 rounded-sm focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="truncate text-xs font-medium text-foreground">
                      {run.title}
                    </span>
                    <ChevronRightIcon
                      aria-hidden
                      className="size-3 shrink-0 text-muted-foreground"
                    />
                  </span>
                  <span className="block truncate font-mono text-[10px] text-muted-foreground">
                    {run.prompt}
                  </span>
                </Link>
                <div className="flex flex-wrap items-center gap-1.5">
                  <ModeBadge mode={run.mode} />
                  <ModelDots run={run} models={models} />
                  <WinnerCell run={run} models={models} />
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-muted-foreground">
                  <span className="tabular-nums">
                    {(run.tokensIn + run.tokensOut).toLocaleString()} tok
                  </span>
                  <span className="tabular-nums">{formatCost(run.costUsd)}</span>
                  <span>{run.relativeDate}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

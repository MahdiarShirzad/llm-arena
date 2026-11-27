"use client";

import { useMemo, useState } from "react";
import {
  CalendarIcon,
  ChevronDownIcon,
  DownloadIcon,
  HistoryIcon,
  SearchIcon,
  SearchXIcon,
  Trash2Icon,
} from "lucide-react";

import { HistoryList } from "@/components/history/history-list";
import { HistoryStatesPreview } from "@/components/history/history-states";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  historyRuns,
  models,
  type HistoryMode,
  type HistoryRun,
} from "@/mocks/data";

const sortOptions = ["Newest", "Oldest", "Cost", "Tokens"] as const;
type SortOption = (typeof sortOptions)[number];

const modeOptions: Array<"all" | HistoryMode> = [
  "all",
  "Compare",
  "Judge",
  "Brochure",
];

function isMode(value: string): value is HistoryMode {
  return value === "Compare" || value === "Judge" || value === "Brochure";
}

function isSort(value: string): value is SortOption {
  return sortOptions.some((option) => option === value);
}

const pageSize = 8;

export function HistoryView() {
  const [runs, setRuns] = useState<HistoryRun[]>(historyRuns);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"all" | HistoryMode>("all");
  const [modelFilter, setModelFilter] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("Newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return runs
      .filter((run) => {
        if (mode !== "all" && run.mode !== mode) {
          return false;
        }
        if (
          modelFilter.length > 0 &&
          !modelFilter.some((id) => run.modelIds.includes(id))
        ) {
          return false;
        }
        if (query.length === 0) {
          return true;
        }
        return `${run.title} ${run.prompt}`.toLowerCase().includes(query);
      })
      .sort((a, b) => {
        switch (sort) {
          case "Oldest":
            return a.createdAt.localeCompare(b.createdAt);
          case "Cost":
            return b.costUsd - a.costUsd;
          case "Tokens":
            return b.tokensIn + b.tokensOut - (a.tokensIn + a.tokensOut);
          default:
            return b.createdAt.localeCompare(a.createdAt);
        }
      });
  }, [runs, search, mode, modelFilter, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRuns = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const start = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, filtered.length);

  function toggleSelected(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );
  }

  function toggleAll(checked: boolean) {
    const pageIds = pageRuns.map((run) => run.id);
    setSelected((current) =>
      checked
        ? Array.from(new Set([...current, ...pageIds]))
        : current.filter((id) => !pageIds.includes(id)),
    );
  }

  function deleteSelected() {
    setRuns((current) => current.filter((run) => !selected.includes(run.id)));
    setSelected([]);
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="History"
        description="Every run is recorded with its prompt, lineup, spend and verdict."
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="gap-1.5 border-border/70 bg-surface/60"
              >
                <DownloadIcon aria-hidden />
                Export
                <ChevronDownIcon aria-hidden className="size-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="font-mono text-[10px] tracking-[0.14em] uppercase">
                Export {filtered.length} runs
              </DropdownMenuLabel>
              <DropdownMenuItem className="gap-2 font-mono text-[11px]">
                JSON
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 font-mono text-[11px]">
                CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-surface/40 p-3 lg:flex-row lg:flex-wrap lg:items-center">
        <div className="relative min-w-0 flex-1 lg:max-w-xs">
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            aria-label="Search runs"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search prompt or title…"
            className="h-9 border-border/60 bg-background/40 pl-9 text-xs"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-9 justify-between gap-2 border-border/60 bg-background/40 font-mono text-[11px]"
            >
              {modelFilter.length === 0
                ? "All models"
                : `${modelFilter.length} models`}
              <ChevronDownIcon aria-hidden className="size-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuLabel className="font-mono text-[10px] tracking-[0.14em] uppercase">
              Filter by model
            </DropdownMenuLabel>
            {models.map((model) => (
              <DropdownMenuCheckboxItem
                key={model.id}
                checked={modelFilter.includes(model.id)}
                onSelect={(event) => event.preventDefault()}
                onCheckedChange={(checked) => {
                  setModelFilter((current) =>
                    checked
                      ? [...current, model.id]
                      : current.filter((id) => id !== model.id),
                  );
                  setPage(1);
                }}
                className="font-mono text-[11px]"
              >
                {model.name}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                setModelFilter([]);
                setPage(1);
              }}
              className="font-mono text-[11px]"
            >
              Clear models
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Select
          value={mode}
          onValueChange={(value) => {
            setMode(isMode(value) ? value : "all");
            setPage(1);
          }}
        >
          <SelectTrigger aria-label="Mode" className="h-9 w-full lg:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {modeOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "all" ? "All modes" : option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          className="h-9 gap-1.5 border-border/60 bg-background/40 font-mono text-[11px]"
        >
          <CalendarIcon aria-hidden />
          Last 30 days
        </Button>

        <div className="lg:ml-auto">
          <Select
            value={sort}
            onValueChange={(value) => {
              if (isSort(value)) {
                setSort(value);
              }
            }}
          >
            <SelectTrigger aria-label="Sort" className="h-9 w-full lg:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-highlight/40 bg-highlight/10 px-3 py-2">
          <p className="font-mono text-[11px] text-foreground">
            {selected.length} selected
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelected([])}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={deleteSelected}
              className="gap-1.5"
            >
              <Trash2Icon aria-hidden />
              Delete
            </Button>
          </div>
        </div>
      )}

      {runs.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="No run history yet"
          description="Completed, streaming and failed runs all land here with their cost and latency."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={SearchXIcon}
          title="No runs match these filters"
          description="Try a different search, model or mode — the full history is still there."
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setMode("all");
                setModelFilter([]);
                setPage(1);
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <HistoryList
            runs={pageRuns}
            models={models}
            selected={selected}
            onToggle={toggleSelected}
            onToggleAll={toggleAll}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[10px] text-muted-foreground tabular-nums">
              Showing {start}–{end} of {filtered.length}
            </p>
            <nav aria-label="Pagination" className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                className="border-border/60"
              >
                Previous
              </Button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                (number) => (
                  <Button
                    key={number}
                    type="button"
                    variant={number === currentPage ? "secondary" : "ghost"}
                    size="sm"
                    aria-current={number === currentPage ? "page" : undefined}
                    onClick={() => setPage(number)}
                    className={cn(
                      "size-7 px-0 font-mono text-[11px] tabular-nums",
                      number === currentPage && "bg-surface-2 text-foreground",
                    )}
                  >
                    {number}
                  </Button>
                ),
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage === pageCount}
                onClick={() => setPage(currentPage + 1)}
                className="border-border/60"
              >
                Next
              </Button>
            </nav>
          </div>
        </>
      )}

      <HistoryStatesPreview />
    </div>
  );
}

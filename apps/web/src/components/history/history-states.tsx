"use client";

import { HistoryIcon } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import {
  UiStatesSection,
  type UiStateOption,
} from "@/components/shared/ui-states-section";
import { Skeleton } from "@/components/ui/skeleton";

function SkeletonRows() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-border/50 bg-surface/40"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading run history…</span>
      <div className="flex gap-4 border-b border-border/40 px-4 py-2.5">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-2.5 w-16" />
        ))}
      </div>
      <div className="divide-y divide-border/30">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-center gap-4 px-4 py-3">
            <Skeleton className="size-4 rounded-[4px]" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-2/5" />
              <Skeleton className="h-2.5 w-3/5" />
            </div>
            <Skeleton className="hidden h-5 w-16 rounded-full sm:block" />
            <Skeleton className="hidden h-5 w-24 rounded-full sm:block" />
            <Skeleton className="h-3 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}

const options: UiStateOption[] = [
  {
    id: "loading",
    label: "Loading rows",
    content: <SkeletonRows />,
  },
  {
    id: "empty",
    label: "Empty history",
    content: (
      <EmptyState
        icon={HistoryIcon}
        title="No run history yet"
        description="Completed, streaming and failed runs all land here with their cost and latency, ready to reopen or compare against a newer run."
      />
    ),
  },
];

export function HistoryStatesPreview() {
  return <UiStatesSection options={options} />;
}

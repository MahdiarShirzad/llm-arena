import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function TableSkeleton() {
  return (
    <Card
      aria-hidden
      className="gap-0 border border-border/50 bg-surface/40 py-0 ring-0"
    >
      <div className="space-y-1 border-b border-border/40 px-4 py-3.5">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-2.5 w-40" />
      </div>
      <div className="space-y-3 px-4 py-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="size-3.5 rounded-full" />
            <Skeleton className="h-5 w-28 rounded-full" />
            <Skeleton className="hidden h-2 flex-1 rounded-full sm:block" />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function RadarSkeleton() {
  return (
    <Card
      aria-hidden
      className="gap-3 border border-border/50 bg-surface/40 py-4 ring-0"
    >
      <div className="space-y-1 px-4">
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="h-2.5 w-44" />
      </div>
      <div className="flex justify-center py-4">
        <Skeleton className="size-48 rounded-full" />
      </div>
      <div className="flex gap-1.5 border-t border-border/40 px-4 pt-3">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-28 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
    </Card>
  );
}

function JudgeCardSkeleton() {
  return (
    <Card
      aria-hidden
      className="gap-3 border border-border/50 bg-surface/40 py-4 ring-0"
    >
      <div className="flex items-center justify-between px-4">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="size-16 rounded-full" />
      </div>
      <div className="space-y-2 px-4">
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-11/12" />
        <Skeleton className="h-2.5 w-4/5" />
      </div>
    </Card>
  );
}

export function JudgeResultsSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <span className="sr-only">Judging answers…</span>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <RadarSkeleton />
        <TableSkeleton />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <JudgeCardSkeleton />
        <JudgeCardSkeleton />
      </div>
    </div>
  );
}

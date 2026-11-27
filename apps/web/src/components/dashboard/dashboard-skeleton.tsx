import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function StatSkeleton() {
  return (
    <Card
      aria-hidden
      size="sm"
      className="gap-2 border border-border/50 bg-surface/40 py-3 ring-0"
    >
      <div className="space-y-2 px-3">
        <Skeleton className="h-2.5 w-24" />
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-2.5 w-28" />
      </div>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <Card
      aria-hidden
      className="gap-3 border border-border/50 bg-surface/40 py-4 ring-0"
    >
      <div className="space-y-1.5 px-4">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-2.5 w-48" />
      </div>
      <div className="flex h-52 items-end gap-2 px-4">
        {[40, 62, 48, 78].map((height, index) => (
          <Skeleton
            key={index}
            className="flex-1 rounded-t-md"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading dashboard…</span>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <StatSkeleton key={index} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <ChartSkeleton key={index} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card
          aria-hidden
          className="gap-3 border border-border/50 bg-surface/40 py-4 ring-0"
        >
          <div className="space-y-1.5 px-4">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-2.5 w-20" />
          </div>
          <div className="space-y-2.5 px-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-8 w-full" />
            ))}
          </div>
        </Card>
        <Card
          aria-hidden
          className="gap-3 border border-border/50 bg-surface/40 py-4 ring-0"
        >
          <div className="space-y-1.5 px-4">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-2.5 w-40" />
          </div>
          <div className="grid gap-2 px-4 sm:grid-cols-2">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>
          <div className="px-4">
            <Skeleton className="h-3 w-full" />
          </div>
        </Card>
      </div>
    </div>
  );
}

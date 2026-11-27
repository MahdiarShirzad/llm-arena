import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type SkeletonBlock = "stats" | "cards" | "charts" | "table" | "panel";

function Lines({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton
          key={index}
          className="h-2.5"
          style={{ width: `${92 - index * 12}%` }}
        />
      ))}
    </div>
  );
}

function BlockSkeleton({ block }: { block: SkeletonBlock }) {
  if (block === "stats") {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Card
            key={index}
            size="sm"
            className="gap-2 border border-border/50 bg-surface/40 py-3 ring-0"
          >
            <div className="space-y-2 px-3">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (block === "charts") {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <Card
            key={index}
            className="gap-3 border border-border/50 bg-surface/40 py-4 ring-0"
          >
            <div className="space-y-1.5 px-4">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-2.5 w-40" />
            </div>
            <div className="h-40 px-4">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (block === "table") {
    return (
      <Card className="gap-0 overflow-hidden border border-border/50 bg-surface/40 py-0 ring-0">
        <div className="border-b border-border/40 px-4 py-3">
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="divide-y divide-border/30">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="size-4 rounded-[4px]" />
              <Skeleton className="h-3 flex-1" />
              <Skeleton className="hidden h-5 w-20 rounded-full sm:block" />
              <Skeleton className="h-3 w-10" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (block === "panel") {
    return (
      <Card className="gap-3 border border-border/50 bg-surface/40 py-4 ring-0">
        <div className="space-y-1.5 px-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2.5 w-40" />
        </div>
        <div className="space-y-3 px-4">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <Card
          key={index}
          className="gap-3 border border-border/50 bg-surface/40 py-4 ring-0"
        >
          <div className="space-y-2 px-4">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Lines count={4} />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function PageSkeleton({
  blocks = ["cards"],
}: {
  blocks?: SkeletonBlock[];
}) {
  return (
    <div className="space-y-5" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading page…</span>
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-3 w-64" />
      </div>
      {blocks.map((block) => (
        <BlockSkeleton key={block} block={block} />
      ))}
    </div>
  );
}

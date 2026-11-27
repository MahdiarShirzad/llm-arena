import {
  Card,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ResultCardSkeleton({ className }: { className?: string }) {
  return (
    <Card
      aria-hidden
      className={cn(
        "gap-0 border border-border/50 bg-surface/40 py-0 ring-0",
        className,
      )}
    >
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <Skeleton className="size-1.5 rounded-full" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="size-5 rounded-md" />
      </CardHeader>
      <div className="space-y-2.5 px-4 py-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-11/12" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="mt-3 h-24 w-full rounded-lg" />
      </div>
      <CardFooter className="flex gap-1.5 border-border/40 bg-surface-2/20 px-4 py-3">
        <Skeleton className="h-6 w-20 rounded-md" />
        <Skeleton className="h-6 w-28 rounded-md" />
        <Skeleton className="h-6 w-16 rounded-md" />
      </CardFooter>
    </Card>
  );
}

export function ResultsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading model responses…</span>
      {Array.from({ length: count }, (_, index) => (
        <ResultCardSkeleton key={index} />
      ))}
    </div>
  );
}

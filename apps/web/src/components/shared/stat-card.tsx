import { TrendingDownIcon, TrendingUpIcon, type LucideIcon } from "lucide-react";

import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type StatDelta = {
  value: string;
  direction: "up" | "down";
  tone?: "positive" | "negative" | "neutral";
};

export type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  delta?: StatDelta;
  icon?: LucideIcon;
  className?: string;
};

export function StatCard({
  label,
  value,
  hint,
  delta,
  icon: Icon,
  className,
}: StatCardProps) {
  const tone =
    delta?.tone ?? (delta?.direction === "up" ? "positive" : "negative");
  const TrendIcon =
    delta?.direction === "down" ? TrendingDownIcon : TrendingUpIcon;

  return (
    <Card
      size="sm"
      className={cn("gap-2 border border-border/60 ring-0", className)}
    >
      <CardHeader className="gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <CardDescription className="font-mono text-[10px] tracking-[0.14em] uppercase">
            {label}
          </CardDescription>
          {Icon && (
            <Icon aria-hidden className="size-3.5 text-muted-foreground/70" />
          )}
        </div>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-mono text-2xl font-medium tracking-tight text-foreground tabular-nums">
            {value}
          </span>
          {delta && (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-mono text-[11px] tabular-nums",
                tone === "positive" && "text-success",
                tone === "negative" && "text-error",
                tone === "neutral" && "text-muted-foreground",
              )}
            >
              <TrendIcon aria-hidden className="size-3" />
              {delta.value}
            </span>
          )}
        </div>
        {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      </CardHeader>
    </Card>
  );
}

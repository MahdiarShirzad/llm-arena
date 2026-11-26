import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type MetricPillProps = {
  icon: LucideIcon;
  value: string | number;
  label?: string;
  tone?: "default" | "success" | "error" | "warning";
  className?: string;
};

const toneClass: Record<NonNullable<MetricPillProps["tone"]>, string> = {
  default: "text-foreground",
  success: "text-success",
  error: "text-error",
  warning: "text-warning",
};

export function MetricPill({
  icon: Icon,
  value,
  label,
  tone = "default",
  className,
}: MetricPillProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-md border border-border/60 bg-surface-2/40 px-2 text-[11px] whitespace-nowrap",
        className,
      )}
    >
      <Icon aria-hidden className="size-3 shrink-0 text-muted-foreground" />
      <span
        className={cn("font-mono font-medium tabular-nums", toneClass[tone])}
      >
        {value}
      </span>
      {label && <span className="text-muted-foreground">{label}</span>}
    </span>
  );
}

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card
      className={cn(
        "items-center gap-0 border border-dashed border-border/80 bg-surface/30 py-14 text-center ring-0",
        className,
      )}
    >
      <div className="flex max-w-md flex-col items-center gap-3 px-6">
        <span className="flex size-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
          <Icon aria-hidden className="size-5" />
        </span>
        <div className="space-y-1.5">
          <h2 className="text-base font-medium text-foreground">{title}</h2>
          <p className="text-sm leading-relaxed text-balance text-muted-foreground">
            {description}
          </p>
        </div>
        {action && <div className="pt-1">{action}</div>}
      </div>
    </Card>
  );
}

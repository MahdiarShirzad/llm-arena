import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { BrochureStep } from "@/mocks/data";

const statusLabel: Record<BrochureStep["status"], string> = {
  done: "Done",
  active: "In progress",
  pending: "Pending",
};

export function StepStepper({ steps }: { steps: BrochureStep[] }) {
  return (
    <ol className="grid grid-cols-3 gap-2 rounded-xl border border-border/60 bg-surface/40 p-3 sm:gap-4 sm:p-4">
      {steps.map((step, index) => {
        const done = step.status === "done";
        const active = step.status === "active";

        return (
          <li key={step.id} className="relative flex min-w-0 flex-col gap-1.5">
            {index < steps.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-3.5 left-8 hidden h-px w-[calc(100%-1rem)] sm:block",
                  done ? "bg-success/40" : "bg-border/70",
                )}
              />
            )}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "relative flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-[11px]",
                  done && "border-success/40 bg-success/15 text-success",
                  active &&
                    "border-highlight bg-highlight font-medium text-on-highlight",
                  step.status === "pending" &&
                    "border-border/70 bg-surface-2/30 text-muted-foreground",
                )}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-highlight/40 motion-safe:animate-ping"
                  />
                )}
                {done ? (
                  <CheckIcon aria-hidden className="size-3.5" strokeWidth={3} />
                ) : (
                  step.id
                )}
              </span>
              <span className="hidden font-mono text-[9px] tracking-[0.12em] text-muted-foreground uppercase sm:inline">
                {statusLabel[step.status]}
              </span>
            </div>
            <div className="min-w-0 space-y-0.5">
              <p
                className={cn(
                  "text-[11px] leading-snug font-medium sm:text-xs",
                  step.status === "pending"
                    ? "text-muted-foreground"
                    : "text-foreground",
                )}
              >
                {step.title}
              </p>
              <p className="truncate font-mono text-[10px] text-muted-foreground">
                {step.detail}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

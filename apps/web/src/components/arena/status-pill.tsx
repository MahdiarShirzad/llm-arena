import { cn } from "@/lib/utils";
import type { RunStatus } from "@/mocks/data";

const statusLabel: Record<RunStatus, string> = {
  streaming: "Streaming",
  done: "Done",
  error: "Error",
};

const statusTone: Record<
  RunStatus,
  { dot: string; text: string; border: string; background: string }
> = {
  streaming: {
    dot: "bg-steel motion-safe:animate-pulse",
    text: "text-steel",
    border: "border-steel/40",
    background: "bg-steel/10",
  },
  done: {
    dot: "bg-success",
    text: "text-success",
    border: "border-success/30",
    background: "bg-success/10",
  },
  error: {
    dot: "bg-error",
    text: "text-error",
    border: "border-error/30",
    background: "bg-error/10",
  },
};

export type StatusPillProps = {
  status: RunStatus;
  className?: string;
};

export function StatusPill({ status, className }: StatusPillProps) {
  const tone = statusTone[status];

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full border px-2 font-mono text-[10px] tracking-[0.08em] uppercase",
        tone.border,
        tone.background,
        tone.text,
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", tone.dot)} />
      {statusLabel[status]}
    </span>
  );
}

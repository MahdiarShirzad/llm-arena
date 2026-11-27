import { LoaderCircleIcon, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type RunComparisonButtonProps = {
  state?: "idle" | "loading" | "disabled";
  type?: "button" | "submit";
  className?: string;
};

/**
 * Gold primary action. Loading and disabled are rendered as static variants so
 * the three states can sit next to each other in the UI states preview.
 */
export function RunComparisonButton({
  state = "idle",
  type = "button",
  className,
}: RunComparisonButtonProps) {
  const loading = state === "loading";

  return (
    <Button
      type={type}
      size="lg"
      disabled={state !== "idle"}
      aria-busy={loading || undefined}
      className={cn(
        "h-9 gap-2 rounded-lg bg-highlight px-3.5 font-medium text-on-highlight shadow-sm transition-all hover:bg-highlight/90 hover:shadow-md focus-visible:border-highlight focus-visible:ring-highlight/40",
        className,
      )}
    >
      {loading ? (
        <LoaderCircleIcon aria-hidden className="size-4 animate-spin" />
      ) : (
        <SparklesIcon aria-hidden className="size-4" />
      )}
      {loading ? "Running…" : "Run comparison"}
      <span aria-hidden className="ml-1 hidden items-center gap-0.5 sm:inline-flex">
        <kbd className="rounded border border-on-highlight/25 bg-on-highlight/10 px-1 font-mono text-[10px] leading-4">
          ⌘
        </kbd>
        <kbd className="rounded border border-on-highlight/25 bg-on-highlight/10 px-1 font-mono text-[10px] leading-4">
          ↵
        </kbd>
      </span>
    </Button>
  );
}

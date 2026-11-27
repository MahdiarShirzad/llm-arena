import { GavelIcon, LoaderCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type RunJudgeButtonProps = {
  state?: "idle" | "loading" | "disabled";
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
};

/** Gold primary action for the judge, with static loading and disabled variants. */
export function RunJudgeButton({
  state = "idle",
  type = "button",
  onClick,
  className,
}: RunJudgeButtonProps) {
  const loading = state === "loading";

  return (
    <Button
      type={type}
      size="lg"
      disabled={state !== "idle"}
      aria-busy={loading || undefined}
      onClick={onClick}
      className={cn(
        "h-9 gap-2 rounded-lg bg-highlight px-3.5 font-medium text-on-highlight shadow-sm transition-all hover:bg-highlight/90 hover:shadow-md focus-visible:border-highlight focus-visible:ring-highlight/40",
        className,
      )}
    >
      {loading ? (
        <LoaderCircleIcon aria-hidden className="size-4 animate-spin" />
      ) : (
        <GavelIcon aria-hidden className="size-4" />
      )}
      {loading ? "Judging…" : "Run judge"}
    </Button>
  );
}

import { CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type CodeBlockProps = {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
};

export function CodeBlock({
  code,
  language,
  filename,
  className,
}: CodeBlockProps) {
  const caption = filename ?? language ?? "code";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/70 bg-surface",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-3 py-2">
        <span className="truncate font-mono text-[11px] text-muted-foreground">
          {caption}
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={`Copy ${caption}`}
              className="text-muted-foreground hover:bg-surface-2 hover:text-foreground"
            >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Copy</TooltipContent>
        </Tooltip>
      </div>
      <pre className="max-h-80 overflow-auto p-4 text-left">
        <code className="font-mono text-xs leading-relaxed whitespace-pre text-foreground">
          {code}
        </code>
      </pre>
    </div>
  );
}

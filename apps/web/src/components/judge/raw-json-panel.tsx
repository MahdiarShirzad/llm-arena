"use client";

import { useState, type ReactNode } from "react";
import { BracesIcon, ChevronRightIcon } from "lucide-react";

import { CodeBlock } from "@/components/shared/code-block";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tokenPattern =
  /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?)|\b(true|false|null)\b/g;

/** Token-based JSON colouring: keys, strings, numbers and literals. */
function highlightJson(source: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match = tokenPattern.exec(source);

  while (match !== null) {
    if (match.index > lastIndex) {
      nodes.push(source.slice(lastIndex, match.index));
    }

    if (match[1]) {
      const isKey = Boolean(match[2]);
      nodes.push(
        <span
          key={key++}
          className={isKey ? "text-foreground" : "text-success"}
        >
          {match[1]}
        </span>,
      );
      if (match[2]) {
        nodes.push(
          <span key={key++} className="text-muted-foreground">
            {match[2]}
          </span>,
        );
      }
    } else if (match[3]) {
      nodes.push(
        <span key={key++} className="text-warning">
          {match[3]}
        </span>,
      );
    } else {
      nodes.push(
        <span key={key++} className="text-foreground/70">
          {match[0]}
        </span>,
      );
    }

    lastIndex = tokenPattern.lastIndex;
    match = tokenPattern.exec(source);
  }

  if (lastIndex < source.length) {
    nodes.push(source.slice(lastIndex));
  }

  return nodes;
}

export type RawJsonPanelProps = {
  rawJson: string;
  filename?: string;
  className?: string;
};

export function RawJsonPanel({
  rawJson,
  filename = "judge-output.json",
  className,
}: RawJsonPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-border/60 bg-surface/40",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <BracesIcon
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground"
          />
          <h2 className="text-sm font-medium text-foreground">
            Raw JSON output
          </h2>
          <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">
            {filename}
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="gap-1.5 border-border/70 bg-surface/60 font-mono text-[11px]"
        >
          <ChevronRightIcon
            aria-hidden
            className={cn(
              "size-3 transition-transform duration-200",
              open && "rotate-90",
            )}
          />
          {open ? "Hide" : "Show"}
        </Button>
      </div>

      {open && (
        <div className="px-4 pb-4 sm:px-5">
          <CodeBlock
            code={rawJson}
            language="json"
            filename={filename}
            className="max-h-[28rem] overflow-y-auto bg-background/50"
          >
            {highlightJson(rawJson)}
          </CodeBlock>
        </div>
      )}
    </section>
  );
}

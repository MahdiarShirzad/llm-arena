"use client";

import { useState } from "react";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  LoaderCircleIcon,
  Maximize2Icon,
  RotateCcwIcon,
} from "lucide-react";

import { StreamingCursor } from "@/components/shared/streaming-cursor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { BrochureBlock, BrochureTone } from "@/mocks/data";

function blocksToMarkdown(blocks: BrochureBlock[]) {
  return blocks
    .map((block) => {
      switch (block.kind) {
        case "heading":
          return `${"#".repeat(block.level)} ${block.text}`;
        case "paragraph":
          return block.text;
        case "list":
          return block.items.map((item) => `- ${item}`).join("\n");
        case "callout":
          return `> ${block.text}`;
      }
    })
    .join("\n\n");
}

function BrochureBody({ blocks }: { blocks: BrochureBlock[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        const last = index === blocks.length - 1;

        switch (block.kind) {
          case "heading":
            return block.level === 1 ? (
              <h3
                key={index}
                className="text-lg font-semibold tracking-tight text-foreground"
              >
                {block.text}
              </h3>
            ) : (
              <h4
                key={index}
                className="pt-1 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase"
              >
                {block.text}
              </h4>
            );
          case "paragraph":
            return (
              <p
                key={index}
                className="text-[13px] leading-relaxed text-foreground/85"
              >
                {block.text}
                {last && <StreamingCursor />}
              </p>
            );
          case "list":
            return (
              <ul key={index} className="space-y-1.5">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-[13px] leading-relaxed text-foreground/85"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 size-1 shrink-0 rounded-full bg-highlight"
                    />
                    {item}
                  </li>
                ))}
                {last && <StreamingCursor />}
              </ul>
            );
          case "callout":
            return (
              <div
                key={index}
                className="rounded-lg border border-highlight/40 bg-highlight/10 px-3 py-2 text-[12px] leading-relaxed text-foreground"
              >
                {block.text}
                {last && <StreamingCursor />}
              </div>
            );
        }
      })}
    </div>
  );
}

export type BrochurePanelProps = {
  blocks: BrochureBlock[];
  tone: BrochureTone;
  modelName: string;
  className?: string;
};

export function BrochurePanel({
  blocks,
  tone,
  modelName,
  className,
}: BrochurePanelProps) {
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  function copy() {
    void navigator.clipboard.writeText(blocksToMarkdown(blocks)).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }

  function download() {
    const blob = new Blob([blocksToMarkdown(blocks)], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "brochure.md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function regenerate() {
    setRegenerating(true);
    window.setTimeout(() => setRegenerating(false), 1400);
  }

  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden border border-border/60 bg-surface/50 py-0 ring-0",
        className,
      )}
    >
      <CardHeader className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 px-4 py-3">
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-medium">Brochure</CardTitle>
          <CardDescription className="font-mono text-[10px] tracking-[0.14em] uppercase">
            {tone} · {modelName}
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={copy}
            className="gap-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          >
            {copied ? (
              <CheckIcon aria-hidden className="text-success" />
            ) : (
              <CopyIcon aria-hidden />
            )}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={download}
            className="gap-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          >
            <DownloadIcon aria-hidden />
            <span className="hidden sm:inline">.md</span>
            <span className="sr-only">Download markdown</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={regenerate}
            aria-busy={regenerating || undefined}
            className="gap-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          >
            {regenerating ? (
              <LoaderCircleIcon aria-hidden className="animate-spin" />
            ) : (
              <RotateCcwIcon aria-hidden />
            )}
            <span className="hidden sm:inline">Regenerate</span>
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Open brochure fullscreen"
                className="gap-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
                <Maximize2Icon aria-hidden />
                <span className="sr-only sm:not-sr-only sm:inline">
                  Fullscreen
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="flex h-[92dvh] w-[96vw] max-w-5xl flex-col gap-0 overflow-hidden p-0">
              <DialogHeader className="border-b border-border/60 px-4 py-3 pr-12">
                <DialogTitle className="text-sm font-medium">Brochure</DialogTitle>
                <DialogDescription className="font-mono text-[10px] tracking-[0.14em] uppercase">
                  {tone} · {modelName}
                </DialogDescription>
              </DialogHeader>
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                <BrochureBody blocks={blocks} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <div className="min-h-[22rem] px-4 py-4">
        <BrochureBody blocks={blocks} />
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border/50 bg-surface-2/20 px-4 py-2.5">
        <span className="font-mono text-[10px] text-muted-foreground">
          markdown · {blocks.length} blocks
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-highlight motion-safe:animate-pulse"
          />
          streaming
        </span>
      </div>
    </Card>
  );
}

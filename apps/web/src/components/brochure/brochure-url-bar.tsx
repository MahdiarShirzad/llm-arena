"use client";

import { useState } from "react";
import { LinkIcon, LoaderCircleIcon, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BrochureTone, Model } from "@/mocks/data";

const tones: BrochureTone[] = ["Professional", "Humorous"];

export type BrochureUrlBarProps = {
  models: Model[];
  defaultUrl: string;
  defaultTone: BrochureTone;
  defaultModelId: string;
};

export function BrochureUrlBar({
  models,
  defaultUrl,
  defaultTone,
  defaultModelId,
}: BrochureUrlBarProps) {
  const [url, setUrl] = useState(defaultUrl);
  const [tone, setTone] = useState<string>(defaultTone);
  const [modelId, setModelId] = useState(defaultModelId);
  const [generating, setGenerating] = useState(false);

  function generate() {
    setGenerating(true);
    window.setTimeout(() => setGenerating(false), 1500);
  }

  return (
    <Card className="gap-0 border border-border/70 bg-surface/50 py-0 ring-0">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          generate();
        }}
        className="grid gap-2 p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_9.5rem_11rem_auto] lg:items-center"
      >
        <div className="relative min-w-0">
          <LinkIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="url"
            aria-label="Company URL"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://company.com"
            className="h-10 border-border/60 bg-background/40 pl-9 font-mono text-xs"
          />
        </div>

        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger aria-label="Tone" className="h-10 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {tones.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={modelId} onValueChange={setModelId}>
          <SelectTrigger aria-label="Model" className="h-10 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="submit"
          size="lg"
          disabled={generating || url.trim().length === 0}
          aria-busy={generating || undefined}
          className="h-10 gap-2 rounded-lg bg-highlight px-3.5 font-medium text-on-highlight shadow-sm transition-all hover:bg-highlight/90 hover:shadow-md focus-visible:border-highlight focus-visible:ring-highlight/40"
        >
          {generating ? (
            <LoaderCircleIcon aria-hidden className="size-4 animate-spin" />
          ) : (
            <SparklesIcon aria-hidden className="size-4" />
          )}
          {generating ? "Generating…" : "Generate"}
        </Button>
      </form>
    </Card>
  );
}

"use client";

import { useId, useState } from "react";
import { CheckIcon } from "lucide-react";

import { providerDotClass } from "@/components/shared/model-badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { models, settingsDefaults } from "@/mocks/data";

export function DefaultsSection({ onDirty }: { onDirty: () => void }) {
  const [systemPrompt, setSystemPrompt] = useState(settingsDefaults.systemPrompt);
  const [temperature, setTemperature] = useState(settingsDefaults.temperature);
  const [maxTokens, setMaxTokens] = useState(settingsDefaults.maxTokens);
  const [modelIds, setModelIds] = useState<string[]>(settingsDefaults.modelIds);

  const promptId = useId();
  const tokensId = useId();

  function toggleModel(id: string) {
    setModelIds((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );
    onDirty();
  }

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-base font-medium text-foreground">Defaults</h2>
        <p className="text-[13px] text-muted-foreground">
          Every new comparison starts from these values.
        </p>
      </div>

      <Card className="gap-4 border border-border/60 bg-surface/40 p-4 py-4 ring-0">
        <CardHeader className="gap-1 p-0">
          <CardTitle className="text-sm font-medium">System prompt</CardTitle>
          <CardDescription className="text-[11px]">
            Applied to every model unless a run overrides it.
          </CardDescription>
        </CardHeader>
        <Textarea
          id={promptId}
          value={systemPrompt}
          onChange={(event) => {
            setSystemPrompt(event.target.value);
            onDirty();
          }}
          rows={4}
          className="min-h-24 resize-y border-border/60 bg-background/40 font-mono text-xs leading-relaxed"
        />
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="gap-3 border border-border/60 bg-surface/40 p-4 py-4 ring-0">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <span className="font-mono text-[11px] text-foreground tabular-nums">
              {temperature.toFixed(2)}
            </span>
          </div>
          <Slider
            aria-label="Default temperature"
            value={[temperature]}
            min={0}
            max={2}
            step={0.05}
            onValueChange={(value) => {
              setTemperature(value[0] ?? temperature);
              onDirty();
            }}
            className="py-2"
          />
          <p className="font-mono text-[10px] text-muted-foreground">
            lower is more deterministic
          </p>
        </Card>

        <Card className="gap-3 border border-border/60 bg-surface/40 p-4 py-4 ring-0">
          <div className="space-y-1.5">
            <label
              htmlFor={tokensId}
              className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
            >
              Default max tokens
            </label>
            <Input
              id={tokensId}
              inputMode="numeric"
              value={maxTokens}
              onChange={(event) => {
                setMaxTokens(event.target.value.replace(/[^0-9]/g, ""));
                onDirty();
              }}
              className="h-8 w-full font-mono text-xs tabular-nums"
            />
          </div>
          <p className="font-mono text-[10px] text-muted-foreground">
            per response · capped by the model
          </p>
        </Card>
      </div>

      <Card className="gap-3 border border-border/60 bg-surface/40 p-4 py-4 ring-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-sm font-medium">Default models</CardTitle>
          <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
            {modelIds.length} of {models.length} selected
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {models.map((model) => {
            const selected = modelIds.includes(model.id);

            return (
              <button
                key={model.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleModel(model.id)}
                className={cn(
                  "inline-flex h-8 items-center gap-2 rounded-lg border px-2.5 transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
                  selected
                    ? "border-highlight/60 bg-highlight/10 text-foreground"
                    : "border-border/60 bg-surface-2/20 text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full",
                    providerDotClass[model.provider],
                  )}
                />
                <span className="font-mono text-[11px] font-medium">
                  {model.name}
                </span>
                {selected && (
                  <CheckIcon aria-hidden className="size-3 text-highlight" />
                )}
              </button>
            );
          })}
        </div>
      </Card>
    </section>
  );
}

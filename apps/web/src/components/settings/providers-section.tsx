"use client";

import { useState } from "react";
import {
  EyeIcon,
  EyeOffIcon,
  KeyRoundIcon,
  LoaderCircleIcon,
  PlugZapIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  providerSettings,
  type ProviderSetting,
  type ProviderStatus,
} from "@/mocks/data";
import { providerDotClass } from "@/components/shared/model-badge";

const statusMeta: Record<ProviderStatus, { dot: string; label: string }> = {
  connected: { dot: "bg-success", label: "Connected" },
  not_configured: { dot: "bg-steel", label: "Not configured" },
  unreachable: { dot: "bg-error", label: "Unreachable" },
};

function ProviderCard({
  setting,
  onDirty,
}: {
  setting: ProviderSetting;
  onDirty: () => void;
}) {
  const [enabled, setEnabled] = useState(setting.enabled);
  const [baseUrl, setBaseUrl] = useState(setting.baseUrl);
  const [modelName, setModelName] = useState(setting.modelName);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);

  const status = statusMeta[setting.status];

  function testConnection() {
    setTesting(true);
    window.setTimeout(() => setTesting(false), 1400);
  }

  return (
    <Card className="gap-3 border border-border/60 bg-surface/40 p-4 py-4 ring-0">
      <CardHeader className="flex flex-wrap items-start justify-between gap-2 p-0">
        <div className="min-w-0 space-y-1">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <span
              aria-hidden
              className={cn(
                "size-2 rounded-full",
                providerDotClass[setting.provider],
              )}
            />
            {setting.label}
            <span className="flex items-center gap-1.5 font-mono text-[10px] font-normal tracking-[0.1em] text-muted-foreground uppercase">
              <span aria-hidden className={cn("size-1.5 rounded-full", status.dot)} />
              {status.label}
            </span>
          </CardTitle>
          <CardDescription className="text-[11px]">
            {setting.note}
          </CardDescription>
        </div>
        <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>{enabled ? "Enabled" : "Paused"}</span>
          <Switch
            checked={enabled}
            onCheckedChange={(checked) => {
              setEnabled(checked);
              onDirty();
            }}
            aria-label={`Enable ${setting.label}`}
          />
        </label>
      </CardHeader>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor={`base-${setting.provider}`}
            className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
          >
            Base URL
          </label>
          <Input
            id={`base-${setting.provider}`}
            value={baseUrl}
            onChange={(event) => {
              setBaseUrl(event.target.value);
              onDirty();
            }}
            className="h-8 font-mono text-[11px]"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor={`model-${setting.provider}`}
            className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
          >
            Model
          </label>
          <Input
            id={`model-${setting.provider}`}
            value={modelName}
            onChange={(event) => {
              setModelName(event.target.value);
              onDirty();
            }}
            className="h-8 font-mono text-[11px]"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor={`key-${setting.provider}`}
          className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
        >
          <KeyRoundIcon aria-hidden className="size-3" />
          API key
        </label>
        {setting.apiKeyMasked ? (
          <div className="relative">
            <Input
              id={`key-${setting.provider}`}
              type={showKey ? "text" : "password"}
              defaultValue={setting.apiKeyMasked}
              onChange={onDirty}
              className="h-8 pr-9 font-mono text-[11px]"
            />
            <button
              type="button"
              aria-label={showKey ? "Hide API key" : "Show API key"}
              aria-pressed={showKey}
              onClick={() => setShowKey((value) => !value)}
              className="absolute top-1/2 right-1 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {showKey ? (
                <EyeOffIcon aria-hidden className="size-3.5" />
              ) : (
                <EyeIcon aria-hidden className="size-3.5" />
              )}
            </button>
          </div>
        ) : (
          <p className="rounded-md border border-dashed border-border/70 bg-background/30 px-2.5 py-1.5 font-mono text-[10px] text-muted-foreground">
            No API key needed — expects a local server at localhost:11434
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-3">
        <span className="font-mono text-[10px] text-muted-foreground">
          {enabled ? "in the model lineup" : "excluded from new runs"}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={testConnection}
          disabled={testing}
          aria-busy={testing || undefined}
          className="gap-1.5 border-border/70 bg-surface/60 font-mono text-[11px]"
        >
          {testing ? (
            <LoaderCircleIcon aria-hidden className="animate-spin" />
          ) : (
            <PlugZapIcon aria-hidden />
          )}
          {testing ? "Testing…" : "Test connection"}
        </Button>
      </div>
    </Card>
  );
}

export function ProvidersSection({ onDirty }: { onDirty: () => void }) {
  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-base font-medium text-foreground">Providers</h2>
        <p className="text-[13px] text-muted-foreground">
          Keys stay on this machine. Enabling a provider adds it to the default
          lineup for new runs.
        </p>
      </div>
      <div className="grid gap-3 xl:grid-cols-2">
        {providerSettings.map((setting) => (
          <ProviderCard
            key={setting.provider}
            setting={setting}
            onDirty={onDirty}
          />
        ))}
      </div>
    </section>
  );
}

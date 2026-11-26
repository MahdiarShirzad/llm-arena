import { cn } from "@/lib/utils";
import type { ModelProvider } from "@/mocks/data";

const providerDot: Record<ModelProvider, string> = {
  openai: "bg-model-openai",
  gemini: "bg-model-gemini",
  deepseek: "bg-model-deepseek",
  ollama: "bg-model-ollama",
};

const providerLabel: Record<ModelProvider, string> = {
  openai: "OpenAI",
  gemini: "Gemini",
  deepseek: "DeepSeek",
  ollama: "Ollama",
};

export type ModelBadgeProps = {
  provider: ModelProvider;
  name?: string;
  showProvider?: boolean;
  className?: string;
};

export function ModelBadge({
  provider,
  name,
  showProvider = true,
  className,
}: ModelBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-2 rounded-full border border-border/70 bg-surface-2/40 px-2.5 text-xs whitespace-nowrap",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("size-1.5 shrink-0 rounded-full", providerDot[provider])}
      />
      <span className="font-mono text-[11px] font-medium text-foreground">
        {name ?? providerLabel[provider]}
      </span>
      {showProvider && (
        <span className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
          {providerLabel[provider]}
        </span>
      )}
    </span>
  );
}

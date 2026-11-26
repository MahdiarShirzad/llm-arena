import { SwordsIcon } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Arena" };

export default function ArenaPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Arena"
        description="Send one prompt to every model and watch the answers stream side by side, with tokens, latency and cost attached to each response."
      />
      <EmptyState
        icon={SwordsIcon}
        title="No runs yet"
        description="Paste a prompt to fan it out across OpenAI, Gemini, DeepSeek and your local Ollama model. Metrics land per model as each stream finishes."
      />
    </div>
  );
}

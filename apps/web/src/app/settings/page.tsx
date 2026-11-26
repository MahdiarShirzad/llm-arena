import { SettingsIcon } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Workspace defaults for model access, judge weights, streaming behaviour and per-run cost guardrails."
      />
      <EmptyState
        icon={SettingsIcon}
        title="Defaults are locked in the preview"
        description="This build is a UI preview driven entirely by local mock data. Settings will become editable once the arena is wired to a backend."
      />
    </div>
  );
}

"use client";

import { BarChart3Icon } from "lucide-react";

import {
  UiStatesSection,
  type UiStateOption,
} from "@/components/shared/ui-states-section";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

const options: UiStateOption[] = [
  {
    id: "empty",
    label: "No data yet",
    content: (
      <EmptyState
        icon={BarChart3Icon}
        title="Nothing to chart yet"
        description="Run a prompt in the Arena and this view fills with token volume, cost per model, latency percentiles and how often the judge matches a human pick."
        action={
          <Button type="button" variant="outline" size="sm" className="gap-1.5">
            Open the Arena
          </Button>
        }
      />
    ),
  },
];

export function DashboardStatesPreview() {
  return <UiStatesSection options={options} />;
}

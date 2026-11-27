"use client";

import { BookOpenTextIcon, CircleAlertIcon, GlobeIcon } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import {
  UiStatesSection,
  type UiStateOption,
} from "@/components/shared/ui-states-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ScrapeErrorCard({ url }: { url?: string }) {
  return (
    <Card className="gap-0 border border-error/30 bg-error/5 py-0 ring-0">
      <div className="flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-error/30 bg-error/10 text-error">
          <CircleAlertIcon aria-hidden className="size-4" />
        </span>
        <div className="min-w-0 flex-1 space-y-0.5">
          <h2 className="text-sm font-medium text-foreground">
            Could not scrape this URL
          </h2>
          <p className="text-[13px] leading-relaxed text-foreground/80">
            {url ?? "https://example.com"} returned a 403 and no readable
            content. Check that the page is public, or paste the text directly.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 border-error/30 bg-surface/50 font-mono text-[11px] hover:bg-error/10"
        >
          Try again
        </Button>
      </div>
    </Card>
  );
}

const options: UiStateOption[] = [
  {
    id: "empty",
    label: "Empty state",
    content: (
      <EmptyState
        icon={GlobeIcon}
        title="No brochure yet"
        description="Paste a company URL above to start. The generator scrapes the page, picks the links worth following, then writes a brochure from what it found."
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 font-mono text-[11px]"
          >
            <BookOpenTextIcon aria-hidden />
            Use example URL
          </Button>
        }
      />
    ),
  },
  {
    id: "error",
    label: "Scrape error",
    content: <ScrapeErrorCard />,
  },
];

export function BrochureStatesPreview() {
  return <UiStatesSection options={options} />;
}

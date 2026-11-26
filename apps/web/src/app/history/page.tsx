import { HistoryIcon } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "History" };

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="History"
        description="Every run is recorded with its prompt, lineup, spend and verdict, so you can trace a decision weeks later."
      />
      <EmptyState
        icon={HistoryIcon}
        title="No run history yet"
        description="Completed, streaming and failed runs all land here with their cost and latency, ready to reopen or compare against a newer run."
      />
    </div>
  );
}

import { ScaleIcon } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Judge" };

export default function JudgePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Judge"
        description="Let a model grade the arena on correctness, clarity and usefulness, then justify its winner in two sentences."
      />
      <EmptyState
        icon={ScaleIcon}
        title="No verdicts yet"
        description="Run a prompt in the Arena and bring the responses here. The judge scores each answer, calls out confident errors, and highlights a winner."
      />
    </div>
  );
}

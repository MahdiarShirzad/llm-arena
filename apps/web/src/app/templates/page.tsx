import { LayoutTemplateIcon } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Templates" };

export default function TemplatesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Templates"
        description="Save the prompts you run most, with model picks and judge settings attached so every comparison starts from the same baseline."
      />
      <EmptyState
        icon={LayoutTemplateIcon}
        title="No templates yet"
        description="A template keeps the system prompt, the models in the lineup and the judging rubric together. Build one once and reuse it across runs."
      />
    </div>
  );
}

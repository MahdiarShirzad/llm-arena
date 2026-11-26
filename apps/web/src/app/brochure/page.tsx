import { BookOpenTextIcon } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Brochure" };

export default function BrochurePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Brochure"
        description="Turn a finished run into a shareable one-pager: the prompt, the winning answer, and the metrics that decided it."
      />
      <EmptyState
        icon={BookOpenTextIcon}
        title="Nothing to publish yet"
        description="Pick a completed run and the Brochure assembles a clean summary you can send to a teammate or paste into a doc."
      />
    </div>
  );
}

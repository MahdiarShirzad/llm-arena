import type { Metadata } from "next";

import { BrochureView } from "@/components/brochure/brochure-view";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Brochure Generator" };

export default function BrochurePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Brochure Generator"
        description="From a URL to a company brochure"
      />
      <BrochureView />
    </div>
  );
}

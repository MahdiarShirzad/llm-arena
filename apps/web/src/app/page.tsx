import type { Metadata } from "next";

import { ArenaView } from "@/components/arena/arena-view";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Arena" };

export default function ArenaPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Arena" description="Compare models side by side" />
      <ArenaView />
    </div>
  );
}

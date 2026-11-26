import { LayoutDashboardIcon } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Usage, spend and judge agreement across every run, broken down by model so you can see what earns its place in the lineup."
      />
      <EmptyState
        icon={LayoutDashboardIcon}
        title="Nothing to chart yet"
        description="Once runs start landing, this view fills with token volume, cost per model, latency percentiles and how often the judge matches a human pick."
      />
    </div>
  );
}

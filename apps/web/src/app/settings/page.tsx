import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { SettingsView } from "@/components/settings/settings-view";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Providers, defaults and pricing for every run in this workspace."
      />
      <SettingsView />
    </div>
  );
}

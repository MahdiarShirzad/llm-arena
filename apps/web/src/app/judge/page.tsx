import type { Metadata } from "next";

import { JudgeView } from "@/components/judge/judge-view";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Judge" };

export default function JudgePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Judge" description="Let a model score the answers" />
      <JudgeView />
    </div>
  );
}

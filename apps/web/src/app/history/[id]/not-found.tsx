import Link from "next/link";
import { FileQuestionIcon } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function HistoryRunNotFound() {
  return (
    <div className="py-6">
      <EmptyState
        icon={FileQuestionIcon}
        title="Run not found"
        description="This run is not in the history of this workspace. It may have been deleted, or the link points at a run from another workspace."
        action={
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/history">Back to history</Link>
          </Button>
        }
      />
    </div>
  );
}

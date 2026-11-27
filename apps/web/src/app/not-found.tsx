import Link from "next/link";
import { CompassIcon } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="py-10">
      <EmptyState
        icon={CompassIcon}
        title="Page not found"
        description="That route does not exist in this workspace. Check the address, or start again from the Arena."
        action={
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild size="sm" className="gap-1.5">
              <Link href="/">Back to Arena</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/history">Browse history</Link>
            </Button>
          </div>
        }
      />
    </div>
  );
}

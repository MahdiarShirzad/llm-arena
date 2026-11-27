"use client";

import Link from "next/link";
import { CircleAlertIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-3 py-16 text-center">
      <span className="flex size-11 items-center justify-center rounded-xl border border-error/30 bg-error/10 text-error">
        <CircleAlertIcon aria-hidden className="size-5" />
      </span>
      <h1 className="text-lg font-medium text-foreground">
        Something went wrong on this page
      </h1>
      <p className="text-sm leading-relaxed text-balance text-muted-foreground">
        The view failed to render. Nothing was sent to a model, so no tokens
        were spent. Try again, or go back to the Arena.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <Button type="button" size="sm" onClick={reset} className="gap-1.5">
          Try again
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/">Back to Arena</Link>
        </Button>
      </div>
      <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
        reference {error.digest ?? "local"}
      </p>
    </div>
  );
}

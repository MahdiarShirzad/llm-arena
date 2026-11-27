"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { EraserIcon, RotateCcwIcon, TriangleAlertIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DangerRow({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-error/20 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-[12px] leading-relaxed text-foreground/75">
          {description}
        </p>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

export function DangerSection() {
  const [clearOpen, setClearOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-base font-medium text-foreground">Danger zone</h2>
        <p className="text-[13px] text-muted-foreground">
          These actions cannot be undone from the UI.
        </p>
      </div>

      <div className="rounded-xl border border-error/30 bg-error/5 px-4">
        <div className="flex items-center gap-2 border-b border-error/20 py-2.5">
          <TriangleAlertIcon aria-hidden className="size-3.5 text-error" />
          <p className="font-mono text-[10px] tracking-[0.14em] text-foreground/80 uppercase">
            Irreversible
          </p>
        </div>

        <DangerRow
          title="Clear history"
          description="Delete every recorded run, its responses and judge verdicts. Provider keys and defaults stay."
          action={
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setClearOpen(true)}
              className="gap-1.5"
            >
              <EraserIcon aria-hidden />
              Clear history
            </Button>
          }
        />

        <DangerRow
          title="Reset settings"
          description="Restore providers, defaults, pricing and appearance to the values this workspace shipped with."
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setResetOpen(true)}
              className="gap-1.5 border-error/30 bg-surface/50 text-error hover:bg-error/10 hover:text-error"
            >
              <RotateCcwIcon aria-hidden />
              Reset settings
            </Button>
          }
        />
      </div>

      <ConfirmDialog
        open={clearOpen}
        onOpenChange={setClearOpen}
        title="Clear all run history?"
        description="Every run, response and verdict is removed. This cannot be undone."
        confirmLabel="Clear history"
        onConfirm={() => toast.success("Run history cleared")}
      />
      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Reset all settings?"
        description="Providers, defaults, pricing and appearance return to their original values."
        confirmLabel="Reset settings"
        onConfirm={() => toast.success("Settings reset to defaults")}
      />
    </section>
  );
}

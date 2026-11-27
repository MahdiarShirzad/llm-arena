"use client";

import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type DeleteTemplateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  onConfirm: () => void;
};

export function DeleteTemplateDialog({
  open,
  onOpenChange,
  title,
  onConfirm,
}: DeleteTemplateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete template</DialogTitle>
          <DialogDescription>
            {title
              ? `“${title}” will be removed from the library. Runs that already used it keep their prompt.`
              : "This template will be removed from the library."}
          </DialogDescription>
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
            size="sm"
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="gap-1.5"
          >
            <Trash2Icon aria-hidden />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

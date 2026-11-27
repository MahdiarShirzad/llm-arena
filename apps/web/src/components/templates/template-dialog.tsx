"use client";

import { useId, useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { LibraryTemplate } from "@/mocks/data";

export type TemplateDraft = {
  title: string;
  tags: string[];
  systemPrompt: string;
  userPrompt: string;
};

function VariableText({ text }: { text: string }) {
  const parts = text.split(/(\{\{[^}]+\}\})/g);

  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("{{") && part.endsWith("}}") ? (
          <span
            key={index}
            className="rounded bg-highlight/25 px-1 font-mono text-[11px] text-foreground"
          >
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

export type TemplateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: LibraryTemplate | null;
  onSubmit: (draft: TemplateDraft) => void;
};

export function TemplateDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: TemplateDialogProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(initial?.systemPrompt ?? "");
  const [userPrompt, setUserPrompt] = useState(initial?.userPrompt ?? "");

  const titleId = useId();
  const tagsId = useId();
  const systemId = useId();
  const userPromptId = useId();
  const hintId = useId();

  function addTag() {
    const next = tagInput.trim().replace(/,$/, "");
    if (next.length === 0) {
      return;
    }
    setTags((current) =>
      current.some((tag) => tag.toLowerCase() === next.toLowerCase())
        ? current
        : [...current, next],
    );
    setTagInput("");
  }

  const canSave = title.trim().length > 0 && systemPrompt.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-full max-w-3xl gap-0 overflow-y-auto p-0">
        <DialogHeader className="border-b border-border/60 px-5 py-4 pr-12">
          <DialogTitle className="text-base">
            {initial ? "Edit template" : "New template"}
          </DialogTitle>
          <DialogDescription>
            A template keeps the system prompt, the user prompt and its
            variables together so every run starts from the same baseline.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!canSave) {
              return;
            }
            onSubmit({
              title: title.trim(),
              tags,
              systemPrompt: systemPrompt.trim(),
              userPrompt: userPrompt.trim(),
            });
          }}
          className="grid gap-5 px-5 py-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor={titleId}
                className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
              >
                Name
              </label>
              <Input
                id={titleId}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Incident timeline"
                maxLength={80}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor={tagsId}
                className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
              >
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex h-6 items-center gap-1 rounded-full border border-border/70 bg-surface-2/50 pr-1 pl-2 font-mono text-[10px] text-foreground"
                  >
                    {tag}
                    <button
                      type="button"
                      aria-label={`Remove tag ${tag}`}
                      onClick={() =>
                        setTags((current) =>
                          current.filter((entry) => entry !== tag),
                        )
                      }
                      className="flex size-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      <XIcon aria-hidden className="size-2.5" />
                    </button>
                  </span>
                ))}
              </div>
              <Input
                id={tagsId}
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === ",") {
                    event.preventDefault();
                    addTag();
                  }
                }}
                onBlur={addTag}
                placeholder="Type a tag and press Enter"
                className="h-8 font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor={systemId}
                className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
              >
                System prompt
              </label>
              <Textarea
                id={systemId}
                value={systemPrompt}
                onChange={(event) => setSystemPrompt(event.target.value)}
                rows={4}
                placeholder="You are a database performance engineer…"
                className="min-h-24 resize-y font-mono text-xs leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor={userPromptId}
                className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
              >
                User prompt
              </label>
              <Textarea
                id={userPromptId}
                value={userPrompt}
                onChange={(event) => setUserPrompt(event.target.value)}
                rows={3}
                aria-describedby={hintId}
                placeholder={"Summarise {{document}} for a VP"}
                className="min-h-20 resize-y font-mono text-xs leading-relaxed"
              />
              <p id={hintId} className="text-[11px] text-muted-foreground">
                Use{" "}
                <code className="rounded bg-surface-2/60 px-1 font-mono text-[10px] text-foreground">
                  {"{{variable}}"}
                </code>{" "}
                placeholders — each one becomes a field when the template runs.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              Preview
            </p>
            <div className="space-y-3 rounded-xl border border-dashed border-border/70 bg-surface/40 p-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {title.trim() || "Untitled template"}
                </p>
                <ul className="flex flex-wrap gap-1">
                  {tags.length === 0 ? (
                    <li className="font-mono text-[10px] text-muted-foreground">
                      no tags yet
                    </li>
                  ) : (
                    tags.map((tag) => (
                      <li key={tag}>
                        <span className="inline-flex h-5 items-center rounded-full border border-border/70 bg-surface-2/40 px-2 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
                          {tag}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div className="space-y-1">
                <p className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
                  System
                </p>
                <p className="rounded-lg border border-border/50 bg-background/40 p-2 font-mono text-[10px] leading-relaxed whitespace-pre-wrap text-foreground/80">
                  <VariableText
                    text={systemPrompt.trim() || "The system prompt appears here."}
                  />
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
                  User
                </p>
                <p className="rounded-lg border border-border/50 bg-background/40 p-2 font-mono text-[10px] leading-relaxed whitespace-pre-wrap text-foreground/80">
                  <VariableText
                    text={userPrompt.trim() || "The user prompt appears here."}
                  />
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 border-t border-border/60 pt-3 lg:col-span-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!canSave}
              className="gap-1.5 bg-highlight font-medium text-on-highlight hover:bg-highlight/90 focus-visible:border-highlight focus-visible:ring-highlight/40"
            >
              <PlusIcon aria-hidden />
              {initial ? "Save changes" : "Create template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

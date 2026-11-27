"use client";

import Link from "next/link";
import {
  CopyIcon,
  MoreHorizontalIcon,
  PencilIcon,
  StarIcon,
  SwordsIcon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { LibraryTemplate } from "@/mocks/data";

function TagList({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <li key={tag}>
          <span className="inline-flex h-5 items-center rounded-full border border-border/70 bg-surface-2/40 px-2 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
            {tag}
          </span>
        </li>
      ))}
    </ul>
  );
}

function KebabMenu({
  template,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  template: LibraryTemplate;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`More actions for ${template.title}`}
          className="text-muted-foreground hover:bg-surface-2 hover:text-foreground"
        >
          <MoreHorizontalIcon aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onSelect={onEdit} className="gap-2">
          <PencilIcon aria-hidden />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onDuplicate} className="gap-2">
          <CopyIcon aria-hidden />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={onDelete}
          className="gap-2"
        >
          <Trash2Icon aria-hidden />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export type TemplateCardProps = {
  template: LibraryTemplate;
  view?: "grid" | "list";
  onTogglePin: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

export function TemplateCard({
  template,
  view = "grid",
  onTogglePin,
  onEdit,
  onDuplicate,
  onDelete,
}: TemplateCardProps) {
  const pinButton = (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-pressed={template.pinned}
      aria-label={
        template.pinned
          ? `Unpin ${template.title}`
          : `Pin ${template.title} to the top`
      }
      onClick={onTogglePin}
      className={cn(
        "shrink-0 text-muted-foreground hover:bg-surface-2 hover:text-foreground",
        template.pinned && "text-highlight hover:text-highlight",
      )}
    >
      <StarIcon aria-hidden className={cn(template.pinned && "fill-current")} />
    </Button>
  );

  if (view === "list") {
    return (
      <Card className="flex-row items-center gap-4 border border-border/60 bg-surface/50 px-4 py-3 ring-0 transition-colors hover:border-border hover:bg-surface/70">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate text-sm font-medium text-foreground">
              {template.title}
            </h3>
            <TagList tags={template.tags} />
          </div>
          <p className="line-clamp-1 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {template.systemPrompt}
          </p>
        </div>
        <div className="hidden shrink-0 text-right font-mono text-[10px] text-muted-foreground sm:block">
          <p>{template.lastUsed}</p>
          <p className="tabular-nums">{template.usageCount} uses</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {pinButton}
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/">
              <SwordsIcon aria-hidden />
              Arena
            </Link>
          </Button>
          <KebabMenu
            template={template}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        </div>
      </Card>
    );
  }

  return (
    <Card className="gap-0 overflow-hidden border border-border/60 bg-surface/50 py-0 ring-0 transition-[border-color,box-shadow] duration-200 hover:border-border hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/30">
      <div className="flex items-start justify-between gap-2 px-4 pt-3">
        <h3 className="min-w-0 flex-1 truncate pt-1 text-sm font-medium text-foreground">
          {template.title}
        </h3>
        {pinButton}
      </div>

      <div className="px-4 pt-1">
        <TagList tags={template.tags} />
      </div>

      <p className="mx-4 mt-3 line-clamp-3 min-h-[3.6rem] rounded-lg border border-border/40 bg-background/40 px-3 py-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
        {template.systemPrompt}
      </p>

      <div className="flex items-center justify-between gap-2 px-4 py-3 font-mono text-[10px] text-muted-foreground">
        <span>last used {template.lastUsed}</span>
        <span className="tabular-nums">{template.usageCount} uses</span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/50 bg-surface-2/20 px-3 py-2">
        <Button asChild size="sm" className="gap-1.5">
          <Link href="/">
            <SwordsIcon aria-hidden />
            Use in Arena
          </Link>
        </Button>
        <KebabMenu
          template={template}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      </div>
    </Card>
  );
}

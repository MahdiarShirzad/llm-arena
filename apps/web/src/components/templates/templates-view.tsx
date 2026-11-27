"use client";

import { useMemo, useState } from "react";
import {
  LayoutGridIcon,
  LayoutTemplateIcon,
  ListIcon,
  PlusIcon,
  SearchIcon,
  SearchXIcon,
} from "lucide-react";

import { DeleteTemplateDialog } from "@/components/templates/delete-template-dialog";
import { TemplateCard } from "@/components/templates/template-card";
import {
  TemplateDialog,
  type TemplateDraft,
} from "@/components/templates/template-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  libraryTemplates,
  type LibraryTemplate,
  type TemplateFilterTag,
} from "@/mocks/data";

const filters: Array<"All" | TemplateFilterTag> = [
  "All",
  "Summarization",
  "Coding",
  "Writing",
  "Analysis",
  "Translation",
];

function newId() {
  return `tpl_${Math.random().toString(36).slice(2, 9)}`;
}

export function TemplatesView() {
  const [templates, setTemplates] = useState<LibraryTemplate[]>(libraryTemplates);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | TemplateFilterTag>("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [editor, setEditor] = useState<{ template: LibraryTemplate | null } | null>(
    null,
  );
  const [deleting, setDeleting] = useState<LibraryTemplate | null>(null);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();

    return templates
      .filter((template) => {
        const matchesFilter =
          filter === "All" || template.tags.includes(filter);
        if (!matchesFilter) {
          return false;
        }
        if (query.length === 0) {
          return true;
        }
        return [
          template.title,
          template.systemPrompt,
          template.userPrompt,
          ...template.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) {
          return a.pinned ? -1 : 1;
        }
        return b.usageCount - a.usageCount;
      });
  }, [templates, filter, search]);

  function togglePin(id: string) {
    setTemplates((current) =>
      current.map((template) =>
        template.id === id
          ? { ...template, pinned: !template.pinned }
          : template,
      ),
    );
  }

  function duplicate(template: LibraryTemplate) {
    setTemplates((current) => [
      {
        ...template,
        id: newId(),
        title: `${template.title} copy`,
        pinned: false,
        lastUsed: "never",
        usageCount: 0,
      },
      ...current,
    ]);
  }

  function submit(draft: TemplateDraft) {
    const editing = editor?.template ?? null;

    setTemplates((current) => {
      if (editing) {
        return current.map((template) =>
          template.id === editing.id
            ? { ...template, ...draft, lastUsed: "just now" }
            : template,
        );
      }
      return [
        {
          id: newId(),
          ...draft,
          lastUsed: "never",
          usageCount: 0,
          pinned: false,
        },
        ...current,
      ];
    });
    setEditor(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Templates"
        description="Save the prompts you run most, with the variables already spelled out."
        actions={
          <Button
            type="button"
            onClick={() => setEditor({ template: null })}
            className="gap-1.5 bg-highlight font-medium text-on-highlight hover:bg-highlight/90 focus-visible:border-highlight focus-visible:ring-highlight/40"
          >
            <PlusIcon aria-hidden />
            New template
          </Button>
        }
      />

      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-surface/40 p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            aria-label="Search templates"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, prompt or tag…"
            className="h-9 border-border/60 bg-background/40 pl-9 text-xs"
          />
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          {filters.map((option) => {
            const active = filter === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(option)}
                className={cn(
                  "inline-flex h-7 items-center rounded-full border px-2.5 text-[11px] font-medium transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
                  active
                    ? "border-highlight/60 bg-highlight/10 text-foreground"
                    : "border-border/60 bg-surface-2/20 text-muted-foreground hover:border-border hover:bg-surface-2/40 hover:text-foreground",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div
          role="group"
          aria-label="Layout"
          className="flex shrink-0 items-center gap-1 rounded-lg border border-border/60 bg-background/40 p-0.5"
        >
          <Button
            type="button"
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon-xs"
            aria-pressed={view === "grid"}
            aria-label="Grid view"
            onClick={() => setView("grid")}
            className="size-7"
          >
            <LayoutGridIcon aria-hidden />
          </Button>
          <Button
            type="button"
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon-xs"
            aria-pressed={view === "list"}
            aria-label="List view"
            onClick={() => setView("list")}
            className="size-7"
          >
            <ListIcon aria-hidden />
          </Button>
        </div>
      </div>

      {templates.length === 0 ? (
        <EmptyState
          icon={LayoutTemplateIcon}
          title="No templates yet"
          description="Create your first template to keep a system prompt, its variables and the models that run it together."
          action={
            <Button
              type="button"
              size="sm"
              onClick={() => setEditor({ template: null })}
              className="gap-1.5"
            >
              <PlusIcon aria-hidden />
              New template
            </Button>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={SearchXIcon}
          title="No templates match"
          description="Nothing matches this search and tag combination. Clear the filters to see the whole library."
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setFilter("All");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              view="grid"
              onTogglePin={() => togglePin(template.id)}
              onEdit={() => setEditor({ template })}
              onDuplicate={() => duplicate(template)}
              onDelete={() => setDeleting(template)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              view="list"
              onTogglePin={() => togglePin(template.id)}
              onEdit={() => setEditor({ template })}
              onDuplicate={() => duplicate(template)}
              onDelete={() => setDeleting(template)}
            />
          ))}
        </div>
      )}

      {editor && (
        <TemplateDialog
          key={editor.template?.id ?? "new"}
          open
          onOpenChange={(open) => {
            if (!open) {
              setEditor(null);
            }
          }}
          initial={editor.template}
          onSubmit={submit}
        />
      )}

      <DeleteTemplateDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(null);
          }
        }}
        title={deleting?.title}
        onConfirm={() => {
          if (deleting) {
            setTemplates((current) =>
              current.filter((template) => template.id !== deleting.id),
            );
          }
        }}
      />
    </div>
  );
}

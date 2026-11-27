"use client";

import { useState } from "react";
import { Link2Icon, SparklesIcon } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { BrochureDemo } from "@/mocks/data";

const typeTone: Record<string, string> = {
  About: "border-steel/40 bg-steel/10 text-foreground",
  Careers: "border-success/40 bg-success/10 text-foreground",
  Pricing: "border-highlight/50 bg-highlight/10 text-foreground",
  Product: "border-border/70 bg-surface-2/40 text-foreground",
  Blog: "border-border/70 bg-surface-2/40 text-muted-foreground",
  Docs: "border-border/70 bg-surface-2/40 text-muted-foreground",
};

export type SourcePanelProps = {
  demo: BrochureDemo;
  className?: string;
};

export function SourcePanel({ demo, className }: SourcePanelProps) {
  const [included, setIncluded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(demo.links.map((link) => [link.id, link.relevant])),
  );

  const relevantCount = demo.links.filter((link) => link.relevant).length;

  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden border border-border/60 bg-surface/50 py-0 ring-0",
        className,
      )}
    >
      <CardHeader className="border-b border-border/50 px-4 py-3.5">
        <CardTitle className="text-sm font-medium">Source</CardTitle>
        <CardDescription className="font-mono text-[10px] tracking-[0.14em] uppercase">
          scraped from {demo.url.replace("https://", "")}
        </CardDescription>
      </CardHeader>

      <Tabs defaultValue="content">
        <div className="border-b border-border/50 px-3 pt-3">
          <TabsList className="w-full">
            <TabsTrigger value="content">Page content</TabsTrigger>
            <TabsTrigger value="links" className="gap-1.5">
              Links
              <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                {relevantCount}/{demo.links.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="content" className="p-4">
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
              <Link2Icon aria-hidden className="size-3.5 text-muted-foreground" />
              {demo.pageTitle}
            </p>
            <p className="max-h-56 overflow-y-auto rounded-lg border border-border/50 bg-background/40 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
              {demo.pageContent}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              {demo.pageContent.split(/\s+/).length} words · truncated for prompt
            </p>
          </div>
        </TabsContent>

        <TabsContent value="links" className="p-2">
          <ul className="max-h-72 divide-y divide-border/40 overflow-y-auto">
            {demo.links.map((link) => (
              <li
                key={link.id}
                className="flex items-center gap-2.5 px-2 py-2"
              >
                <Checkbox
                  id={`link-${link.id}`}
                  checked={included[link.id] ?? false}
                  onCheckedChange={(checked) =>
                    setIncluded((current) => ({
                      ...current,
                      [link.id]: checked === true,
                    }))
                  }
                  aria-label={`Use ${link.label}`}
                />
                <label
                  htmlFor={`link-${link.id}`}
                  className="flex min-w-0 flex-1 cursor-pointer flex-col gap-0.5"
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span className="truncate text-xs text-foreground">
                      {link.label}
                    </span>
                    {link.relevant && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-highlight/40 bg-highlight/10 px-1.5 py-px text-[9px] font-medium text-foreground">
                        <SparklesIcon
                          aria-hidden
                          className="size-2.5 text-highlight"
                        />
                        relevant
                      </span>
                    )}
                  </span>
                  <span className="truncate font-mono text-[10px] text-muted-foreground">
                    {link.url}
                  </span>
                </label>
                <span
                  className={cn(
                    "shrink-0 rounded-md border px-1.5 py-0.5 font-mono text-[9px] tracking-[0.08em] uppercase",
                    typeTone[link.type],
                  )}
                >
                  {link.type}
                </span>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type UiStateOption = {
  id: string;
  label: string;
  content: ReactNode;
};

export type UiStatesSectionProps = {
  options: UiStateOption[];
  footer?: ReactNode;
  className?: string;
};

/**
 * Dev-only state switcher used to preview empty, loading and error states
 * that the mock data would otherwise never reach.
 */
export function UiStatesSection({
  options,
  footer,
  className,
}: UiStatesSectionProps) {
  const [active, setActive] = useState(options[0]?.id ?? "");
  const current = options.find((option) => option.id === active) ?? options[0];

  if (!current) {
    return null;
  }

  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-dashed border-border/70 bg-surface/20",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            UI states
          </h2>
          <span className="rounded-full border border-border/60 bg-surface-2/40 px-2 py-0.5 font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
            Dev preview
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-w-44 justify-between gap-2 border-border/70 bg-surface/60 font-mono text-[11px]"
            >
              {current.label}
              <ChevronDownIcon
                aria-hidden
                className="size-3 text-muted-foreground"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-mono text-[10px] tracking-[0.14em] uppercase">
              Preview state
            </DropdownMenuLabel>
            {options.map((option) => (
              <DropdownMenuItem
                key={option.id}
                onSelect={() => setActive(option.id)}
                className="gap-2 font-mono text-[11px]"
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full",
                    active === option.id ? "bg-highlight" : "bg-border",
                  )}
                />
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="p-4 sm:p-5">{current.content}</div>
      {footer && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border/40 px-4 py-4 sm:px-5">
          {footer}
        </div>
      )}
    </section>
  );
}

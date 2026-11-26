"use client";

import { PanelLeftCloseIcon, PanelLeftOpenIcon, SwordsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/components/layout/nav-items";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function ArenaMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex h-14 shrink-0 items-center gap-2.5 border-b border-border/70 px-4",
        compact && "justify-center px-0",
      )}
      aria-label="LLM Arena home"
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-highlight text-on-highlight shadow-[0_0_18px_-6px_var(--highlight)]">
        <SwordsIcon className="size-4" strokeWidth={2.25} />
      </span>
      {!compact && (
        <span className="truncate text-sm font-semibold tracking-tight text-foreground">
          LLM Arena
        </span>
      )}
    </Link>
  );
}

function NavList({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="flex flex-col gap-0.5 px-2 py-3">
      {navItems.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;

        const link = (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium transition-colors",
              "focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none",
              active
                ? "bg-surface-2 text-foreground"
                : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            {active && (
              <span
                aria-hidden
                className="absolute top-1/2 left-0 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-highlight ring-1 ring-on-highlight/15"
              />
            )}
            <Icon
              aria-hidden
              className={cn(
                "size-4 shrink-0 transition-colors",
                active
                  ? "text-accent"
                  : "text-muted-foreground group-hover:text-foreground",
              )}
            />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );

        if (!collapsed) return link;

        return (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>{link}</TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}

function SidebarFooter({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mt-auto border-t border-border/70 p-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            className={cn(
              "flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors",
              "hover:bg-surface-2/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none",
              collapsed && "justify-center px-0",
            )}
          >
            {collapsed ? (
              <PanelLeftOpenIcon aria-hidden className="size-4" />
            ) : (
              <PanelLeftCloseIcon aria-hidden className="size-4" />
            )}
            {!collapsed && <span>Collapse</span>}
          </button>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right">Expand sidebar</TooltipContent>
        )}
      </Tooltip>
    </div>
  );
}

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-border/70 bg-sidebar transition-[width] duration-200 ease-out lg:flex",
        collapsed ? "w-[68px]" : "w-60",
      )}
    >
      <ArenaMark compact={collapsed} />
      <NavList collapsed={collapsed} />
      <SidebarFooter collapsed={collapsed} onToggle={onToggle} />
    </aside>
  );
}

export function MobileSidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[280px] gap-0 border-border bg-sidebar p-0"
      >
        <SheetHeader className="p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Main sections of LLM Arena
          </SheetDescription>
          <ArenaMark />
        </SheetHeader>
        <NavList onNavigate={() => onOpenChange(false)} />
        <div className="mt-auto border-t border-border/70 px-4 py-3">
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            Mock data · v0.1
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { MenuIcon } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { navItemForPath } from "@/components/layout/nav-items";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

export function TopBar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const pathname = usePathname();
  const current = navItemForPath(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border/70 bg-background/85 px-3 backdrop-blur-md sm:px-4 lg:px-6">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Open navigation"
        onClick={onOpenMobile}
        className="text-muted-foreground hover:bg-surface-2 hover:text-foreground lg:hidden"
      >
        <MenuIcon />
      </Button>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Image
          src="/logo.png"
          alt="LLM Arena"
          width={20}
          height={20}
          priority
          className="size-5 shrink-0 rounded-md ring-1 ring-border/40 lg:hidden"
        />
        <span className="hidden font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase sm:inline">
          LLM Arena
        </span>
        <span aria-hidden className="hidden text-muted-foreground/40 sm:inline">
          /
        </span>
        <span className="truncate text-sm font-medium text-foreground">
          {current.label}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <span aria-hidden className="mx-0.5 h-5 w-px bg-border/70" />
        <div
          role="img"
          aria-label="Signed in as Mahdiar"
          title="Signed in as Mahdiar"
          className="flex size-7 items-center justify-center rounded-full border border-border bg-surface-2 font-mono text-[10px] font-medium tracking-wide text-foreground ring-1 ring-highlight/40 select-none"
        >
          MS
        </div>
      </div>
    </header>
  );
}

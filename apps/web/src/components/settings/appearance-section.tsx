"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const options = [
  {
    id: "dark",
    label: "Dark",
    description: "Gold on navy — the default",
    icon: MoonIcon,
  },
  {
    id: "light",
    label: "Light",
    description: "Navy accents on paper",
    icon: SunIcon,
  },
  {
    id: "system",
    label: "System",
    description: "Follow the OS setting",
    icon: MonitorIcon,
  },
] as const;

function ThemePreview({ id }: { id: (typeof options)[number]["id"] }) {
  if (id === "system") {
    return (
      <span className="flex h-16 overflow-hidden rounded-md border border-border/60">
        <span className="dark flex w-1/2 flex-col justify-between bg-background p-1.5">
          <span className="h-1.5 w-6 rounded-full bg-surface-2" />
          <span className="h-1.5 w-4 rounded-full bg-highlight" />
        </span>
        <span className="light flex w-1/2 flex-col justify-between bg-background p-1.5">
          <span className="h-1.5 w-6 rounded-full bg-surface-2" />
          <span className="h-1.5 w-4 rounded-full bg-accent" />
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex h-16 flex-col justify-between rounded-md border border-border/60 bg-background p-2",
        id,
      )}
    >
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-6 rounded-full bg-surface-2" />
        <span className="ml-auto h-1.5 w-4 rounded-full bg-highlight" />
      </span>
      <span className="space-y-1">
        <span className="block h-1.5 w-full rounded-full bg-surface" />
        <span className="block h-1.5 w-2/3 rounded-full bg-surface" />
      </span>
    </span>
  );
}

const subscribe = () => () => {};

/** True after hydration, so the selected card does not cause a mismatch. */
function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function AppearanceSection({ onDirty }: { onDirty: () => void }) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-base font-medium text-foreground">Appearance</h2>
        <p className="text-[13px] text-muted-foreground">
          Both themes meet WCAG AA for body text; charts and status dots use the
          same tokens.
        </p>
      </div>

      <div
        role="group"
        aria-label="Theme"
        className="grid gap-3 sm:grid-cols-3"
      >
        {options.map((option) => {
          const Icon = option.icon;
          const active = mounted && theme === option.id;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setTheme(option.id);
                onDirty();
              }}
              className={cn(
                "space-y-2 rounded-xl border p-2.5 text-left transition-colors focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
                active
                  ? "border-highlight/60 bg-highlight/5 ring-1 ring-highlight/30"
                  : "border-border/60 bg-surface/40 hover:border-border hover:bg-surface/60",
              )}
            >
              <ThemePreview id={option.id} />
              <span className="flex items-center gap-1.5 px-0.5">
                <Icon aria-hidden className="size-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">
                  {option.label}
                </span>
                {active && (
                  <CheckIcon
                    aria-hidden
                    className="ml-auto size-3.5 text-highlight"
                  />
                )}
              </span>
              <span className="block px-0.5 text-[11px] text-muted-foreground">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

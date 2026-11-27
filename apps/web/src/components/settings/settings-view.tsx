"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  DollarSignIcon,
  PaletteIcon,
  PlugIcon,
  SlidersHorizontalIcon,
  TriangleAlertIcon,
} from "lucide-react";

import { AppearanceSection } from "@/components/settings/appearance-section";
import { DangerSection } from "@/components/settings/danger-section";
import { DefaultsSection } from "@/components/settings/defaults-section";
import { PricingSection } from "@/components/settings/pricing-section";
import { ProvidersSection } from "@/components/settings/providers-section";
import { SaveBar } from "@/components/settings/save-bar";
import { cn } from "@/lib/utils";

const sections = [
  { id: "providers", label: "Providers", icon: PlugIcon },
  { id: "defaults", label: "Defaults", icon: SlidersHorizontalIcon },
  { id: "pricing", label: "Pricing", icon: DollarSignIcon },
  { id: "appearance", label: "Appearance", icon: PaletteIcon },
  { id: "danger", label: "Danger zone", icon: TriangleAlertIcon },
] as const;

type SectionId = (typeof sections)[number]["id"];

export function SettingsView() {
  const [section, setSection] = useState<SectionId>("providers");
  const [dirty, setDirty] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const markDirty = () => setDirty(true);

  function discard() {
    setResetKey((value) => value + 1);
    setDirty(false);
  }

  function save() {
    setDirty(false);
    toast.success("Settings saved");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-5 lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start">
        <nav
          aria-label="Settings sections"
          className="hidden lg:sticky lg:top-20 lg:block"
        >
          <ul className="flex flex-col gap-0.5">
            {sections.map((entry) => {
              const Icon = entry.icon;
              const active = section === entry.id;

              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSection(entry.id)}
                    className={cn(
                      "flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                      active
                        ? "bg-surface-2 text-foreground"
                        : "text-muted-foreground hover:bg-surface-2/50 hover:text-foreground",
                      entry.id === "danger" && active && "text-error",
                    )}
                  >
                    <Icon
                      aria-hidden
                      className={cn(
                        "size-4 shrink-0",
                        active && entry.id !== "danger" && "text-accent",
                      )}
                    />
                    <span className="truncate">{entry.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          role="group"
          aria-label="Settings sections"
          className="flex gap-1 overflow-x-auto pb-1 lg:hidden"
        >
          {sections.map((entry) => {
            const active = section === entry.id;
            return (
              <button
                key={entry.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSection(entry.id)}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center rounded-full border px-3 text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                  active
                    ? "border-highlight/60 bg-highlight/10 text-foreground"
                    : "border-border/60 bg-surface-2/20 text-muted-foreground",
                )}
              >
                {entry.label}
              </button>
            );
          })}
        </div>

        <div key={resetKey} id={`settings-${section}`} className="min-w-0">
          {section === "providers" && <ProvidersSection onDirty={markDirty} />}
          {section === "defaults" && <DefaultsSection onDirty={markDirty} />}
          {section === "pricing" && <PricingSection onDirty={markDirty} />}
          {section === "appearance" && <AppearanceSection onDirty={markDirty} />}
          {section === "danger" && <DangerSection />}
        </div>
      </div>

      <SaveBar dirty={dirty} onDiscard={discard} onSave={save} />
    </div>
  );
}

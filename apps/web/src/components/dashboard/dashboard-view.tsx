"use client";

import { useEffect, useState } from "react";
import {
  ActivityIcon,
  CoinsIcon,
  HashIcon,
  RotateCwIcon,
  TimerIcon,
} from "lucide-react";

import {
  CostPerModelChart,
  LatencyOverTimeChart,
  TokensPerModelChart,
  WinRateChart,
} from "@/components/dashboard/charts";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { DashboardStatesPreview } from "@/components/dashboard/dashboard-states";
import { InsightCard, RecentRuns } from "@/components/dashboard/dashboard-panels";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  dashboardSparkline,
  type DashboardRange,
} from "@/mocks/data";

const ranges: Array<{ id: DashboardRange; label: string }> = [
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
  { id: "90d", label: "90d" },
];

export function DashboardView() {
  const [range, setRange] = useState<DashboardRange>("7d");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) {
      return;
    }
    const timer = window.setTimeout(() => setLoading(false), 1200);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Dashboard"
        description="Usage, spend and judge agreement across every run."
        actions={
          <>
            <div
              role="group"
              aria-label="Time range"
              className="flex items-center gap-0.5 rounded-lg border border-border/60 bg-surface/50 p-0.5"
            >
              {ranges.map((option) => {
                const active = range === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setRange(option.id)}
                    className={cn(
                      "inline-flex h-7 min-w-10 items-center justify-center rounded-md px-2 font-mono text-[11px] transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                      active
                        ? "bg-surface-2 text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Refresh data"
              aria-busy={loading || undefined}
              onClick={() => setLoading(true)}
              className="border-border/60 bg-surface/50 text-muted-foreground hover:text-foreground"
            >
              <RotateCwIcon
                aria-hidden
                className={cn(loading && "animate-spin")}
              />
            </Button>
          </>
        }
      />

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total runs"
              value="128"
              hint={`${range} · 4 workspaces`}
              icon={ActivityIcon}
              delta={{ value: "18.2%", direction: "up", tone: "positive" }}
              sparkline={dashboardSparkline.runs}
            />
            <StatCard
              label="Total tokens"
              value="1.84M"
              hint="72% output"
              icon={HashIcon}
              delta={{ value: "12.4%", direction: "up", tone: "neutral" }}
              sparkline={dashboardSparkline.tokens}
            />
            <StatCard
              label="Total cost"
              value="$4.54"
              hint="Budget $12.00"
              icon={CoinsIcon}
              delta={{ value: "8.6%", direction: "up", tone: "negative" }}
              sparkline={dashboardSparkline.cost}
            />
            <StatCard
              label="Avg latency"
              value="3.42s"
              hint="Fastest: gemini"
              icon={TimerIcon}
              delta={{ value: "9.8%", direction: "down", tone: "positive" }}
              sparkline={dashboardSparkline.latency}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <CostPerModelChart />
            <LatencyOverTimeChart />
            <TokensPerModelChart />
            <WinRateChart />
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
            <RecentRuns />
            <InsightCard />
          </div>
        </>
      )}

      <DashboardStatesPreview />
    </div>
  );
}

"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { providerColorVar } from "@/components/shared/model-badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  dashboardLatencySeries,
  dashboardModelTokens,
  dashboardWinRates,
  modelUsage,
  models,
} from "@/mocks/data";

type TooltipItem = {
  name?: string | number;
  value?: string | number;
  color?: string;
};

export function ChartTooltip({
  active,
  payload,
  label,
  format,
}: {
  active?: boolean;
  payload?: TooltipItem[];
  label?: string | number;
  format?: (value: number) => string;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border/80 bg-popover px-2.5 py-2 shadow-lg">
      <p className="mb-1 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </p>
      <ul className="space-y-1">
        {payload.map((item) => (
          <li
            key={`${item.name}-${item.color}`}
            className="flex items-center gap-2 font-mono text-[11px]"
          >
            <span
              aria-hidden
              className="size-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{item.name}</span>
            <span className="ml-auto text-foreground tabular-nums">
              {typeof item.value === "number" && format
                ? format(item.value)
                : item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const axisTick = { fill: "var(--text-muted)", fontSize: 10 };

function ChartCard({
  title,
  description,
  legend,
  children,
  className,
}: {
  title: string;
  description: string;
  legend?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "gap-3 border border-border/60 bg-surface/40 py-4 ring-0",
        className,
      )}
    >
      <CardHeader className="gap-1 px-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardDescription className="text-[11px]">
          {description}
        </CardDescription>
      </CardHeader>
      <div className="h-52 w-full px-1">{children}</div>
      {legend && (
        <ul className="flex flex-wrap gap-x-3 gap-y-1 border-t border-border/40 px-4 pt-2.5">
          {legend}
        </ul>
      )}
    </Card>
  );
}

export function CostPerModelChart() {
  const data = modelUsage.map((usage) => {
    const model = models.find((entry) => entry.id === usage.modelId);
    return {
      name: model?.name ?? usage.modelId,
      cost: Number(usage.costUsd.toFixed(2)),
      color: model ? providerColorVar[model.provider] : "var(--steel)",
    };
  });

  return (
    <ChartCard
      title="Cost per model"
      description="Spend in USD over the selected range"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid
            stroke="var(--border)"
            strokeOpacity={0.6}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={axisTick}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            interval={0}
          />
          <YAxis
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `$${value}`}
          />
          <Tooltip
            cursor={{ fill: "var(--surface-2)", opacity: 0.4 }}
            content={<ChartTooltip format={(value) => `$${value.toFixed(2)}`} />}
          />
          <Bar dataKey="cost" name="cost" radius={[4, 4, 0, 0]} maxBarSize={44}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function LatencyOverTimeChart() {
  const data = dashboardLatencySeries.map((point) => {
    const row: Record<string, string | number> = { label: point.label };
    point.values.forEach((value, index) => {
      row[`m${index}`] = value;
    });
    return row;
  });

  return (
    <ChartCard
      title="Latency over time"
      description="Average time to the last token, per model"
      legend={models.map((model) => (
        <li
          key={model.id}
          className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground"
        >
          <span
            aria-hidden
            className="size-1.5 rounded-full"
            style={{ backgroundColor: providerColorVar[model.provider] }}
          />
          {model.name}
        </li>
      ))}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid
            stroke="var(--border)"
            strokeOpacity={0.6}
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={axisTick}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            minTickGap={16}
          />
          <YAxis
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}s`}
          />
          <Tooltip
            content={
              <ChartTooltip
                format={(value) => `${(value / 1000).toFixed(2)}s`}
              />
            }
          />
          {models.map((model, index) => (
            <Line
              key={model.id}
              dataKey={`m${index}`}
              name={model.name}
              stroke={providerColorVar[model.provider]}
              strokeWidth={1.75}
              dot={false}
              activeDot={{ r: 3 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function TokensPerModelChart() {
  const data = dashboardModelTokens.map((entry) => {
    const model = models.find((row) => row.id === entry.modelId);
    return {
      name: model?.name ?? entry.modelId,
      input: Math.round(entry.tokensIn / 1000),
      output: Math.round(entry.tokensOut / 1000),
    };
  });

  return (
    <ChartCard
      title="Tokens in vs out"
      description="Thousands of tokens per model"
      legend={
        <>
          <li className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <span aria-hidden className="size-1.5 rounded-full bg-steel" />
            input
          </li>
          <li className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <span aria-hidden className="size-1.5 rounded-full bg-highlight" />
            output
          </li>
        </>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid
            stroke="var(--border)"
            strokeOpacity={0.6}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={axisTick}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            interval={0}
          />
          <YAxis tick={axisTick} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: "var(--surface-2)", opacity: 0.4 }}
            content={
              <ChartTooltip format={(value) => `${value}k tokens`} />
            }
          />
          <Bar
            dataKey="input"
            name="input"
            stackId="tokens"
            fill="var(--steel)"
            radius={[0, 0, 0, 0]}
            maxBarSize={44}
          />
          <Bar
            dataKey="output"
            name="output"
            stackId="tokens"
            fill="var(--highlight)"
            radius={[4, 4, 0, 0]}
            maxBarSize={44}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function WinRateChart() {
  const data = dashboardWinRates.map((entry) => {
    const model = models.find((row) => row.id === entry.modelId);
    return {
      name: model?.name ?? entry.modelId,
      winRate: entry.winRate,
      wins: entry.wins,
      runs: entry.runs,
      top: entry.modelId === dashboardWinRates[0]?.modelId,
    };
  });

  return (
    <ChartCard
      title="Win rate per model"
      description="Share of runs where the judge picked this model"
      legend={
        <>
          <li className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <span aria-hidden className="size-1.5 rounded-full bg-highlight" />
            best model
          </li>
          <li className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <span aria-hidden className="size-1.5 rounded-full bg-steel" />
            everyone else
          </li>
        </>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 20, left: 12, bottom: 0 }}
        >
          <CartesianGrid
            stroke="var(--border)"
            strokeOpacity={0.6}
            horizontal={false}
          />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={axisTick}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            tickFormatter={(value: number) => `${value}%`}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={104}
            tick={axisTick}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--surface-2)", opacity: 0.4 }}
            content={
              <ChartTooltip format={(value) => `${value}% win rate`} />
            }
          />
          <Bar
            dataKey="winRate"
            name="win rate"
            radius={[0, 4, 4, 0]}
            maxBarSize={18}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.top ? "var(--highlight)" : "var(--steel)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

import { cn } from "@/lib/utils";
import type { BrochureCallLogEntry, Model } from "@/mocks/data";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatLatency(ms: number) {
  return ms >= 10_000 ? `${(ms / 1000).toFixed(1)}s` : `${(ms / 1000).toFixed(2)}s`;
}

function formatCost(usd: number) {
  return usd === 0 ? "$0" : `$${usd.toFixed(4)}`;
}

export type CallLogProps = {
  entries: BrochureCallLogEntry[];
  models: Model[];
  className?: string;
};

export function CallLog({ entries, models, className }: CallLogProps) {
  const modelById = new Map(models.map((model) => [model.id, model]));
  const totals = entries.reduce(
    (sum, entry) => ({
      tokensIn: sum.tokensIn + entry.tokensIn,
      tokensOut: sum.tokensOut + entry.tokensOut,
      latencyMs: sum.latencyMs + entry.latencyMs,
      costUsd: sum.costUsd + entry.costUsd,
    }),
    { tokensIn: 0, tokensOut: 0, latencyMs: 0, costUsd: 0 },
  );

  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-border/60 bg-surface/40",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 px-4 py-3">
        <h2 className="text-sm font-medium text-foreground">Call log</h2>
        <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          chained calls · {entries.length} steps
        </span>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/40 hover:bg-transparent">
              {["Call", "Model", "Tokens in", "Tokens out", "Latency", "Cost"].map(
                (heading) => (
                  <TableHead
                    key={heading}
                    className="font-mono text-[10px] tracking-[0.12em] whitespace-nowrap uppercase"
                  >
                    {heading}
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id} className="border-border/30">
                <TableCell className="font-mono text-[11px] whitespace-nowrap text-foreground">
                  {entry.call}
                </TableCell>
                <TableCell className="font-mono text-[11px] whitespace-nowrap text-muted-foreground">
                  {modelById.get(entry.modelId)?.name ?? entry.modelId}
                </TableCell>
                <TableCell className="font-mono text-[11px] text-foreground/80 tabular-nums">
                  {entry.tokensIn.toLocaleString()}
                </TableCell>
                <TableCell className="font-mono text-[11px] text-foreground/80 tabular-nums">
                  {entry.tokensOut.toLocaleString()}
                </TableCell>
                <TableCell className="font-mono text-[11px] text-foreground/80 tabular-nums">
                  {formatLatency(entry.latencyMs)}
                </TableCell>
                <TableCell className="font-mono text-[11px] text-foreground/80 tabular-nums">
                  {formatCost(entry.costUsd)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="border-border/40 bg-surface-2/20">
            <TableRow className="hover:bg-transparent">
              <TableCell className="font-mono text-[11px] font-medium text-foreground">
                Total
              </TableCell>
              <TableCell className="font-mono text-[11px] text-muted-foreground">
                {entries.length} calls
              </TableCell>
              <TableCell className="font-mono text-[11px] font-medium text-foreground tabular-nums">
                {totals.tokensIn.toLocaleString()}
              </TableCell>
              <TableCell className="font-mono text-[11px] font-medium text-foreground tabular-nums">
                {totals.tokensOut.toLocaleString()}
              </TableCell>
              <TableCell className="font-mono text-[11px] font-medium text-foreground tabular-nums">
                {formatLatency(totals.latencyMs)}
              </TableCell>
              <TableCell className="font-mono text-[11px] font-medium text-foreground tabular-nums">
                {formatCost(totals.costUsd)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </section>
  );
}

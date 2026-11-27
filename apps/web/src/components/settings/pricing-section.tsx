"use client";

import { useState } from "react";

import { providerDotClass } from "@/components/shared/model-badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { models } from "@/mocks/data";

type PriceRow = {
  id: string;
  input: string;
  output: string;
};

function formatContext(tokens: number) {
  return tokens >= 1000 ? `${Math.round(tokens / 1000)}k` : `${tokens}`;
}

export function PricingSection({ onDirty }: { onDirty: () => void }) {
  const [rows, setRows] = useState<PriceRow[]>(() =>
    models.map((model) => ({
      id: model.id,
      input: model.pricePer1mInput.toFixed(2),
      output: model.pricePer1mOutput.toFixed(2),
    })),
  );

  function update(id: string, field: "input" | "output", value: string) {
    const clean = value.replace(/[^0-9.]/g, "");
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: clean } : row)),
    );
    onDirty();
  }

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-base font-medium text-foreground">Pricing</h2>
        <p className="text-[13px] text-muted-foreground">
          USD per 1M tokens. Used for cost estimates and guardrails.
        </p>
      </div>

      <Card className="gap-0 overflow-hidden border border-border/60 bg-surface/40 py-0 ring-0">
        <CardHeader className="border-b border-border/50 px-4 py-3">
          <CardTitle className="text-sm font-medium">Price table</CardTitle>
          <CardDescription className="font-mono text-[10px] tracking-[0.14em] uppercase">
            {rows.length} models · editable
          </CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="pl-4 font-mono text-[10px] tracking-[0.12em] uppercase">
                  Model
                </TableHead>
                <TableHead className="font-mono text-[10px] tracking-[0.12em] uppercase">
                  Input / 1M
                </TableHead>
                <TableHead className="font-mono text-[10px] tracking-[0.12em] uppercase">
                  Output / 1M
                </TableHead>
                <TableHead className="pr-4 text-right font-mono text-[10px] tracking-[0.12em] uppercase">
                  Context
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model) => {
                const row = rows.find((entry) => entry.id === model.id);
                if (!row) {
                  return null;
                }

                return (
                  <TableRow key={model.id} className="border-border/30">
                    <TableCell className="pl-4">
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden
                          className={`size-2 rounded-full ${providerDotClass[model.provider]}`}
                        />
                        <span className="font-mono text-[11px] text-foreground">
                          {model.name}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="relative w-24">
                        <span
                          aria-hidden
                          className="absolute top-1/2 left-2 -translate-y-1/2 font-mono text-[10px] text-muted-foreground"
                        >
                          $
                        </span>
                        <Input
                          aria-label={`${model.name} input price`}
                          inputMode="decimal"
                          value={row.input}
                          onChange={(event) =>
                            update(model.id, "input", event.target.value)
                          }
                          className="h-7 pl-5 font-mono text-[11px] tabular-nums"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="relative w-24">
                        <span
                          aria-hidden
                          className="absolute top-1/2 left-2 -translate-y-1/2 font-mono text-[10px] text-muted-foreground"
                        >
                          $
                        </span>
                        <Input
                          aria-label={`${model.name} output price`}
                          inputMode="decimal"
                          value={row.output}
                          onChange={(event) =>
                            update(model.id, "output", event.target.value)
                          }
                          className="h-7 pl-5 font-mono text-[11px] tabular-nums"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="pr-4 text-right font-mono text-[11px] text-muted-foreground tabular-nums">
                      {formatContext(model.contextWindow)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </section>
  );
}

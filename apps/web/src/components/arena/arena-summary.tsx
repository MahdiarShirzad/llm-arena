import { ClockIcon, CoinsIcon, HashIcon } from "lucide-react";

import { StatCard } from "@/components/shared/stat-card";
import type { ArenaSummaryItem } from "@/mocks/data";

const summaryIcon = {
  fastest: ClockIcon,
  cheapest: CoinsIcon,
  tokens: HashIcon,
};

export function ArenaSummary({ items }: { items: ArenaSummaryItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <StatCard
          key={item.id}
          label={item.label}
          value={item.value}
          hint={item.hint}
          icon={summaryIcon[item.id]}
        />
      ))}
    </div>
  );
}

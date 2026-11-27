"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { cn } from "@/lib/utils";

const TokenAreaChart = dynamic(
  () => import("./token-area-chart").then((module) => module.TokenAreaChart),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full animate-pulse" />,
  },
);

const MODES = [
  { value: "tokens", label: "Tokens" },
  { value: "cost", label: "Cost" },
];

export function TokenChart({ chart }) {
  const [mode, setMode] = useState("tokens");
  const isCost = mode === "cost";

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium text-foreground">Weekly tokens &amp; cost</h3>
        <div
          className="flex h-7 items-center rounded-lg border border-border/75 bg-muted/35 p-0.5"
          role="group"
          aria-label="Chart metric"
        >
          {MODES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => setMode(value)}
              className={cn(
                "grid h-6 cursor-pointer place-items-center rounded-md px-2.5 text-xs font-medium transition-[background-color,color,box-shadow] duration-100",
                mode === value
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 h-96">
        <TokenAreaChart
          data={isCost ? chart.costRows : chart.rows}
          clientData={isCost ? chart.clientCostRows : chart.clientRows}
          keys={chart.keys}
          labels={chart.labels}
          clientKeys={chart.clientKeys}
          clientLabels={chart.clientLabels}
          otherModelsByWeek={chart.otherModelsByWeek}
          otherKey="other"
          mode={mode}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}

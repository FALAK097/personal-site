"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { cn } from "@/lib/utils";

const TokenAreaChart = dynamic(
  () => import("./token-area-chart").then((module) => module.TokenAreaChart),
  {
    ssr: false,
    loading: () => <div className="h-72 w-full animate-pulse rounded-lg bg-muted/40" />,
  },
);

const MODES = [
  { value: "tokens", label: "Tokens" },
  { value: "cost", label: "Cost" },
];

export function TokenChart({ rows, costRows, keys, labels }) {
  const [mode, setMode] = useState("tokens");
  const data = mode === "cost" ? costRows : rows;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium">Weekly tokens &amp; cost</h3>
        <div
          className="flex h-8 items-center rounded-md border border-border/80 bg-muted/40 p-0.5"
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
                "grid h-7 cursor-pointer place-items-center rounded-[5px] px-2.5 text-xs font-medium transition-[background-color,color,box-shadow] duration-100",
                mode === value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-80">
        <TokenAreaChart data={data} keys={keys} labels={labels} mode={mode} className="h-full w-full" />
      </div>
    </div>
  );
}

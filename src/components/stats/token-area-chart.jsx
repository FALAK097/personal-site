"use client";

import { EChartsAreaChart } from "@/components/evilcharts/charts/echarts-area-chart";

const PALETTE = [
  { light: "#2f7fb8", dark: "#5cbeff" },
  { light: "#6d4fc4", dark: "#c4a4ff" },
  { light: "#0f766e", dark: "#5eead4" },
  { light: "#b45309", dark: "#fbbf24" },
  { light: "#9f1239", dark: "#fb7185" },
  { light: "#4d7c0f", dark: "#a3e635" },
  { light: "#64748b", dark: "#94a3b8" },
];

const tokenFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const tokenTickFormatter = (value) => {
  const absolute = Math.abs(value);
  if (absolute >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (absolute >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  if (absolute >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return `${value}`;
};

const costTickFormatter = (value) => `$${Math.round(value)}`;

const dateTickFormatter = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
};

function buildTooltipFormatter({ keys, labels, isCost }) {
  const formatValue = isCost
    ? (value) => currencyFormatter.format(value)
    : (value) => tokenFormatter.format(value);

  return (params) => {
    const rows = Array.isArray(params) ? params : [params];
    if (!rows.length) return "";

    const axisValue = rows[0]?.axisValue ?? rows[0]?.name ?? "";
    const heading = dateTickFormatter(String(axisValue));

    const entries = rows
      .map((row) => {
        const key = String(row.seriesId ?? row.seriesName ?? "");
        const value = typeof row.value === "number" ? row.value : Number(row.value);
        if (!Number.isFinite(value) || value <= 0) return null;
        return { key, label: labels[key] ?? row.seriesName ?? key, value };
      })
      .filter(Boolean)
      .sort((a, b) => b.value - a.value);

    if (!entries.length) return "";

    const body = entries
      .map(
        ({ key, label, value }) => `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;">
          <span style="display:flex;align-items:center;gap:6px;min-width:0;">
            <span style="width:8px;height:8px;border-radius:2px;flex-shrink:0;background:${
              keys.includes(key) ? `var(--color-${key}-0)` : "currentColor"
            };"></span>
            <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${label}</span>
          </span>
          <span style="font-variant-numeric:tabular-nums;white-space:nowrap;">${formatValue(value)}</span>
        </div>`,
      )
      .join("");

    return `
      <div style="border:1px solid rgba(127,127,127,0.2);border-radius:10px;background:rgba(20,20,24,0.92);padding:8px 10px;font-size:12px;line-height:1.5;color:#fafafa;box-shadow:0 8px 24px rgba(0,0,0,0.35);backdrop-filter:blur(8px);min-width:180px;">
        <div style="margin-bottom:6px;font-size:11px;opacity:0.7;">${heading}</div>
        <div style="display:flex;flex-direction:column;gap:4px;">${body}</div>
      </div>`;
  };
}

export function TokenAreaChart({ data, keys, labels, mode, className }) {
  const config = {};

  keys.forEach((key, index) => {
    const color = PALETTE[index % PALETTE.length];
    config[key] = {
      label: labels[key] ?? key,
      colors: { light: [color.light], dark: [color.dark] },
    };
  });

  const isCost = mode === "cost";
  const tickFormatter = isCost ? costTickFormatter : tokenTickFormatter;

  return (
    <EChartsAreaChart
      data={data}
      config={config}
      xDataKey="date"
      className={className}
      curveType="monotone"
      stackType="stacked"
      enableHoverHighlight
      chartOptions={{
        grid: { left: 0, right: 0, top: 68, bottom: 0 },
        tooltip: {
          show: true,
          trigger: "axis",
          confine: true,
          backgroundColor: "transparent",
          borderWidth: 0,
          padding: 0,
          extraCssText: "box-shadow:none;",
          axisPointer: { type: "none" },
          formatter: buildTooltipFormatter({ keys, labels, isCost }),
        },
      }}
    >
      <EChartsAreaChart.Grid />
      <EChartsAreaChart.XAxis dataKey="date" tickFormatter={dateTickFormatter} />
      <EChartsAreaChart.YAxis tickFormatter={tickFormatter} />
      <EChartsAreaChart.Legend variant="rounded-square" align="right" verticalAlign="top" isClickable />
      {keys.map((key) => (
        <EChartsAreaChart.Area key={key} dataKey={key} variant="solid" strokeVariant="solid" strokeWidth={1.5}>
          <EChartsAreaChart.ActiveDot variant="ping" />
        </EChartsAreaChart.Area>
      ))}
    </EChartsAreaChart>
  );
}

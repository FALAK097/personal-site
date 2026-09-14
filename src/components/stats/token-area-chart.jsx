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

const withCommas = (value) => value.toLocaleString("en-US");

function pickRow(rows, date) {
  if (!rows?.length || date === undefined) return null;
  return rows.find((row) => row.date === date) ?? null;
}

function rankEntries(row, keys, labels, formatValue, limit) {
  if (!row) return [];

  return keys
    .map((key) => {
      const value = typeof row[key] === "number" ? row[key] : Number(row[key] ?? 0);
      return { key, label: labels[key] ?? key, value };
    })
    .filter((entry) => Number.isFinite(entry.value) && entry.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function tooltipRows(entries, formatValue) {
  return entries
    .map(
      ({ label, value }) => `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:20px;">
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${label}</span>
        <span style="font-variant-numeric:tabular-nums;white-space:nowrap;">${formatValue(value)}</span>
      </div>`,
    )
    .join("");
}

function buildTooltipFormatter({
  data,
  clientData,
  otherByWeek,
  keys,
  labels,
  clientKeys,
  clientLabels,
  otherKey,
  isCost,
}) {
  const formatValue = isCost
    ? (value) => currencyFormatter.format(value)
    : (value) => tokenFormatter.format(value);

  return (params) => {
    const date = String(params?.[0]?.axisValue ?? "");
    const modelRow = pickRow(data, date);
    const clientRow = pickRow(clientData, date);
    if (!modelRow) return "";

    const total = keys.reduce((sum, key) => sum + (Number(modelRow[key]) || 0), 0);
    const clients = rankEntries(clientRow, clientKeys, clientLabels, formatValue, 5);

    // Named series first, then the models that share the grouped series — listed
    // by their real names (the chart legend still shows a single "other models").
    const namedModels = rankEntries(modelRow, keys, labels, formatValue, keys.length).filter(
      (entry) => entry.key !== otherKey,
    );
    const otherEntries = (otherByWeek?.[date] ?? [])
      .map((entry) => ({ label: entry.name, value: isCost ? entry.cost : entry.tokens }))
      .filter((entry) => Number.isFinite(entry.value) && entry.value > 0);
    const shownOthers = otherEntries.slice(0, 4);
    const hiddenOthers = otherEntries.length - shownOthers.length;
    const otherTotal = otherEntries.reduce((sum, entry) => sum + entry.value, 0);

    if (!total || (!clients.length && !namedModels.length && !shownOthers.length)) return "";

    const divider = `<div style="height:1px;background:currentColor;opacity:0.14;margin:7px 0;"></div>`;
    const heading = (text) =>
      `<div style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;opacity:0.5;margin-bottom:5px;">${text}</div>`;
    const indent = `<span style="display:inline-block;width:8px;flex-shrink:0;"></span>`;

    const modelRows = [
      ...namedModels,
      ...shownOthers.map((entry) => ({ ...entry, muted: true })),
    ]
      .map(
        ({ key, label, value, muted }) => `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:20px;">
        <span style="display:flex;align-items:center;gap:6px;min-width:0;">
          ${
            muted
              ? indent
              : `<span style="width:8px;height:8px;border-radius:2px;flex-shrink:0;background:var(--color-${key}-0);"></span>`
          }
          <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;${muted ? "opacity:0.75;" : ""}">${label}</span>
        </span>
        <span style="font-variant-numeric:tabular-nums;white-space:nowrap;${muted ? "opacity:0.75;" : ""}">${formatValue(value)}</span>
      </div>`,
      )
      .join("");

    const othersNote =
      hiddenOthers > 0
        ? `<div style="display:flex;align-items:center;justify-content:space-between;gap:20px;opacity:0.55;">
             <span style="display:flex;align-items:center;gap:6px;">${indent}<span>+${hiddenOthers} more</span></span>
             <span style="font-variant-numeric:tabular-nums;">${formatValue(otherTotal - shownOthers.reduce((sum, entry) => sum + entry.value, 0))}</span>
           </div>`
        : "";

    return `
      <div style="border:1px solid rgba(127,127,127,0.22);border-radius:10px;background:rgba(20,20,24,0.94);padding:9px 11px;font-size:12px;line-height:1.5;color:#fafafa;box-shadow:0 10px 30px rgba(0,0,0,0.4);backdrop-filter:blur(8px);min-width:220px;">
        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:16px;">
          <span style="font-size:11px;opacity:0.7;">${dateTickFormatter(date)}</span>
          <span style="font-weight:600;font-variant-numeric:tabular-nums;">${formatValue(total)}</span>
        </div>
        ${
          clients.length
            ? `${divider}${heading("clients")}<div style="display:flex;flex-direction:column;gap:4px;">${tooltipRows(clients, formatValue)}</div>`
            : ""
        }
        ${divider}${heading("models")}
        <div style="display:flex;flex-direction:column;gap:4px;">${modelRows}${othersNote}</div>
      </div>`;
  };
}

export function TokenAreaChart({
  data,
  clientData,
  otherModelsByWeek,
  otherKey,
  keys,
  labels,
  clientKeys,
  clientLabels,
  mode,
  className,
}) {
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
          formatter: buildTooltipFormatter({
            data,
            clientData,
            otherByWeek: otherModelsByWeek,
            keys,
            labels,
            clientKeys,
            clientLabels,
            otherKey,
            isCost,
          }),
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

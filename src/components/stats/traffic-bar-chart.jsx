"use client";

import { EChartsBarChart } from "@/components/evilcharts/charts/echarts-bar-chart";

const config = {
  pageviews: {
    label: "pageviews",
    colors: { light: ["#2f7fb8"], dark: ["#5cbeff"] },
  },
  visitors: {
    label: "visitors",
    colors: { light: ["#6d4fc4"], dark: ["#c4a4ff"] },
  },
};

const numberFormatter = new Intl.NumberFormat("en-US");

const tickFormatter = (value) => {
  const absolute = Math.abs(value);
  if (absolute >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (absolute >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return `${value}`;
};

const dateTickFormatter = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(date);
};

const dateLabelFormatter = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
};

function buildTooltipFormatter() {
  return (params) => {
    const rows = Array.isArray(params) ? params : [params];
    if (!rows.length) return "";

    const date = String(rows[0]?.axisValue ?? "");
    const body = rows
      .map((row) => {
        const key = String(row.seriesId ?? row.seriesName ?? "");
        const label = config[key]?.label ?? row.seriesName ?? key;
        const value = typeof row.value === "number" ? row.value : Number(row.value);
        if (!Number.isFinite(value)) return "";
        return `
          <div style="display:flex;align-items:center;justify-content:space-between;gap:18px;">
            <span style="display:flex;align-items:center;gap:6px;">
              <span style="width:8px;height:8px;border-radius:2px;background:var(--color-${key}-0);"></span>
              <span>${label}</span>
            </span>
            <span style="font-variant-numeric:tabular-nums;">${numberFormatter.format(value)}</span>
          </div>`;
      })
      .join("");

    return `
      <div style="border:1px solid rgba(127,127,127,0.22);border-radius:10px;background:rgba(20,20,24,0.94);padding:9px 11px;font-size:12px;line-height:1.5;color:#fafafa;box-shadow:0 10px 30px rgba(0,0,0,0.4);backdrop-filter:blur(8px);min-width:180px;">
        <div style="margin-bottom:5px;font-size:11px;opacity:0.7;">${dateLabelFormatter(date)}</div>
        <div style="display:flex;flex-direction:column;gap:4px;">${body}</div>
      </div>`;
  };
}

export function TrafficBarChart({ data, className }) {
  return (
    <EChartsBarChart
      data={data}
      config={config}
      xDataKey="date"
      className={className}
      barCategoryGap={10}
      chartOptions={{
        grid: { left: 0, right: 0, top: 34, bottom: 0 },
        tooltip: {
          show: true,
          trigger: "axis",
          confine: true,
          backgroundColor: "transparent",
          borderWidth: 0,
          padding: 0,
          extraCssText: "box-shadow:none;",
          axisPointer: { type: "none" },
          formatter: buildTooltipFormatter(),
        },
      }}
    >
      <EChartsBarChart.Grid />
      <EChartsBarChart.XAxis dataKey="date" tickFormatter={dateTickFormatter} />
      <EChartsBarChart.YAxis tickFormatter={tickFormatter} />
      <EChartsBarChart.Legend variant="rounded-square" align="right" verticalAlign="top" isClickable />
      <EChartsBarChart.Bar dataKey="pageviews" radius={3} />
      <EChartsBarChart.Bar dataKey="visitors" radius={3} />
    </EChartsBarChart>
  );
}

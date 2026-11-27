"use client";

import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatCompact, formatExact } from "@/lib/traffic-formatters";
import { cn } from "@/lib/utils";

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

const SERIES_META = {
  pageviews: {
    label: "Requests",
    light: "#2563eb",
    dark: "#5cbeff",
  },
  visitors: {
    label: "Visits",
    light: "#0d9488",
    dark: "#2dd4bf",
  },
};

function formatAxisTick(value) {
  const numeric = Number(value) || 0;
  if (numeric >= 1_000_000) return `${(numeric / 1_000_000).toFixed(1)}M`;
  if (numeric >= 1_000) return `${(numeric / 1_000).toFixed(numeric % 1_000 === 0 ? 0 : 1)}k`;
  return `${numeric}`;
}

function formatShortDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatFullDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const int = Number.parseInt(clean, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildSeriesForKey({ key, keyIndex, activeCount, data, isDark, bgSurface, hasPartialEdges }) {
  const meta = SERIES_META[key];
  const stroke = isDark ? meta.dark : meta.light;
  const fillOpacityTop = activeCount === 1 ? 0.18 : keyIndex === 0 ? 0.14 : 0.08;
  const values = data.map((row) => Number(row[key]) || 0);
  const n = values.length;

  const areaGradient = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: hexToRgba(stroke, fillOpacityTop) },
    { offset: 1, color: hexToRgba(stroke, 0) },
  ]);

  if (!hasPartialEdges) {
    return [
      {
        id: key,
        name: meta.label,
        type: "line",
        data: values,
        smooth: 0.2,
        showSymbol: false,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: { color: stroke, width: 2 },
        itemStyle: { color: stroke, borderColor: bgSurface, borderWidth: 2 },
        areaStyle: { color: areaGradient },
        z: 3 - keyIndex,
      },
    ];
  }

  const solidValues = values.map((val, idx) => (idx === 0 || idx === n - 1 ? null : val));
  const edgeValues = values.map((val, idx) => (idx <= 1 || idx >= n - 2 ? val : null));

  return [
    {
      id: key,
      name: meta.label,
      type: "line",
      data: solidValues,
      smooth: 0.18,
      connectNulls: false,
      showSymbol: false,
      symbol: "circle",
      symbolSize: 7,
      lineStyle: { color: stroke, width: 2 },
      itemStyle: { color: stroke, borderColor: bgSurface, borderWidth: 2 },
      areaStyle: { color: areaGradient },
      z: 4 - keyIndex,
    },
    {
      id: `__edge-${key}`,
      name: meta.label,
      type: "line",
      data: edgeValues,
      smooth: 0.18,
      connectNulls: false,
      showSymbol: false,
      symbol: "circle",
      symbolSize: 7,
      lineStyle: { color: stroke, width: 2, type: [4, 4] },
      itemStyle: { color: stroke, borderColor: bgSurface, borderWidth: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: hexToRgba(stroke, fillOpacityTop * 0.65) },
          { offset: 1, color: hexToRgba(stroke, 0) },
        ]),
      },
      z: 3 - keyIndex,
    },
  ];
}

function formatLineTooltip(params, data, activeKeys, isDark) {
  const first = Array.isArray(params) ? params[0] : params;
  const idx = first?.dataIndex;
  const point = idx != null ? data[idx] : null;
  if (!point) return "";

  const rowsHtml = activeKeys
    .map((key) => {
      const meta = SERIES_META[key];
      const color = isDark ? meta.dark : meta.light;
      const val = Number(point[key]) || 0;
      return `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:20px;">
          <span style="display:flex;align-items:center;gap:6px;color:rgba(250,250,250,0.78);">
            <span style="width:7px;height:7px;border-radius:999px;background:${color};"></span>
            <span>${meta.label}</span>
          </span>
          <span style="font-family:var(--font-geist-mono),monospace;font-weight:500;font-variant-numeric:tabular-nums;">${formatExact(val)}</span>
        </div>`;
    })
    .join("");

  const ratio =
    activeKeys.length === 2 && point.visitors > 0
      ? `<div style="margin-top:5px;padding-top:5px;border-top:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;gap:16px;font-size:11px;color:rgba(250,250,250,0.58);">
           <span>Requests / visit</span>
           <span style="font-family:var(--font-geist-mono),monospace;font-variant-numeric:tabular-nums;">${(point.pageviews / point.visitors).toFixed(2)}×</span>
         </div>`
      : "";

  const partialBadge = point.isPartial
    ? `<span style="margin-left:6px;font-size:10px;opacity:0.55;">(partial UTC day)</span>`
    : "";

  return `
    <div style="border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:rgba(20,20,24,0.95);padding:9px 11px;font-size:12px;line-height:1.45;color:#fafafa;box-shadow:0 12px 32px rgba(0,0,0,0.42);backdrop-filter:blur(8px);min-width:190px;">
      <div style="margin-bottom:6px;font-size:11px;color:rgba(250,250,250,0.7);">${formatFullDate(point.date)}${partialBadge}</div>
      <div style="display:flex;flex-direction:column;gap:4px;">${rowsHtml}</div>
      ${ratio}
    </div>`;
}

function buildLineChartOption(data, activeKeys, isDark) {
  const axisColor = isDark ? "rgba(161, 161, 170, 0.85)" : "rgba(113, 113, 122, 0.9)";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(24, 24, 27, 0.08)";
  const pointerColor = isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(24, 24, 27, 0.18)";
  const bgSurface = isDark ? "#1a1a1a" : "#ffffff";
  const categories = data.map((row) => row.date);
  const hasPartialEdges =
    data.length >= 4 && Boolean(data[0]?.isPartial || data[data.length - 1]?.isPartial);

  const builtSeries = activeKeys.flatMap((key, keyIndex) =>
    buildSeriesForKey({
      key,
      keyIndex,
      activeCount: activeKeys.length,
      data,
      isDark,
      bgSurface,
      hasPartialEdges,
    }),
  );

  return {
    animationDuration: 450,
    animationEasing: "cubicOut",
    grid: {
      left: 6,
      right: 10,
      top: 14,
      bottom: 4,
      outerBoundsMode: "same",
      outerBoundsContain: "axisLabel",
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: categories,
      axisLine: { show: false },
      axisTick: { show: true, alignWithLabel: true, length: 3, lineStyle: { color: gridColor } },
      axisLabel: {
        color: axisColor,
        fontSize: 10,
        margin: 10,
        interval: Math.max(Math.floor(categories.length / 7) - 1, 2),
        formatter: (val) => formatShortDate(val),
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      splitNumber: 4,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true, lineStyle: { color: gridColor, type: [4, 4], width: 1 } },
      axisLabel: {
        color: axisColor,
        fontSize: 10,
        margin: 10,
        formatter: (val) => formatAxisTick(val),
      },
    },
    tooltip: {
      trigger: "axis",
      confine: true,
      backgroundColor: "transparent",
      borderWidth: 0,
      padding: 0,
      extraCssText: "box-shadow:none;",
      axisPointer: {
        type: "line",
        lineStyle: { color: pointerColor, width: 1, type: [3, 3] },
      },
      formatter: (params) => formatLineTooltip(params, data, activeKeys, isDark),
    },
    series: builtSeries,
  };
}

export function TrafficLineChart({ data = [], totals }) {
  const mountRef = useRef(null);
  const chartRef = useRef(null);
  const { resolvedTheme } = useTheme();
  const [focusKey, setFocusKey] = useState("all");

  const isDark = resolvedTheme === "dark";

  const activeKeys = useMemo(() => {
    if (focusKey === "pageviews") return ["pageviews"];
    if (focusKey === "visitors") return ["visitors"];
    return ["pageviews", "visitors"];
  }, [focusKey]);

  useEffect(() => {
    const node = mountRef.current;
    if (!node) return undefined;

    const instance = echarts.init(node, null, { renderer: "canvas" });
    chartRef.current = instance;

    const observer = new ResizeObserver(() => {
      instance.resize();
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
      instance.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const instance = chartRef.current;
    if (!instance || !data.length) return;
    instance.setOption(buildLineChartOption(data, activeKeys, isDark), { notMerge: true });
  }, [data, activeKeys, isDark]);

  const tabs = [
    { id: "all", label: "Combined", dot: null, count: null },
    {
      id: "pageviews",
      label: "Requests",
      dot: isDark ? SERIES_META.pageviews.dark : SERIES_META.pageviews.light,
      count: formatCompact(totals?.pageviews ?? 0),
    },
    {
      id: "visitors",
      label: "Visits",
      dot: isDark ? SERIES_META.visitors.dark : SERIES_META.visitors.light,
      count: formatCompact(totals?.visitors ?? 0),
    },
  ];

  return (
    <div className="rounded-xl border border-border/75 bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="text-xs font-medium text-foreground">Traffic over time</h3>
          <p className="text-[11px] text-muted-foreground">
            Dashed edges indicate partial UTC days at window boundaries
          </p>
        </div>

        <div
          className="flex flex-wrap items-center gap-1 rounded-lg border border-border/75 bg-muted/35 p-0.5"
          role="group"
          aria-label="Traffic chart series"
        >
          {tabs.map((tab) => {
            const active = focusKey === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFocusKey(tab.id)}
                className={cn(
                  "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors duration-100",
                  active
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.dot ? (
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: tab.dot }}
                    aria-hidden="true"
                  />
                ) : null}
                <span>{tab.label}</span>
                {tab.count ? (
                  <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                    {tab.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div ref={mountRef} className="mt-3 h-56 w-full" />
    </div>
  );
}

"use client";

import { BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatCompact, formatExact } from "@/lib/traffic-formatters";
import { cn } from "@/lib/utils";

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

const DEVICE_META = [
  { key: "desktop", label: "Desktop", light: "#2563eb", dark: "#4daeff" },
  { key: "mobile", label: "Mobile", light: "#f59e0b", dark: "#fbbf24" },
  { key: "tablet", label: "Tablet", light: "#ec4899", dark: "#fb7185" },
];

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

function rowMetricOf(row, metric) {
  return (metric === "visitors" ? row.visitors : row.pageviews) ?? 0;
}

function formatDeviceTooltip(params, data, visibleDevices, selectedDevice, metric, isDark) {
  const first = Array.isArray(params) ? params[0] : params;
  const idx = first?.dataIndex;
  const point = idx != null ? data[idx] : null;
  if (!point) return "";

  const dataKeyFor = (dev) => (metric === "visitors" ? `${dev.key}Visitors` : dev.key);
  const dayTotal = visibleDevices.reduce((sum, dev) => sum + (Number(point[dataKeyFor(dev)]) || 0), 0);

  const rows = visibleDevices
    .map((dev) => {
      const val = Number(point[dataKeyFor(dev)]) || 0;
      if (val <= 0 && selectedDevice && selectedDevice !== dev.key) return "";
      const other = metric === "visitors" ? Number(point[dev.key]) || 0 : Number(point[`${dev.key}Visitors`]) || 0;
      const otherLabel = metric === "visitors" ? "requests" : "visits";
      const color = isDark ? dev.dark : dev.light;
      const pct = dayTotal > 0 ? Math.round((val / dayTotal) * 100) : 0;
      const dimmed = selectedDevice && selectedDevice !== dev.key ? "opacity:0.4;" : "";
      return `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:18px;${dimmed}">
          <span style="display:flex;align-items:center;gap:6px;color:rgba(250,250,250,0.8);">
            <span style="width:7px;height:7px;border-radius:999px;background:${color};"></span>
            <span>${dev.label}</span>
          </span>
          <span style="font-family:var(--font-geist-mono),monospace;font-variant-numeric:tabular-nums;">
            ${formatExact(val)} <span style="opacity:0.55;">(${pct}%)</span>
            <span style="opacity:0.55;font-size:10px;">· ${formatExact(other)} ${otherLabel}</span>
          </span>
        </div>`;
    })
    .join("");

  return `
    <div style="border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:rgba(20,20,24,0.95);padding:9px 11px;font-size:12px;line-height:1.45;color:#fafafa;box-shadow:0 12px 32px rgba(0,0,0,0.42);backdrop-filter:blur(8px);min-width:195px;">
      <div style="margin-bottom:6px;display:flex;align-items:baseline;justify-content:space-between;gap:16px;">
        <span style="font-size:11px;color:rgba(250,250,250,0.7);">${formatFullDate(point.date)}</span>
        <span style="font-family:var(--font-geist-mono),monospace;font-weight:600;font-variant-numeric:tabular-nums;">${formatExact(dayTotal)}</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">${rows}</div>
    </div>`;
}

function buildDeviceBarOption(data, visibleDevices, selectedDevice, metric, isDark) {
  const axisColor = isDark ? "rgba(161, 161, 170, 0.85)" : "rgba(113, 113, 122, 0.9)";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(24, 24, 27, 0.08)";
  const categories = data.map((row) => row.date);
  const dataKeyFor = (dev) => (metric === "visitors" ? `${dev.key}Visitors` : dev.key);

  const activeDevices = selectedDevice
    ? visibleDevices.filter((d) => d.key === selectedDevice)
    : visibleDevices;

  const series = activeDevices.map((device, idx) => {
    const isTop = idx === activeDevices.length - 1;
    const color = isDark ? device.dark : device.light;
    return {
      id: device.key,
      name: device.label,
      type: "bar",
      stack: "devices",
      barMaxWidth: 14,
      barCategoryGap: "34%",
      data: data.map((row) => Number(row[dataKeyFor(device)]) || 0),
      itemStyle: {
        color,
        borderRadius: isTop ? [2, 2, 0, 0] : [0, 0, 0, 0],
      },
      emphasis: { focus: "series" },
    };
  });

  return {
    animationDuration: 400,
    animationEasing: "cubicOut",
    grid: {
      left: 6,
      right: 10,
      top: 12,
      bottom: 4,
      outerBoundsMode: "same",
      outerBoundsContain: "axisLabel",
    },
    xAxis: {
      type: "category",
      boundaryGap: true,
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
        type: "shadow",
        shadowStyle: { color: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" },
      },
      formatter: (params) =>
        formatDeviceTooltip(params, data, visibleDevices, selectedDevice, metric, isDark),
    },
    series,
  };
}

export function DeviceStackedChart({ data = [], devices = [], metric = "pageviews" }) {
  const mountRef = useRef(null);
  const chartRef = useRef(null);
  const { resolvedTheme } = useTheme();
  const [selectedDevice, setSelectedDevice] = useState(null);

  const isDark = resolvedTheme === "dark";

  const totalsByDevice = useMemo(() => {
    const map = new Map();
    for (const d of devices) {
      map.set(d.key, rowMetricOf(d, metric));
    }
    return map;
  }, [devices, metric]);

  const visibleDevices = useMemo(
    () =>
      DEVICE_META.filter(
        (d) => (totalsByDevice.get(d.key) ?? 0) > 0 || d.key === "desktop" || d.key === "mobile",
      ),
    [totalsByDevice],
  );

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
    instance.setOption(
      buildDeviceBarOption(data, visibleDevices, selectedDevice, metric, isDark),
      { notMerge: true },
    );
  }, [data, visibleDevices, selectedDevice, metric, isDark]);

  return (
    <div className="rounded-xl border border-border/75 bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-xs font-medium text-foreground">Device types over time</h4>

        <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Filter by device">
          {visibleDevices.map((dev) => {
            const count = totalsByDevice.get(dev.key) ?? 0;
            const color = isDark ? dev.dark : dev.light;
            const active = selectedDevice === dev.key;
            const dimmed = selectedDevice !== null && !active;

            return (
              <button
                key={dev.key}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedDevice((prev) => (prev === dev.key ? null : dev.key))}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 text-xs transition-opacity duration-100",
                  dimmed ? "opacity-40 hover:opacity-75" : "opacity-100",
                )}
              >
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="text-muted-foreground">{dev.label}</span>
                <span className="font-mono text-xs font-medium text-foreground tabular-nums">
                  {formatCompact(count)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div ref={mountRef} className="mt-4 h-72 w-full" />
    </div>
  );
}

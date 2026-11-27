"use client";

import dynamic from "next/dynamic";

const LazyTrafficLineChart = dynamic(
  () => import("./traffic-line-chart").then((module) => module.TrafficLineChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-74 w-full animate-pulse rounded-xl border border-border/70 bg-muted/30" />
    ),
  },
);

const LazyDeviceStackedChart = dynamic(
  () => import("./device-stacked-chart").then((module) => module.DeviceStackedChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full animate-pulse rounded-xl border border-border/70 bg-muted/30" />
    ),
  },
);

const LazyTrafficWorldMap = dynamic(
  () => import("./traffic-world-map").then((module) => module.TrafficWorldMap),
  {
    ssr: false,
    loading: () => <div className="aspect-[2.12/1] w-full animate-pulse bg-muted/25" />,
  },
);

export function TrafficLineChartSlot(props) {
  return <LazyTrafficLineChart {...props} />;
}

export function DeviceStackedChartSlot(props) {
  return <LazyDeviceStackedChart {...props} />;
}export function TrafficWorldMapSlot(props) {
  return <LazyTrafficWorldMap {...props} />;
}

export function TrafficChart({ data, totals }) {
  return <LazyTrafficLineChart data={data} totals={totals} />;
}

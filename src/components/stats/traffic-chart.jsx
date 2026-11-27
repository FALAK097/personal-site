"use client";

import dynamic from "next/dynamic";

const LazyTrafficLineChart = dynamic(
  () => import("./traffic-line-chart").then((module) => module.TrafficLineChart),
  {
    ssr: false,
    loading: () => <div className="h-80 w-full animate-pulse" />,
  },
);

const LazyDeviceStackedChart = dynamic(
  () => import("./device-stacked-chart").then((module) => module.DeviceStackedChart),
  {
    ssr: false,
    loading: () => <div className="h-72 w-full animate-pulse" />,
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

"use client";

import dynamic from "next/dynamic";

const TrafficBarChart = dynamic(
  () => import("./traffic-bar-chart").then((module) => module.TrafficBarChart),
  {
    ssr: false,
    loading: () => <div className="h-48 w-full animate-pulse rounded-lg bg-muted/40" />,
  },
);

export function TrafficChart({ data }) {
  return (
    <div className="h-48">
      <TrafficBarChart data={data} className="h-full w-full" />
    </div>
  );
}

"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import {
  DeviceStackedChartSlot,
  TrafficLineChartSlot,
  TrafficWorldMapSlot,
} from "@/components/stats/traffic-chart";
import { DimensionIcon } from "@/components/stats/traffic-icons";
import {
  CLOUDFLARE_ANALYTICS_URL,
  formatCompact,
  formatExact,
} from "@/lib/traffic-formatters";
import { cn } from "@/lib/utils";

function CloudflareLogo({ className }) {
  return (
    <svg viewBox="0 0 256 116" preserveAspectRatio="xMidYMid" aria-hidden="true" className={className}>
      <path
        fill="#FFF"
        d="m202.357 49.394-5.311-2.124C172.085 103.434 72.786 69.289 66.81 85.997c-.996 11.286 54.227 2.146 93.706 4.059 12.039.583 18.076 9.671 12.964 24.484l10.069.031c11.615-36.209 48.683-17.73 50.232-29.68-2.545-7.857-42.601 0-31.425-35.497Z"
      />
      <path
        fill="#F4811F"
        d="M176.332 108.348c1.593-5.31 1.062-10.622-1.593-13.809-2.656-3.187-6.374-5.31-11.154-5.842L71.17 87.634c-.531 0-1.062-.53-1.593-.53-.531-.532-.531-1.063 0-1.594.531-1.062 1.062-1.594 2.124-1.594l92.946-1.062c11.154-.53 22.839-9.56 27.087-20.182l5.312-13.809c0-.532.531-1.063 0-1.594C191.203 20.182 166.772 0 138.091 0 111.535 0 88.697 16.995 80.73 40.896c-5.311-3.718-11.684-5.843-19.12-5.31-12.747 1.061-22.838 11.683-24.432 24.43-.531 3.187 0 6.374.532 9.56C16.996 70.107 0 87.103 0 108.348c0 2.124 0 3.718.531 5.842 0 1.063 1.062 1.594 1.594 1.594h170.489c1.062 0 2.125-.53 2.125-1.594l1.593-5.842Z"
      />
      <path
        fill="#FAAD3F"
        d="M205.544 48.863h-2.656c-.531 0-1.062.53-1.593 1.062l-3.718 12.747c-1.593 5.31-1.062 10.623 1.594 13.809 2.655 3.187 6.373 5.31 11.153 5.843l19.652 1.062c.53 0 1.062.53 1.593.53.53.532.53 1.063 0 1.594-.531 1.063-1.062 1.594-2.125 1.594l-20.182 1.062c-11.154.53-22.838 9.56-27.087 20.182l-1.063 4.78c-.531.532 0 1.594 1.063 1.594h70.108c1.062 0 1.593-.531 1.593-1.593 1.062-4.25 2.124-9.03 2.124-13.81 0-27.618-22.838-50.456-50.456-50.456"
      />
    </svg>
  );
}

function buildSparklineGeometry(series, dataKey, width = 320, height = 44) {
  if (!series || series.length < 2) return null;
  const values = series.map((item) => Number(item[dataKey]) || 0);
  const max = Math.max(...values, 1);
  const topPad = 6;
  const usableH = height - topPad - 2;
  const n = values.length;

  const points = values.map((val, idx) => ({
    x: (idx / (n - 1)) * width,
    y: topPad + usableH * (1 - val / max),
  }));

  const hasPartial = n >= 4 && Boolean(series[0]?.isPartial || series[n - 1]?.isPartial);
  const fullAreaPath = [
    `M ${points[0].x.toFixed(1)} ${height}`,
    ...points.map((pt) => `L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`),
    `L ${points[n - 1].x.toFixed(1)} ${height}`,
    "Z",
  ].join(" ");

  const toLine = (pts) =>
    pts.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(" ");

  if (!hasPartial) {
    return { fullAreaPath, solidPath: toLine(points), startDashPath: null, endDashPath: null };
  }

  return {
    fullAreaPath,
    solidPath: toLine(points.slice(1, n - 1)),
    startDashPath: toLine([points[0], points[1]]),
    endDashPath: toLine([points[n - 2], points[n - 1]]),
  };
}

function SparklineMetricCard({ label, value, subtitle, series, dataKey, strokeClass, stopColor }) {
  const rawId = useId();
  const gradientId = `spark-${rawId.replace(/:/g, "")}`;
  const geom = buildSparklineGeometry(series, dataKey);

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/75 bg-card pt-4">
      <div className="px-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="mt-1 flex items-baseline justify-between gap-2">
          <p className="font-mono text-2xl font-semibold tracking-tight text-foreground tabular-nums">
            {formatCompact(value)}
          </p>
          {subtitle ? (
            <p className="font-mono text-[11px] text-muted-foreground tabular-nums">{subtitle}</p>
          ) : null}
        </div>
      </div>

      {geom ? (
        <div className="mt-2 h-11 w-full" aria-hidden="true">
          <svg viewBox="0 0 320 44" preserveAspectRatio="none" className="block h-full w-full">
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stopColor} stopOpacity="0.2" />
                <stop offset="100%" stopColor={stopColor} stopOpacity="0.01" />
              </linearGradient>
            </defs>
            <path d={geom.fullAreaPath} fill={`url(#${gradientId})`} />
            <path
              d={geom.solidPath}
              fill="none"
              strokeWidth="1.75"
              vectorEffect="non-scaling-stroke"
              className={strokeClass}
            />
            {geom.startDashPath ? (
              <path
                d={geom.startDashPath}
                fill="none"
                strokeWidth="1.75"
                strokeDasharray="3 3"
                vectorEffect="non-scaling-stroke"
                className={strokeClass}
              />
            ) : null}
            {geom.endDashPath ? (
              <path
                d={geom.endDashPath}
                fill="none"
                strokeWidth="1.75"
                strokeDasharray="3 3"
                vectorEffect="non-scaling-stroke"
                className={strokeClass}
              />
            ) : null}
          </svg>
        </div>
      ) : (
        <div className="h-4" />
      )}
    </div>
  );
}

function MetricModeToggle({ metric, onChange }) {
  return (
    <div
      className="inline-flex h-7 items-center rounded-lg border border-border/75 bg-muted/35 p-0.5"
      role="group"
      aria-label="Breakdown metric"
    >
      {[
        { id: "pageviews", label: "Requests" },
        { id: "visitors", label: "Visits" },
      ].map((option) => {
        const active = metric === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "h-6 cursor-pointer rounded-md px-2.5 text-xs font-medium transition-colors duration-100",
              active
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function rowMetricValue(row, metric) {
  return (metric === "visitors" ? row.visitors : row.pageviews) ?? 0;
}

function ProportionalRowItem({ row, metric, denominator, iconKind, linkInternalPaths, monoLabel }) {
  const val = rowMetricValue(row, metric);
  const pct = denominator > 0 ? Math.min((val / denominator) * 100, 100) : 0;
  const isInternalLink =
    linkInternalPaths &&
    typeof row.label === "string" &&
    row.label.startsWith("/") &&
    !row.label.startsWith("//");

  const labelSpan = (
    <span
      className={cn(
        "truncate text-xs text-foreground",
        monoLabel && "font-mono",
        isInternalLink && "transition-colors group-hover:text-[#2563eb] dark:group-hover:text-clay-500",
      )}
    >
      {row.label}
    </span>
  );

  return (
    <div
      title={`${row.label} — ${formatExact(row.pageviews)} requests · ${formatExact(row.visitors)} visits`}
      className="flex items-center justify-between gap-3 py-2.5 first:pt-1 last:pb-0.5"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {iconKind ? <DimensionIcon kind={iconKind} item={row} /> : null}
        {isInternalLink ? (
          <Link href={row.label} className="group flex min-w-0 items-center gap-1 truncate">
            {labelSpan}
          </Link>
        ) : (
          labelSpan
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted sm:w-28" aria-hidden="true">
          {val > 0 ? (
            <span
              className="block h-full min-w-[5px] rounded-full bg-[#2563eb] transition-[width] duration-300 dark:bg-clay-500"
              style={{ width: `${pct}%` }}
            />
          ) : null}
        </div>

        <span className="w-11 text-right font-mono text-xs font-medium text-foreground tabular-nums">
          {formatCompact(val)}
        </span>
      </div>
    </div>
  );
}

function ProportionalRows({
  rows,
  metric = "pageviews",
  totalForShare = 0,
  iconKind,
  linkInternalPaths = false,
  monoLabel = false,
}) {
  if (!rows?.length) {
    return (
      <p className="py-6 text-center text-xs text-muted-foreground">
        No data recorded for this dimension in the last 30 days.
      </p>
    );
  }

  const sorted = [...rows].sort(
    (a, b) => rowMetricValue(b, metric) - rowMetricValue(a, metric) || b.pageviews - a.pageviews,
  );
  const maxVal = Math.max(...sorted.map((row) => rowMetricValue(row, metric)), 1);
  const denominator = totalForShare > 0 ? totalForShare : maxVal;

  return (
    <div className="divide-y divide-border/60">
      {sorted.map((row) => (
        <ProportionalRowItem
          key={`${row.key ?? row.label}-${row.label}`}
          row={row}
          metric={metric}
          denominator={denominator}
          iconKind={iconKind}
          linkInternalPaths={linkInternalPaths}
          monoLabel={monoLabel}
        />
      ))}
    </div>
  );
}

function GeographySection({ countryCount, mapCountries, countries, metric, activeTotal }) {
  const isVisits = metric === "visitors";

  return (
    <div className="space-y-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-medium text-foreground">Geography</h3>
        {countryCount ? (
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {countryCount} countries
          </span>
        ) : null}
      </div>

      <div className="overflow-visible rounded-xl border border-border/75 bg-card">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <span className="text-xs font-medium text-foreground">
            {isVisits ? "Visits by country" : "Requests by country"}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">Explore by country</span>
        </div>

        <TrafficWorldMapSlot countries={mapCountries} metric={metric} total={activeTotal} />

        {countries?.length ? (
          <div className="border-t border-border/60 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-xs font-medium text-muted-foreground">Top countries</h4>
              <span className="font-mono text-[11px] text-muted-foreground">
                {isVisits ? "visits" : "requests"}
              </span>
            </div>
            <ProportionalRows
              rows={countries}
              metric={metric}
              totalForShare={activeTotal}
              iconKind="country"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ContentSection({ pages, referrers, metric, activeTotal }) {
  const [tab, setTab] = useState("pages");
  const hasReferrers = Array.isArray(referrers) && referrers.length > 0;
  const showingReferrers = tab === "referrers" && hasReferrers;
  const referrerTotal = showingReferrers
    ? referrers.reduce((sum, r) => sum + rowMetricValue(r, metric), 0)
    : 0;

  return (
    <div className="space-y-2.5">
      <h3 className="text-sm font-medium text-foreground">Content</h3>

      <div className="rounded-xl border border-border/75 bg-card p-4">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          {hasReferrers ? (
            <div
              className="inline-flex h-7 items-center rounded-lg border border-border/75 bg-muted/35 p-0.5"
              role="group"
              aria-label="Content breakdown"
            >
              {[
                { id: "pages", label: "Top paths" },
                { id: "referrers", label: "Referrers" },
              ].map((option) => {
                const active = tab === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setTab(option.id)}
                    className={cn(
                      "h-6 cursor-pointer rounded-md px-2.5 text-xs font-medium transition-colors duration-100",
                      active
                        ? "bg-background text-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <h4 className="text-xs font-medium text-foreground">Top paths</h4>
          )}

          <span className="font-mono text-[11px] text-muted-foreground">
            {showingReferrers ? "beacon referrals" : metric === "visitors" ? "visits" : "requests"}
          </span>
        </div>

        {showingReferrers ? (
          <ProportionalRows
            rows={referrers}
            metric={metric}
            totalForShare={referrerTotal}
            iconKind="referrer"
            monoLabel
          />
        ) : (
          <ProportionalRows
            rows={pages}
            metric={metric}
            totalForShare={activeTotal}
            linkInternalPaths
            monoLabel
          />
        )}
      </div>
    </div>
  );
}

function TechnologySection({ deviceSeries, devices, browsers, operatingSystems, metric, activeTotal }) {
  const unitLabel = metric === "visitors" ? "visits" : "requests";

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">Technology</h3>

      {deviceSeries?.length > 1 ? (
        <DeviceStackedChartSlot data={deviceSeries} devices={devices} />
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border/75 bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-medium text-foreground">Top browsers</h4>
            <span className="font-mono text-[11px] text-muted-foreground">{unitLabel}</span>
          </div>
          <ProportionalRows
            rows={browsers}
            metric={metric}
            totalForShare={activeTotal}
            iconKind="browser"
          />
        </div>

        <div className="rounded-xl border border-border/75 bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-medium text-foreground">Top operating systems</h4>
            <span className="font-mono text-[11px] text-muted-foreground">{unitLabel}</span>
          </div>
          <ProportionalRows
            rows={operatingSystems}
            metric={metric}
            totalForShare={activeTotal}
            iconKind="os"
          />
        </div>
      </div>
    </div>
  );
}

function NetworkSection({ colos, metric, activeTotal }) {
  if (!colos?.length) return null;

  return (
    <div className="space-y-2.5">
      <h3 className="text-sm font-medium text-foreground">Traffic &amp; network</h3>

      <div className="rounded-xl border border-border/75 bg-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-xs font-medium text-foreground">Top edge data centers</h4>
          <span className="font-mono text-[11px] text-muted-foreground">Cloudflare PoPs</span>
        </div>
        <ProportionalRows
          rows={colos}
          metric={metric}
          totalForShare={activeTotal}
          iconKind="colo"
        />
      </div>
    </div>
  );
}

export function SiteTraffic({ traffic }) {
  const [metric, setMetric] = useState("pageviews");

  if (!traffic?.totals) {
    return (
      <section className="space-y-3">
        <h2 className="section-heading">Site traffic</h2>
        <p className="text-sm text-muted-foreground">
          Requests and visits synced from Cloudflare Analytics are temporarily unavailable.
        </p>
      </section>
    );
  }

  const {
    totals,
    countryCount,
    series,
    deviceSeries,
    devices,
    countries,
    mapCountries,
    pages,
    referrers,
    operatingSystems,
    browsers,
    colos,
    days,
  } = traffic;

  const activeTotal = metric === "visitors" ? totals.visitors : totals.pageviews;

  return (
    <section className="space-y-7">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <h2 className="section-heading">Site traffic</h2>
            <span className="font-mono text-xs text-muted-foreground">last {days} days</span>
          </div>
          <MetricModeToggle metric={metric} onChange={setMetric} />
        </div>

        <p className="text-sm text-muted-foreground">
          Requests and visits for{" "}
          <span className="font-mono text-xs text-foreground">falakgala.dev</span>, synced from{" "}
          <a
            href={CLOUDFLARE_ANALYTICS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-[#2563eb] transition-colors hover:opacity-80 dark:text-clay-500"
          >
            <CloudflareLogo className="h-3 w-auto" />
            Cloudflare Web Analytics
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
          .
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SparklineMetricCard
          label="Total requests"
          value={totals.pageviews}
          subtitle={`${formatExact(totals.pageviews)} requests`}
          series={series}
          dataKey="pageviews"
          strokeClass="stroke-[#2563eb] dark:stroke-[#5cbeff]"
          stopColor="#3b82f6"
        />
        <SparklineMetricCard
          label="Total visits"
          value={totals.visitors}
          subtitle={`${formatExact(totals.visitors)} visits`}
          series={series}
          dataKey="visitors"
          strokeClass="stroke-[#0d9488] dark:stroke-[#2dd4bf]"
          stopColor="#14b8a6"
        />
      </div>

      {series?.length > 1 ? <TrafficLineChartSlot data={series} totals={totals} /> : null}

      <GeographySection
        countryCount={countryCount}
        mapCountries={mapCountries}
        countries={countries}
        metric={metric}
        activeTotal={activeTotal}
      />

      <ContentSection
        pages={pages}
        referrers={referrers}
        metric={metric}
        activeTotal={activeTotal}
      />

      <TechnologySection
        deviceSeries={deviceSeries}
        devices={devices}
        browsers={browsers}
        operatingSystems={operatingSystems}
        metric={metric}
        activeTotal={activeTotal}
      />

      <NetworkSection colos={colos} metric={metric} activeTotal={activeTotal} />
    </section>
  );
}

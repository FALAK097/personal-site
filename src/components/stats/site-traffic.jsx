"use client";

import { ArrowUpRight, Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  DeviceStackedChartSlot,
  TrafficLineChartSlot,
  TrafficWorldMapSlot,
} from "@/components/stats/traffic-chart";
import { DimensionIcon } from "@/components/stats/traffic-icons";
import {
  CLOUDFLARE_ANALYTICS_URL,
  TRAFFIC_RANGES,
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

function MetricModeToggle({ metric, onChange }) {
  return (
    <div
      className="inline-flex h-7 shrink-0 items-center rounded-lg border border-border/75 bg-muted/35 p-0.5"
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

function RangeDropdown({ days }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-lg border border-border/75 bg-muted/35 pl-2.5 pr-2 text-xs font-medium text-foreground transition-colors duration-100 hover:bg-muted/60",
          open && "bg-muted/60",
        )}
      >
        Last {days} days
        <ChevronDown
          className={cn(
            "size-3.5 text-muted-foreground transition-transform duration-150",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Traffic time range"
          className="absolute right-0 top-8 z-40 w-36 animate-in fade-in-0 zoom-in-95 overflow-hidden rounded-lg border border-border/75 bg-background p-1 shadow-xl duration-100"
        >
          {TRAFFIC_RANGES.map((value) => (
            <button
              key={value}
              type="button"
              role="option"
              aria-selected={value === days}
              onClick={() => {
                setOpen(false);
                if (value !== days) {
                  router.push(`/stats?range=${value}`, { scroll: false });
                }
              }}
              className={cn(
                "flex h-8 w-full cursor-pointer items-center justify-between rounded-md px-2.5 text-xs transition-colors duration-100",
                value === days
                  ? "bg-muted/60 font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              Last {value} days
              {value === days ? (
                <Check className="size-3.5 text-clay-500 dark:text-clay-400" aria-hidden="true" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function rowMetricValue(row, metric) {
  return (metric === "visitors" ? row.visitors : row.pageviews) ?? 0;
}

function MetricTab({ active, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-7 cursor-pointer rounded-lg px-3 text-xs font-medium transition-colors duration-100",
        active
          ? "bg-background text-foreground shadow-2xs"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

// Dark hover tooltip shared by every breakdown row — same styling as the
// world map tooltip: header row with icon/label + share, then Requests and
// Visits with their series colors.
function RowTooltip({ row, anchor, metric, shareTotals, iconKind }) {
  if (!anchor || !row) return null;

  const activeValue = rowMetricValue(row, metric);
  const activeTotal = metric === "visitors" ? shareTotals.visitors : shareTotals.pageviews;
  const share =
    activeTotal > 0 && activeValue > 0 ? ((activeValue / activeTotal) * 100).toFixed(1) : null;

  return (
    <div
      className="pointer-events-none absolute z-30 min-w-44 max-w-64 animate-in fade-in-0 zoom-in-95 rounded-lg border border-white/12 bg-[#141418]/95 px-3 py-2 text-xs text-[#fafafa] shadow-xl backdrop-blur-md duration-100"
      style={{
        left: `${anchor.x}px`,
        top: `${anchor.y}px`,
        transform: "translate(-50%, calc(-100% - 10px))",
      }}
      role="tooltip"
    >
      <div className="mb-1.5 flex items-center justify-between gap-3 border-b border-white/10 pb-1 font-medium">
        <span className="flex min-w-0 items-center gap-1.5">
          {iconKind ? <DimensionIcon kind={iconKind} item={row} /> : null}
          <span className="truncate">{row.label}</span>
        </span>
        {share ? (
          <span className="font-mono text-[10px] text-white/60 tabular-nums">{share}%</span>
        ) : null}
      </div>
      <div className="space-y-1 font-mono text-[11px]">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-white/70">
            <span className="size-2 rounded-full bg-[#3b8ef3]" aria-hidden="true" />
            Requests
          </span>
          <span className="font-medium tabular-nums">{formatExact(row.pageviews)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-white/70">
            <span className="size-2 rounded-full bg-[#2dd4bf]" aria-hidden="true" />
            Visits
          </span>
          <span className="font-medium tabular-nums">{formatExact(row.visitors)}</span>
        </div>
      </div>
    </div>
  );
}

const TOOLTIP_HALF_WIDTH = 92;

function ProportionalRowItem({ row, metric, stackScale, shareTotals, iconKind, linkInternalPaths, monoLabel }) {
  const rowRef = useRef(null);
  const [anchor, setAnchor] = useState(null);

  // One stacked bar per row: blue segment = requests, teal segment = visits,
  // laid end to end and scaled against the largest combined value in the
  // list, so both series stay visible no matter which metric is active.
  const scale = stackScale > 0 ? stackScale : 1;
  const requestsPct = Math.min((row.pageviews / scale) * 100, 100);
  const visitsPct = Math.min((row.visitors / scale) * 100, 100);
  const val = rowMetricValue(row, metric);

  const updateAnchor = (event) => {
    const rect = rowRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setAnchor({
      x: Math.min(Math.max(x, TOOLTIP_HALF_WIDTH), Math.max(rect.width - TOOLTIP_HALF_WIDTH, TOOLTIP_HALF_WIDTH)),
      y: Math.min(Math.max(y, 12), Math.max(rect.height, 12)),
    });
  };

  const isInternalLink =
    linkInternalPaths &&
    typeof row.label === "string" &&
    row.label.startsWith("/") &&
    !row.label.startsWith("//");

  const labelSpan = (
    <span
      className={cn(
        "truncate text-[13px] text-foreground",
        monoLabel && "font-mono",
        isInternalLink && "transition-colors group-hover:text-[#2563eb] dark:group-hover:text-clay-500",
      )}
    >
      {row.label}
    </span>
  );

  return (
    <div
      ref={rowRef}
      onPointerEnter={updateAnchor}
      onPointerMove={updateAnchor}
      onPointerDown={updateAnchor}
      onPointerLeave={() => setAnchor(null)}
      onPointerCancel={() => setAnchor(null)}
      aria-label={`${row.label}: ${formatExact(row.pageviews)} requests, ${formatExact(row.visitors)} visits`}
      className="group relative flex cursor-pointer items-center gap-4 py-3 first:pt-1 last:pb-1"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        {iconKind ? <DimensionIcon kind={iconKind} item={row} /> : null}
        {isInternalLink ? (
          <Link href={row.label} className="group flex min-w-0 items-center gap-1 truncate">
            {labelSpan}
          </Link>
        ) : (
          labelSpan
        )}
      </div>

      <div
        className="flex h-1.5 w-[26%] min-w-16 max-w-56 shrink-0 overflow-hidden rounded-full bg-muted"
        aria-hidden="true"
      >
        {requestsPct > 0 ? (
          <span
            className="h-full rounded-full bg-[#2563eb] transition-[width] duration-300 dark:bg-[#5cbeff]"
            style={{ width: `${requestsPct}%`, minWidth: "3px" }}
          />
        ) : null}
        {visitsPct > 0 ? (
          <span
            className="ml-[2px] h-full rounded-full bg-[#0d9488] transition-[width] duration-300 dark:bg-[#2dd4bf]"
            style={{ width: `${visitsPct}%`, minWidth: "3px" }}
          />
        ) : null}
      </div>

      <span className="w-14 shrink-0 text-right font-mono text-[13px] font-medium text-foreground tabular-nums">
        {formatCompact(val)}
      </span>

      <RowTooltip row={row} anchor={anchor} metric={metric} shareTotals={shareTotals} iconKind={iconKind} />
    </div>
  );
}

function ProportionalRows({
  rows,
  metric = "pageviews",
  shareTotals = { pageviews: 0, visitors: 0 },
  iconKind,
  linkInternalPaths = false,
  monoLabel = false,
  limit,
  minHeight,
}) {
  if (!rows?.length) {
    return (
      <p className="py-6 text-center text-xs text-muted-foreground">
        No data recorded for this dimension in the selected range.
      </p>
    );
  }

  const sorted = [...rows].sort(
    (a, b) => rowMetricValue(b, metric) - rowMetricValue(a, metric) || b.pageviews - a.pageviews,
  );
  const ranked = typeof limit === "number" ? sorted.slice(0, limit) : sorted;
  // Scale for the stacked request+visit bars: the largest combined value in
  // the list fills the track, everything else renders proportionally.
  const stackScale = ranked.reduce((max, row) => Math.max(max, row.pageviews + row.visitors), 0);

  return (
    <div className="divide-y divide-border/60" style={minHeight ? { minHeight } : undefined}>
      {ranked.map((row) => (
        <ProportionalRowItem
          key={`${row.key ?? row.label}-${row.label}`}
          row={row}
          metric={metric}
          stackScale={stackScale}
          shareTotals={shareTotals}
          iconKind={iconKind}
          linkInternalPaths={linkInternalPaths}
          monoLabel={monoLabel}
        />
      ))}
    </div>
  );
}

// Shared wrapper so every list block gets the same breathing room above and
// below its heading.
function BreakdownBlock({ title, trailing, children }) {
  return (
    <div className="pt-8 sm:pt-10">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-xs font-medium text-muted-foreground">{title}</h4>
        {trailing ?? null}
      </div>
      {children}
      <div className="pb-2" aria-hidden="true" />
    </div>
  );
}

function GeographySection({ countryCount, mapCountries, metric, activeTotal }) {
  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-medium text-foreground">Geography</h3>
        {countryCount ? (
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {countryCount} countries
          </span>
        ) : null}
      </div>

      <TrafficWorldMapSlot countries={mapCountries} metric={metric} total={activeTotal} />
    </div>
  );
}

function TopPagesSection({ pages, referrers, metric, shareTotals }) {
  const [tab, setTab] = useState("pages");
  const hasReferrers = Array.isArray(referrers) && referrers.length > 0;
  const showingReferrers = tab === "referrers" && hasReferrers;
  // The paths tab is the tallest variant; reserving its height keeps the
  // layout from jumping when switching between tabs.
  const listMinHeight = pages?.length >= 10 ? "460px" : undefined;

  // Referrers are ranked within their own pool, so their bars/tooltip shares
  // measure against the referrer totals instead of the whole site.
  const referrerTotals = hasReferrers
    ? {
        pageviews: referrers.reduce((sum, r) => sum + (r.pageviews ?? 0), 0),
        visitors: referrers.reduce((sum, r) => sum + (r.visitors ?? 0), 0),
      }
    : shareTotals;

  return (
    <BreakdownBlock title="Top pages">
      {hasReferrers ? (
        <div className="mb-2 inline-flex h-7 items-center rounded-lg border border-border/75 bg-muted/35 p-0.5">
          <MetricTab active={tab === "pages"} onClick={() => setTab("pages")}>
            Pages
          </MetricTab>
          <MetricTab active={tab === "referrers"} onClick={() => setTab("referrers")}>
            Referrers
          </MetricTab>
        </div>
      ) : null}

      {showingReferrers ? (
        <ProportionalRows
          rows={referrers}
          metric={metric}
          shareTotals={referrerTotals}
          iconKind="referrer"
          monoLabel
          minHeight={listMinHeight}
        />
      ) : (
        <ProportionalRows
          rows={pages}
          metric={metric}
          shareTotals={shareTotals}
          linkInternalPaths
          monoLabel
          minHeight={listMinHeight}
        />
      )}
    </BreakdownBlock>
  );
}

function TechnologySection({ deviceSeries, devices, browsers, operatingSystems, metric, shareTotals }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-foreground">Technology</h3>

      {deviceSeries?.length > 1 ? (
        <DeviceStackedChartSlot data={deviceSeries} devices={devices} metric={metric} />
      ) : null}

      <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
        <BreakdownBlock title="Top browsers">
          <ProportionalRows rows={browsers} metric={metric} shareTotals={shareTotals} iconKind="browser" />
        </BreakdownBlock>

        <BreakdownBlock title="Top operating systems">
          <ProportionalRows rows={operatingSystems} metric={metric} shareTotals={shareTotals} iconKind="os" />
        </BreakdownBlock>
      </div>
    </div>
  );
}

export function SiteTraffic({ traffic, metric = "pageviews" }) {
  const router = useRouter();

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
    days,
  } = traffic;

  // Metric lives in the URL (?metric=visits) just like the range (?range=),
  // so both controls compose and the view is shareable.
  const setMetric = (value) => {
    router.push(`/stats?range=${days}&metric=${value}`, { scroll: false });
  };

  // Series totals drive the dual-color bars and tooltip shares.
  const shareTotals = { pageviews: totals.pageviews, visitors: totals.visitors };

  const activeTotal = metric === "visitors" ? totals.visitors : totals.pageviews;

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="section-heading">Site traffic</h2>
          <div className="flex items-center gap-2">
            <MetricModeToggle metric={metric} onChange={setMetric} />
            <RangeDropdown days={days} />
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Requests and visits synced from{" "}
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

      {series?.length > 1 ? <TrafficLineChartSlot data={series} totals={totals} /> : null}

      <GeographySection
        countryCount={countryCount}
        mapCountries={mapCountries}
        metric={metric}
        activeTotal={activeTotal}
      />

      <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
        <BreakdownBlock title="Top countries">
          <ProportionalRows
            rows={countries}
            metric={metric}
            shareTotals={shareTotals}
            iconKind="country"
            limit={10}
          />
        </BreakdownBlock>

        <TopPagesSection
          pages={pages}
          referrers={referrers}
          metric={metric}
          shareTotals={shareTotals}
        />
      </div>

      <TechnologySection
        deviceSeries={deviceSeries}
        devices={devices}
        browsers={browsers}
        operatingSystems={operatingSystems}
        metric={metric}
        shareTotals={shareTotals}
      />
    </section>
  );
}

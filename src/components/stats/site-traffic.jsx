import { ArrowUpRight } from "lucide-react";
import { TrafficChart } from "@/components/stats/traffic-chart";

const numberFormatter = new Intl.NumberFormat("en-US");

export const CLOUDFLARE_ANALYTICS_URL = "https://www.cloudflare.com/web-analytics/?utm_source=falakgala.dev&utm_medium=referral";

const formatCount = (value) => numberFormatter.format(value ?? 0);

function CloudflareLogo({ className }) {
  return (
    <svg viewBox="0 0 256 116" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M176.332 108.348c1.593-5.31 1.062-10.622-1.593-13.809-2.656-3.187-6.374-5.31-11.154-5.842L71.17 87.634c-.531 0-1.062-.53-1.593-.53-.531-.532-.531-1.063 0-1.594.531-1.062 1.062-1.594 2.124-1.594l92.946-1.062c11.154-.53 22.839-9.56 27.087-20.182l5.312-13.809c0-.532.531-1.063 0-1.594C191.203 20.182 166.772 0 138.091 0 111.535 0 88.697 16.995 80.73 40.896c-5.311-3.718-11.684-5.843-19.12-5.31-12.747 1.061-22.838 11.683-24.432 24.43-.531 3.187 0 6.374.532 9.56C16.996 70.107 0 87.103 0 108.348c0 2.124 0 3.718.531 5.842 0 1.063 1.062 1.594 1.594 1.594h170.489c1.062 0 2.125-.53 2.125-1.594l1.593-5.842Z" />
      <path d="M205.544 48.863h-2.656c-.531 0-1.062.53-1.593 1.062l-3.718 12.747c-1.593 5.31-1.062 10.623 1.594 13.809 2.655 3.187 6.373 5.31 11.153 5.843l19.652 1.062c.53 0 1.062.53 1.593.53.53.532.53 1.063 0 1.594-.531 1.063-1.062 1.594-2.125 1.594l-20.182 1.062c-11.154.53-22.838 9.56-27.087 20.182l-1.063 4.78c-.531.532 0 1.594 1.063 1.594h70.108c1.062 0 1.593-.531 1.593-1.593 1.062-4.25 2.124-9.03 2.124-13.81 0-27.618-22.838-50.456-50.456-50.456" />
    </svg>
  );
}

function countryFlag(code) {
  if (!code || code.length !== 2 || !/^[a-z]{2}$/i.test(code)) return null;
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0)),
  );
}

function faviconUrl(host) {
  if (!host || host === "direct" || host === "others") return null;
  return `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(host)}`;
}

function Metric({ label, value, children }) {
  return (
    <div className="rounded-lg border border-border/70 p-4">
      <p className="flex items-center gap-2 font-mono text-lg font-medium tabular-nums tracking-tight">
        {children}
        <span className="min-w-0 truncate">{value}</span>
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function RankedList({ title, rows, unit = "views", showFlag = false, showFavicon = false }) {
  if (!rows?.length) return null;

  return (
    <div className="min-w-0 space-y-2">
      <h4 className="text-xs font-medium text-muted-foreground">{title}</h4>
      <div>
        {rows.map((row) => {
          const flag = showFlag ? countryFlag(row.key) : null;
          const favicon = showFavicon ? faviconUrl(row.key) : null;

          return (
            <div
              key={`${row.key ?? row.label}-${row.label}`}
              className="flex items-baseline justify-between gap-4 border-b border-border/70 py-2 last:border-0"
            >
              <span className="flex min-w-0 items-center gap-2">
                {flag ? <span aria-hidden="true">{flag}</span> : null}
                {favicon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={favicon}
                    alt=""
                    width={14}
                    height={14}
                    loading="lazy"
                    className="size-3.5 shrink-0 rounded-[3px]"
                  />
                ) : null}
                <span className="truncate font-mono text-xs">{row.label}</span>
              </span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                {formatCount(row.pageviews)} {row.pageviews === 1 ? unit.replace(/s$/, "") : unit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SiteTraffic({ traffic }) {
  if (!traffic?.totals) {
    return (
      <section className="space-y-3">
        <h2 className="section-heading">Site traffic</h2>
        <p className="text-sm text-muted-foreground">
          Pageviews and visitors. Live traffic stats are temporarily unavailable.
        </p>
      </section>
    );
  }

  const { totals, series, pages, referrers, countries, devices, days } = traffic;
  const topCountry = countries?.[0];

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 className="section-heading">Site traffic</h2>
          <p className="font-mono text-xs text-muted-foreground">last {days} days</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Pageviews and visitors, synced from{" "}
          <a
            href={CLOUDFLARE_ANALYTICS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-clay-500 transition-colors hover:text-clay-600"
          >
            <CloudflareLogo className="h-3 w-auto" />
            Cloudflare Web Analytics
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
          .
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric label="Pageviews" value={formatCount(totals.pageviews)} />
        <Metric label="Visitors" value={formatCount(totals.visitors)} />
        {pages?.[0] ? (
          <Metric label="Top page" value={pages[0].label} />
        ) : null}
        {topCountry ? (
          <Metric label="Top country" value={topCountry.label}>
            <span aria-hidden="true">{countryFlag(topCountry.key)}</span>
          </Metric>
        ) : null}
      </div>

      {series?.length > 1 ? <TrafficChart data={series} /> : null}

      <div className="grid gap-8 sm:grid-cols-2">
        <RankedList title="Top pages" rows={pages} />
        <RankedList title="Referrers" rows={referrers} showFavicon />
        <RankedList title="Countries" rows={countries} showFlag />
        <RankedList title="Devices" rows={devices} />
      </div>
    </section>
  );
}

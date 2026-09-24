import { ArrowUpRight } from "lucide-react";
import { TrafficChart } from "@/components/stats/traffic-chart";

const numberFormatter = new Intl.NumberFormat("en-US");

export const VERCEL_ANALYTICS_URL = "https://vercel.com/analytics?utm_source=falakgala.dev&utm_medium=referral";

const formatCount = (value) => numberFormatter.format(value ?? 0);

function VercelLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 1.5 23.5 22.5H0.5L12 1.5Z" />
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
            href={VERCEL_ANALYTICS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-medium text-clay-500 transition-colors hover:text-clay-600"
          >
            <VercelLogo className="size-3" />
            Vercel Web Analytics
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

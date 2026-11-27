import { ArrowUpRight } from "lucide-react";
import { TokenChart } from "@/components/stats/token-chart";
import { BrandMark } from "@/components/stats/brand-mark";
import { brandForModel } from "@/lib/ai-brand";
import { TOKSCALE_PROFILE_URL } from "@/lib/tokscale";

const tokenFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const countFormatter = new Intl.NumberFormat("en-US");

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const pad = (value) => String(value).padStart(2, "0");

const formatDayMonth = (date) => `${pad(date.getUTCDate())} ${MONTHS[date.getUTCMonth()]}`;

const formatDayMonthYear = (date) => `${formatDayMonth(date)} ${date.getUTCFullYear()}`;

const formatTokens = (value) => tokenFormatter.format(value);
const formatCost = (value) => currencyFormatter.format(value);

function formatRange(range) {
  if (!range?.start || !range?.end) return null;
  const start = new Date(range.start);
  const end = new Date(range.end);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  // Show both years when range spans multiple years, otherwise omit start year for brevity.
  if (start.getUTCFullYear() !== end.getUTCFullYear()) {
    return `${formatDayMonthYear(start)} – ${formatDayMonthYear(end)}`;
  }
  return `${formatDayMonth(start)} – ${formatDayMonthYear(end)}`;
}

function formatUpdatedAt(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const ist = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
  const diffMs = Date.now() - date.getTime();
  const diffHours = diffMs / 36e5;
  let freshness = "";
  if (diffHours < 1) freshness = "· just now";
  else if (diffHours < 24) freshness = `· ${Math.round(diffHours)}h ago`;
  else freshness = `· ${Math.round(diffHours / 24)}d ago`;
  return `${ist} IST ${freshness}`;
}

export function TokscaleLink({ children = "Tokscale" }) {
  return (
    <a
      href={TOKSCALE_PROFILE_URL}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-0.5 font-medium text-clay-500 transition-colors hover:text-clay-600"
    >
      {children}
      <ArrowUpRight className="size-3.5" aria-hidden="true" />
    </a>
  );
}

function Metric({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-border/75 bg-card p-4">
      <p className="font-mono text-lg font-medium tabular-nums tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      {hint ? <p className="mt-0.5 font-mono text-[11px] text-muted-foreground/80">{hint}</p> : null}
    </div>
  );
}

function ModelList({ models }) {
  if (!models.length) return null;

  return (
    <div className="space-y-2.5">
      <h3 className="text-sm font-medium">Models</h3>
      <div className="rounded-xl border border-border/75 bg-card p-4">
        <div className="divide-y divide-border/60">
          {models.map((model) => {
            const share = Math.min(Math.max(model.share ?? model.tokenShare ?? 0, 0), 100);
            return (
              <div
                key={model.name}
                className="flex items-center justify-between gap-3 py-2.5 first:pt-0.5 last:pb-0.5"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <BrandMark brand={brandForModel(model.name)} />
                  <span className="truncate font-mono text-xs text-foreground">{model.name}</span>
                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground/75 tabular-nums">
                    {share.toFixed(1)}%
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <div
                    className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-muted sm:block"
                    aria-hidden="true"
                  >
                    {share > 0 ? (
                      <span
                        className="block h-full min-w-[4px] rounded-full bg-[#2563eb] dark:bg-clay-500"
                        style={{ width: `${share}%` }}
                      />
                    ) : null}
                  </div>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                    {formatTokens(model.tokens)} · {formatCost(model.cost)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function TokenUsage({ insights }) {
  if (!insights) {
    return (
      <p className="text-sm text-muted-foreground">
        Live token stats are temporarily unavailable. You can view the full breakdown on{" "}
        <TokscaleLink />.
      </p>
    );
  }

  const {
    stats,
    models,
    favoriteModel,
    chart,
    biggestDay,
    dateRange,
    updatedAt,
    submissionFreshness,
    clients,
    modelCount,
    zeroCostTokens,
    zeroCostModelCount,
    isStale,
  } = insights;
  const range = formatRange(dateRange);
  const updatedLabel = formatUpdatedAt(updatedAt ?? submissionFreshness?.lastUpdated);
  const isStaleState = Boolean(isStale) || (updatedAt ? Date.now() - new Date(updatedAt).getTime() > 12 * 36e5 : false);

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 className="section-heading">AI token usage</h2>
          {range ? <p className="font-mono text-xs text-muted-foreground">{range}</p> : null}
        </div>
        <p className="text-sm text-muted-foreground">
          Tokens my AI coding agents burn{" "}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fire.gif"
            alt=""
            className="inline-block h-5 w-auto align-[-4px]"
            aria-hidden="true"
          />
          , tracked with <TokscaleLink />.
        </p>
      </div>

      {favoriteModel ? (
        <p className="text-sm text-muted-foreground">
          Favorite model
          <span className="ml-2 font-semibold text-foreground">{favoriteModel.name}</span>
          {modelCount ? (
            <span className="ml-2 font-mono text-xs text-muted-foreground">
              · {modelCount} models · {clients?.length ?? 0} clients
            </span>
          ) : null}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Metric label="Total tokens" value={formatTokens(stats.totalTokens)} />
        <Metric
          label="Total cost"
          value={formatCost(stats.totalCost)}
          hint={
            zeroCostTokens > 0
              ? `~${formatTokens(zeroCostTokens)} in ${zeroCostModelCount} free/unpriced models at $0`
              : null
          }
        />
        <Metric
          label="Active days"
          value={countFormatter.format(stats.activeDays)}
          hint={`${countFormatter.format(stats.sessionCount)} sessions`}
        />
        <Metric label="Input tokens" value={formatTokens(stats.inputTokens)} />
        <Metric label="Output tokens" value={formatTokens(stats.outputTokens)} />
        <Metric
          label="Biggest day"
          value={biggestDay ? formatCost(biggestDay.cost) : "—"}
          hint={biggestDay ? formatDayMonthYear(new Date(biggestDay.date)) : null}
        />
      </div>

      {updatedLabel ? (
        <div
          className={
            isStaleState
              ? "rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200"
              : "rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground"
          }
        >
          <span className="font-medium">{isStaleState ? "Sync delayed · " : "Synced · "}</span>
          <span className="font-mono tabular-nums">{updatedLabel}</span>
          {clients?.length ? (
            <span className="ml-2 hidden sm:inline">· {clients.join(", ")}</span>
          ) : null}
          <span className="ml-2">
            · <TokscaleLink>open on Tokscale</TokscaleLink>
          </span>
          {zeroCostTokens > 0 ? (
            <span className="mt-1 block font-mono text-[11px] leading-relaxed opacity-80">
              Cost excludes {formatTokens(zeroCostTokens)} unpriced/free tokens; days with unpriced usage are marked cost-incomplete so spend is not lowered.
            </span>
          ) : null}
        </div>
      ) : null}

      {chart?.rows?.length ? <TokenChart chart={chart} /> : null}

      <ModelList models={models} />
    </section>
  );
}

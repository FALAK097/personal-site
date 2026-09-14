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
  return `${formatDayMonth(start)} – ${formatDayMonthYear(end)}`;
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
    <div className="rounded-lg border border-border/70 p-4">
      <p className="font-mono text-lg font-medium tabular-nums tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      {hint ? <p className="mt-0.5 font-mono text-[11px] text-muted-foreground/80">{hint}</p> : null}
    </div>
  );
}

function ModelList({ models }) {
  if (!models.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Models</h3>
      <div>
        {models.map((model) => (
          <div
            key={model.name}
            className="flex items-center justify-between gap-4 border-b border-border/70 py-3 first:pt-0 last:border-0"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <BrandMark brand={brandForModel(model.name)} />
              <span className="truncate font-mono text-xs">{model.name}</span>
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground/70 tabular-nums">
                {(model.share ?? model.tokenShare ?? 0).toFixed(1)}%
              </span>
            </div>
            <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
              {formatTokens(model.tokens)} · {formatCost(model.cost)}
            </span>
          </div>
        ))}
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

  const { stats, models, favoriteModel, chart, biggestDay, dateRange } = insights;
  const range = formatRange(dateRange);

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
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Metric label="Total tokens" value={formatTokens(stats.totalTokens)} />
        <Metric label="Total cost" value={formatCost(stats.totalCost)} />
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

      {chart?.rows?.length ? <TokenChart chart={chart} /> : null}

      <ModelList models={models} />
    </section>
  );
}

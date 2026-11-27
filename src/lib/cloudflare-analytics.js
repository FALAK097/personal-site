import { getCloudflareContext } from "@opennextjs/cloudflare";
import { unstable_cache } from "next/cache";
import snapshot from "@/data/cloudflare-analytics-snapshot.json";

const CF_GRAPHQL_URL = "https://api.cloudflare.com/client/v4/graphql";
const DEFAULT_ACCOUNT_ID = "598a393819cd44e21ef2145dabea9a2f";
const DEFAULT_ZONE_ID = "392b18ac72b7006984d7f9931fd31a04";
const DEFAULT_HOST = "falakgala.dev";

// Cloudflare rejects zone analytics ranges wider than 4w2d on this plan,
// so 30 days is the maximum window, not just a default.
const DEFAULT_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;
const REVALIDATE_SECONDS = 60 * 60;

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

const asNumber = (value) => (typeof value === "number" && Number.isFinite(value) ? value : 0);

const SPECIAL_COUNTRIES = {
  T1: "Tor",
  XX: "Unknown",
  A1: "Anonymous Proxy",
  A2: "Satellite Provider",
};

const OS_LABELS = {
  Unknown: "Unknown/Others",
  MacOSX: "macOS",
  Windows: "Windows",
  Android: "Android",
  iOS: "iOS",
  Linux: "Linux",
  ChromeOS: "ChromeOS",
};

const BROWSER_LABELS = {
  Unknown: "Unknown/Others",
  ChromeMobile: "Chrome Mobile",
  MobileSafari: "Mobile Safari",
  GoogleBot: "Googlebot",
};

const DEVICE_ORDER = ["desktop", "mobile", "tablet"];
const DEVICE_LABELS = {
  desktop: "Desktop",
  mobile: "Mobile",
  tablet: "Tablet",
};

function formatCountryName(code) {
  if (!code) return "Unknown";
  const upper = String(code).trim().toUpperCase();
  if (SPECIAL_COUNTRIES[upper]) return SPECIAL_COUNTRIES[upper];
  if (!/^[A-Z]{2}$/.test(upper)) return String(code);
  try {
    return regionNames.of(upper) || upper;
  } catch {
    return upper;
  }
}

function buildUtcDateRange(sinceIso, untilIso) {
  const startStr = String(sinceIso || "").slice(0, 10);
  const endStr = String(untilIso || "").slice(0, 10);
  const start = new Date(`${startStr}T00:00:00Z`);
  const end = new Date(`${endStr}T00:00:00Z`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return [];
  }

  const dates = [];
  const cursor = new Date(start);
  while (cursor <= end && dates.length <= 40) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

function normalizeRows(items, dimensionKey, limit, { formatLabel, filterRow } = {}) {
  if (!Array.isArray(items)) return [];

  const merged = new Map();
  for (const item of items) {
    const rawKey = item?.dimensions?.[dimensionKey];
    const key = rawKey != null && rawKey !== "" ? String(rawKey) : "Unknown";
    const pageviews = asNumber(item?.count);
    const visitors = asNumber(item?.sum?.visits);
    if (pageviews <= 0 && visitors <= 0) continue;

    const label = formatLabel ? formatLabel(key) : key;
    if (filterRow && !filterRow({ key, label, pageviews, visitors })) continue;

    const existing = merged.get(label);
    if (existing) {
      existing.pageviews += pageviews;
      existing.visitors += visitors;
    } else {
      merged.set(label, { key, label, pageviews, visitors });
    }
  }

  return Array.from(merged.values())
    .sort((a, b) => b.pageviews - a.pageviews || b.visitors - a.visitors)
    .slice(0, limit);
}

// Only actual site pages belong in the Content breakdown — exclude internal
// Next.js routes (/_next/image, /_next/static/…), Cloudflare infrastructure
// paths (/cdn-cgi/rum, challenges) and asset/file extensions.
const INTERNAL_PATH_RE = /^\/(_next|cdn-cgi)\b/;
const FILE_EXT_RE = /\.[a-z0-9]{1,8}$/i;

function isRealPagePath(label) {
  return (
    typeof label === "string" &&
    label.startsWith("/") &&
    !label.startsWith("//") &&
    !INTERNAL_PATH_RE.test(label) &&
    !FILE_EXT_RE.test(label)
  );
}

// Applied outside the cached producer so the Content list never shows
// non-page paths even when a cache layer serves a pre-filter payload.
function filterRealPages(traffic) {
  if (!traffic?.pages) return traffic;
  return { ...traffic, pages: traffic.pages.filter((row) => isRealPagePath(row.label)) };
}

export function normalizeTrafficPayload({ zone, referrers = [], sinceIso, untilIso, days = DEFAULT_DAYS }) {
  const dates = buildUtcDateRange(sinceIso, untilIso);

  const dailyByDate = new Map();
  for (const item of zone?.daily || []) {
    const date = item?.dimensions?.date;
    if (!date) continue;
    dailyByDate.set(date, {
      pageviews: asNumber(item?.count),
      visitors: asNumber(item?.sum?.visits),
    });
  }

  const series = dates.map((date, index) => {
    const point = dailyByDate.get(date);
    return {
      date,
      pageviews: point?.pageviews ?? 0,
      visitors: point?.visitors ?? 0,
      isPartial: dates.length > 2 && (index === 0 || index === dates.length - 1),
    };
  });

  const summedTotals = series.reduce(
    (acc, point) => ({
      pageviews: acc.pageviews + point.pageviews,
      visitors: acc.visitors + point.visitors,
    }),
    { pageviews: 0, visitors: 0 },
  );

  const rawTotalPv = asNumber(zone?.totals?.[0]?.count);
  const rawTotalVis = asNumber(zone?.totals?.[0]?.sum?.visits);
  const totals = {
    pageviews: rawTotalPv > 0 ? rawTotalPv : summedTotals.pageviews,
    visitors: rawTotalVis > 0 ? rawTotalVis : summedTotals.visitors,
  };

  // Device types over time (stacked daily series + totals)
  const deviceByDate = new Map(
    dates.map((date, index) => [
      date,
      {
        date,
        desktop: 0,
        mobile: 0,
        tablet: 0,
        desktopVisitors: 0,
        mobileVisitors: 0,
        tabletVisitors: 0,
        isPartial: dates.length > 2 && (index === 0 || index === dates.length - 1),
      },
    ]),
  );

  for (const item of zone?.dailyDevices || []) {
    const date = item?.dimensions?.date;
    const rawDevice = String(item?.dimensions?.clientDeviceType || "desktop").toLowerCase();
    const bucket = deviceByDate.get(date);
    if (!bucket) continue;
    const pv = asNumber(item?.count);
    const visits = asNumber(item?.sum?.visits);
    if (rawDevice === "mobile") {
      bucket.mobile += pv;
      bucket.mobileVisitors += visits;
    } else if (rawDevice === "tablet") {
      bucket.tablet += pv;
      bucket.tabletVisitors += visits;
    } else {
      bucket.desktop += pv;
      bucket.desktopVisitors += visits;
    }
  }

  const deviceSeries = Array.from(deviceByDate.values());

  const deviceMap = new Map(
    DEVICE_ORDER.map((key) => [
      key,
      { key, label: DEVICE_LABELS[key], pageviews: 0, visitors: 0 },
    ]),
  );
  for (const item of zone?.devices || []) {
    const raw = String(item?.dimensions?.clientDeviceType || "desktop").toLowerCase();
    const target = deviceMap.get(raw) ?? deviceMap.get("desktop");
    target.pageviews += asNumber(item?.count);
    target.visitors += asNumber(item?.sum?.visits);
  }
  const devices = Array.from(deviceMap.values()).filter(
    (row) => row.pageviews > 0 || row.key === "desktop" || row.key === "mobile",
  );

  // Countries: full ISO-2 list for Choropleth World Map + Top 10 list (including Tor)
  const allCountries = (zone?.countries || [])
    .map((item) => {
      const rawCode = String(item?.dimensions?.clientCountryName || "").trim().toUpperCase();
      const isIso2 = /^[A-Z]{2}$/.test(rawCode) && !SPECIAL_COUNTRIES[rawCode];
      return {
        key: rawCode || "XX",
        code: isIso2 ? rawCode : null,
        label: formatCountryName(rawCode),
        pageviews: asNumber(item?.count),
        visitors: asNumber(item?.sum?.visits),
      };
    })
    .filter((row) => row.pageviews > 0)
    .sort((a, b) => b.pageviews - a.pageviews || b.visitors - a.visitors);

  const mapCountries = allCountries.filter((row) => Boolean(row.code));
  // Full candidate list — the UI ranks by the selected metric (requests or
  // visits) before applying its display limit, so leaders per metric survive.
  const countries = allCountries;

  // Top paths — real pages only (see isRealPagePath); query fetches extra
  // candidates so filtering down to 10 pages still leaves a full list.
  const pages = normalizeRows(zone?.pages, "clientRequestPath", 10, {
    filterRow: ({ label }) => isRealPagePath(label),
  });

  // Top operating systems & browsers
  const operatingSystems = normalizeRows(zone?.operatingSystems, "userAgentOS", 8, {
    formatLabel: (key) => OS_LABELS[key] || key,
  });

  const browsers = normalizeRows(zone?.browsers, "userAgentBrowser", 9, {
    formatLabel: (key) => BROWSER_LABELS[key] || key,
  });

  // External Web Analytics referrers (when available)
  const externalReferrers = (referrers || [])
    .map((item) => {
      const rawHost = String(item?.dimensions?.refererHost || "").trim().toLowerCase();
      const isSelf = rawHost === "falakgala.dev" || rawHost === "www.falakgala.dev";
      if (isSelf) return null;
      const key = rawHost || "direct";
      const label = rawHost || "Direct / None";
      return {
        key,
        label,
        pageviews: asNumber(item?.count),
        visitors: asNumber(item?.sum?.visits),
      };
    })
    .filter((row) => row && row.pageviews > 0)
    .sort((a, b) => b.pageviews - a.pageviews)
    .slice(0, 8);

  return {
    days,
    range: {
      since: sinceIso,
      until: untilIso,
    },
    totals,
    countryCount: mapCountries.length,
    series,
    deviceSeries,
    devices,
    countries,
    mapCountries,
    pages,
    referrers: externalReferrers,
    operatingSystems,
    browsers,
  };
}

export function getSnapshotTraffic(days = DEFAULT_DAYS) {
  return normalizeTrafficPayload({
    zone: snapshot.zone,
    referrers: snapshot.referrers,
    sinceIso: snapshot.since,
    untilIso: snapshot.until,
    days,
  });
}

async function resolveCloudflareCredentials() {
  let cfEnv = null;
  try {
    const ctx = await getCloudflareContext({ async: true });
    cfEnv = ctx?.env ?? null;
  } catch {
    cfEnv = null;
  }

  const token =
    cfEnv?.CF_ANALYTICS_TOKEN ||
    cfEnv?.CLOUDFLARE_API_TOKEN ||
    process.env.CF_ANALYTICS_TOKEN ||
    process.env.CLOUDFLARE_API_TOKEN ||
    null;

  const zoneId =
    cfEnv?.CLOUDFLARE_ZONE_ID || process.env.CLOUDFLARE_ZONE_ID || DEFAULT_ZONE_ID;

  const accountId =
    cfEnv?.CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID || DEFAULT_ACCOUNT_ID;

  return { token, zoneId, accountId };
}

const ZONE_TRAFFIC_QUERY = `
  query ($zoneTag: string!, $filter: ZoneHttpRequestsAdaptiveGroupsFilter_InputObject!) {
    viewer {
      zones(filter: { zoneTag: $zoneTag }) {
        totals: httpRequestsAdaptiveGroups(limit: 1, filter: $filter) {
          count
          sum { visits }
        }
        daily: httpRequestsAdaptiveGroups(limit: 35, filter: $filter, orderBy: [date_ASC]) {
          count
          sum { visits }
          dimensions { date }
        }
        dailyDevices: httpRequestsAdaptiveGroups(limit: 200, filter: $filter, orderBy: [date_ASC]) {
          count
          sum { visits }
          dimensions { date clientDeviceType }
        }        devices: httpRequestsAdaptiveGroups(limit: 10, filter: $filter, orderBy: [count_DESC]) {
          count
          sum { visits }
          dimensions { clientDeviceType }
        }
        countries: httpRequestsAdaptiveGroups(limit: 250, filter: $filter, orderBy: [count_DESC]) {
          count
          sum { visits }
          dimensions { clientCountryName }
        }
        pages: httpRequestsAdaptiveGroups(limit: 40, filter: $filter, orderBy: [count_DESC]) {
          count
          sum { visits }
          dimensions { clientRequestPath }
        }
        operatingSystems: httpRequestsAdaptiveGroups(limit: 12, filter: $filter, orderBy: [count_DESC]) {
          count
          sum { visits }
          dimensions { userAgentOS }
        }
        browsers: httpRequestsAdaptiveGroups(limit: 12, filter: $filter, orderBy: [count_DESC]) {
          count
          sum { visits }
          dimensions { userAgentBrowser }
        }
      }
    }
  }
`;

const RUM_REFERRERS_QUERY = `
  query ($accountTag: string!, $since: Time!, $until: Time!) {
    viewer {
      accounts(filter: { accountTag: $accountTag }) {
        referrers: rumPageloadEventsAdaptiveGroups(
          limit: 15
          orderBy: [count_DESC]
          filter: {
            requestHost_in: ["falakgala.dev", "www.falakgala.dev"]
            datetime_geq: $since
            datetime_lt: $until
          }
        ) {
          count
          sum { visits }
          dimensions { refererHost }
        }
      }
    }
  }
`;

async function postGraphql(token, query, variables) {
  const response = await fetch(CF_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Cloudflare GraphQL HTTP ${response.status}`);
  }

  const payload = await response.json();
  if (payload?.errors?.length) {
    throw new Error(payload.errors.map((err) => err.message).join("; "));
  }
  return payload?.data;
}

// Exclude common bot / CLI / scripted user agents — this plan has no
// server-side bot classification, so request-level UA patterns are the
// strongest available filter.
const BOT_UA_EXCLUSIONS = [
  "%bot%",
  "%crawl%",
  "%curl%",
  "%headless%",
  "%HeadlessChrome%",
  "%spider%",
  "%python%",
  "%wget%",
  "%Go-http-client%",
  "%okhttp%",
  "%axios%",
  "%scrapy%",
  "%phantomjs%",
];

function buildZoneFilter(sinceIso, untilIso) {
  return {
    datetime_geq: sinceIso,
    datetime_lt: untilIso,
    clientRequestHTTPHost: DEFAULT_HOST,
    // Mirror the dashboard's Traffic panel: only end-user requests, excluding
    // health checks and Worker/subrequest traffic.
    requestSource: "eyeball",
    // Drop scripted / bot traffic from every metric.
    AND: BOT_UA_EXCLUSIONS.map((pattern) => ({ userAgent_notlike: pattern })),
  };
}

async function fetchLiveCloudflareTraffic(days = DEFAULT_DAYS) {
  // Local dev uses the bundled snapshot: no token usage, and no risk of
  // polluting production analytics from test page loads.
  if (process.env.NODE_ENV !== "production") {
    throw new Error("Live analytics disabled outside production");
  }

  const { token, zoneId, accountId } = await resolveCloudflareCredentials();
  if (!token) {
    throw new Error("Missing CF_ANALYTICS_TOKEN or CLOUDFLARE_API_TOKEN");
  }

  const until = new Date();
  const since = new Date(until.getTime() - days * DAY_MS);
  const sinceIso = since.toISOString();
  const untilIso = until.toISOString();

  const filter = buildZoneFilter(sinceIso, untilIso);

  const [zoneResult, rumResult] = await Promise.allSettled([
    postGraphql(token, ZONE_TRAFFIC_QUERY, { zoneTag: zoneId, filter }),
    postGraphql(token, RUM_REFERRERS_QUERY, {
      accountTag: accountId,
      since: sinceIso,
      until: untilIso,
    }),
  ]);

  if (zoneResult.status !== "fulfilled") {
    throw zoneResult.reason;
  }

  const zone = zoneResult.value?.viewer?.zones?.[0];
  if (!zone) {
    throw new Error("Cloudflare Zone analytics returned no zone data");
  }

  const referrers =
    rumResult.status === "fulfilled"
      ? rumResult.value?.viewer?.accounts?.[0]?.referrers ?? []
      : [];

  return normalizeTrafficPayload({ zone, referrers, sinceIso, untilIso, days });
}

function getCachedLiveTraffic(days) {
  return unstable_cache(
    async () => fetchLiveCloudflareTraffic(days),
    ["cloudflare-zone-traffic-v7", `days-${days}`],
    { revalidate: REVALIDATE_SECONDS, tags: ["cloudflare-site-traffic"] },
  );
}

export function resolveTrafficRange(value) {
  const parsed = Number.parseInt(String(value), 10);
  return [7, 14, 30].includes(parsed) ? parsed : DEFAULT_DAYS;
}

export function resolveTrafficMetric(value) {
  return String(value) === "visitors" ? "visitors" : "pageviews";
}

export async function getSiteTraffic(days = DEFAULT_DAYS) {
  // Dev always serves the bundled snapshot — before the cache lookup, since
  // the persistent cache may hold live payloads from earlier runs.
  if (process.env.NODE_ENV !== "production") {
    return getSnapshotTraffic(days);
  }
  try {
    const cached = await getCachedLiveTraffic(days)();
    return filterRealPages(cached);
  } catch {
    return filterRealPages(getSnapshotTraffic(days));
  }
}

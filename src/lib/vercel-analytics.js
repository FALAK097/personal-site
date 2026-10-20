import { unstable_cache } from "next/cache";
import snapshot from "@/data/vercel-analytics-snapshot.json";

const CF_GRAPHQL_URL = "https://api.cloudflare.com/client/v4/graphql";
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "598a393819cd44e21ef2145dabea9a2f";
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || process.env.CF_ANALYTICS_TOKEN;

const WINDOW_DAYS = 30;
const PAGE_LIST_LIMIT = 12;
const REVALIDATE_SECONDS = 60 * 60;

const asNumber = (value) => (typeof value === "number" && Number.isFinite(value) ? value : 0);

function readCount(data) {
  if (!data || typeof data !== "object") return null;
  return { pageviews: asNumber(data.pageviews), visitors: asNumber(data.visitors) };
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

function formatRegion(code) {
  if (!code || code === "others") return code;
  try {
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

function readRows(data, dimensionKey, limit, { fallbackLabel = "others", format, dropOthers = false } = {}) {
  if (!Array.isArray(data)) return [];

  return data
    .map((row) => {
      const raw = row?.[dimensionKey];
      const label = raw ? String(raw) : fallbackLabel;
      return {
        key: raw ? String(raw) : null,
        label: format ? format(label) : label,
        pageviews: asNumber(row?.pageviews),
        visitors: asNumber(row?.visitors),
      };
    })
    .filter((row) => row.pageviews > 0)
    .filter((row) => !(dropOthers && /^others$/i.test(row.label)))
    .sort((a, b) => b.pageviews - a.pageviews)
    .slice(0, limit);
}

function readSeries(data) {
  if (!Array.isArray(data)) return [];

  return data
    .map((row) => {
      const raw = row?.day ?? row?.date ?? row?.timestamp;
      const date = raw ? new Date(raw) : null;
      if (!date || Number.isNaN(date.getTime())) return null;
      return {
        date: date.toISOString().slice(0, 10),
        pageviews: asNumber(row?.pageviews),
        visitors: asNumber(row?.visitors),
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function getSnapshotTraffic() {
  const totals = readCount(snapshot.counts);
  const series = readSeries(snapshot.daily);
  return {
    days: WINDOW_DAYS,
    totals: totals ?? { pageviews: 0, visitors: 0 },
    series,
    pages: readRows(snapshot.pages, "requestPath", PAGE_LIST_LIMIT, { dropOthers: true }),
    referrers: readRows(snapshot.referrers, "referrerHostname", 6, { fallbackLabel: "direct", dropOthers: true }),
    countries: readRows(snapshot.countries, "country", 12, { format: formatRegion, dropOthers: true }),
    devices: readRows(snapshot.devices, "deviceType", 5, { dropOthers: true }),
  };
}

function mergeRows(baseRows, cfItems, dimensionField, limit, { fallbackLabel = "others", format, dropOthers = false } = {}) {
  const map = new Map();

  for (const row of baseRows) {
    const k = row.key ?? row.label;
    map.set(k, { ...row });
  }

  for (const item of cfItems || []) {
    const raw = item?.dimensions?.[dimensionField];
    const key = raw ? String(raw) : null;
    const labelRaw = key || fallbackLabel;
    const label = format ? format(labelRaw) : labelRaw;
    const mapKey = key ?? label;
    const pv = asNumber(item?.count);
    const vis = asNumber(item?.sum?.visits);
    if (pv <= 0) continue;

    if (map.has(mapKey)) {
      const existing = map.get(mapKey);
      existing.pageviews += pv;
      existing.visitors += vis;
    } else {
      map.set(mapKey, { key, label, pageviews: pv, visitors: vis });
    }
  }

  return Array.from(map.values())
    .filter((row) => row.pageviews > 0)
    .filter((row) => !(dropOthers && /^others$/i.test(row.label)))
    .sort((a, b) => b.pageviews - a.pageviews)
    .slice(0, limit);
}

async function fetchCloudflareTraffic(base) {
  if (!CF_API_TOKEN) return base;

  const sinceIso = "2026-10-20T00:00:00Z";
  const untilIso = new Date().toISOString();

  const graphqlQuery = `
    query ($accountTag: string!, $since: Time!, $until: Time!) {
      viewer {
        accounts(filter: { accountTag: $accountTag }) {
          totals: rumPageloadEventsAdaptiveGroups(
            limit: 1
            filter: {
              requestHost_in: ["falakgala.dev", "www.falakgala.dev"]
              datetime_geq: $since
              datetime_lt: $until
            }
          ) {
            count
            sum { visits }
          }
          daily: rumPageloadEventsAdaptiveGroups(
            limit: 35
            filter: {
              requestHost_in: ["falakgala.dev", "www.falakgala.dev"]
              datetime_geq: $since
              datetime_lt: $until
            }
          ) {
            count
            sum { visits }
            dimensions { date }
          }
          pages: rumPageloadEventsAdaptiveGroups(
            limit: 20
            filter: {
              requestHost_in: ["falakgala.dev", "www.falakgala.dev"]
              datetime_geq: $since
              datetime_lt: $until
            }
          ) {
            count
            sum { visits }
            dimensions { requestPath }
          }
          referrers: rumPageloadEventsAdaptiveGroups(
            limit: 15
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
          countries: rumPageloadEventsAdaptiveGroups(
            limit: 20
            filter: {
              requestHost_in: ["falakgala.dev", "www.falakgala.dev"]
              datetime_geq: $since
              datetime_lt: $until
            }
          ) {
            count
            sum { visits }
            dimensions { countryName }
          }
          devices: rumPageloadEventsAdaptiveGroups(
            limit: 10
            filter: {
              requestHost_in: ["falakgala.dev", "www.falakgala.dev"]
              datetime_geq: $since
              datetime_lt: $until
            }
          ) {
            count
            sum { visits }
            dimensions { deviceType }
          }
        }
      }
    }
  `;

  const response = await fetch(CF_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: graphqlQuery,
      variables: {
        accountTag: CF_ACCOUNT_ID,
        since: sinceIso,
        until: untilIso,
      },
    }),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) return base;

  const payload = await response.json();
  const account = payload?.data?.viewer?.accounts?.[0];
  if (!account) return base;

  const cfTotalPv = asNumber(account.totals?.[0]?.count);
  const cfTotalVis = asNumber(account.totals?.[0]?.sum?.visits);

  const seriesMap = new Map(base.series.map((point) => [point.date, { ...point }]));
  for (const item of account.daily || []) {
    const date = item?.dimensions?.date;
    if (!date) continue;
    const pv = asNumber(item?.count);
    const vis = asNumber(item?.sum?.visits);
    if (seriesMap.has(date)) {
      const existing = seriesMap.get(date);
      existing.pageviews += pv;
      existing.visitors += vis;
    } else {
      seriesMap.set(date, { date, pageviews: pv, visitors: vis });
    }
  }

  const mergedSeries = Array.from(seriesMap.values())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-WINDOW_DAYS);

  return {
    days: WINDOW_DAYS,
    totals: {
      pageviews: base.totals.pageviews + cfTotalPv,
      visitors: base.totals.visitors + cfTotalVis,
    },
    series: mergedSeries,
    pages: mergeRows(base.pages, account.pages, "requestPath", PAGE_LIST_LIMIT, { dropOthers: true }),
    referrers: mergeRows(base.referrers, account.referrers, "refererHost", 6, { fallbackLabel: "direct", dropOthers: true }),
    countries: mergeRows(base.countries, account.countries, "countryName", 12, { format: formatRegion, dropOthers: true }),
    devices: mergeRows(base.devices, account.devices, "deviceType", 5, { dropOthers: true }),
  };
}

export const getSiteTraffic = unstable_cache(
  async () => {
    const base = getSnapshotTraffic();
    try {
      return await fetchCloudflareTraffic(base);
    } catch {
      return base;
    }
  },
  ["cloudflare-site-traffic"],
  { revalidate: REVALIDATE_SECONDS, tags: ["cloudflare-site-traffic"] },
);

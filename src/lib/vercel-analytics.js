import { unstable_cache } from "next/cache";

const API_BASE = "https://api.vercel.com/v1/query/web-analytics";

// VERCEL_PROJECT_ID is injected by Vercel at runtime; the fallback is the linked
// project in .vercel/project.json so local dev works without extra config.
const PROJECT_ID = process.env.VERCEL_PROJECT_ID || "prj_G5cDO0e5FalDveMH86NwOd1E5OVJ";
const TEAM_ID = process.env.VERCEL_TEAM_ID || "team_qCfZWajB9NrwDaX62pURoCSO";
const TOKEN = process.env.VERCEL_ANALYTICS_TOKEN;

const WINDOW_DAYS = 30;
const LIST_LIMIT = 8;
const PAGE_LIST_LIMIT = 12;
const REVALIDATE_SECONDS = 60 * 60;

// The API expects epoch milliseconds for since/until.
function msDaysAgo(days) {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

function buildSearch(params) {
  const search = new URLSearchParams({ projectId: PROJECT_ID, teamId: TEAM_ID });

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    search.append(key, String(value));
  }

  return search;
}

async function query(path, params) {
  const response = await fetch(`${API_BASE}/${path}?${buildSearch(params)}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) return null;

  const payload = await response.json();
  return payload?.data ?? null;
}

const asNumber = (value) => (typeof value === "number" && Number.isFinite(value) ? value : 0);

function readCount(data) {
  if (!data || typeof data !== "object") return null;
  return { pageviews: asNumber(data.pageviews), visitors: asNumber(data.visitors) };
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

// The API folds the tail of a dimension into an "Others" bucket. For resolvable
// lists (country, deviceType, referrerHostname) that entry carries no real value,
// so `dropOthers` removes it and the limit is raised to keep as much data as possible.
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

function formatRegion(code) {
  if (code === "others") return code;
  try {
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
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

export const getSiteTraffic = unstable_cache(
  async () => {
    if (!TOKEN) return null;

    try {
      const since = msDaysAgo(WINDOW_DAYS);
      const until = Date.now();
      const range = { since, until };

      const [counts, daily, pages, referrers, countries, devices] = await Promise.all([
        query("visits/count", range),
        query("visits/aggregate", { ...range, by: "day" }),
        query("visits/aggregate", { ...range, by: "requestPath", limit: PAGE_LIST_LIMIT }),
        query("visits/aggregate", { ...range, by: "referrerHostname", limit: 12 }),
        query("visits/aggregate", { ...range, by: "country", limit: 12 }),
        query("visits/aggregate", { ...range, by: "deviceType", limit: 6 }),
      ]);

      const totals = readCount(counts);
      const series = readSeries(daily);

      if (!totals && !series.length) return null;

      const summed = series.reduce(
        (acc, point) => ({
          pageviews: acc.pageviews + point.pageviews,
          visitors: acc.visitors + point.visitors,
        }),
        { pageviews: 0, visitors: 0 },
      );

      return {
        days: WINDOW_DAYS,
        totals: totals ?? summed,
        series,
        pages: readRows(pages, "requestPath", PAGE_LIST_LIMIT, { dropOthers: true }),
        referrers: readRows(referrers, "referrerHostname", 6, { fallbackLabel: "direct", dropOthers: true }),
        countries: readRows(countries, "country", 12, { format: formatRegion, dropOthers: true }),
        devices: readRows(devices, "deviceType", 5, { dropOthers: true }),
      };
    } catch {
      return null;
    }
  },
  ["vercel-site-traffic"],
  { revalidate: REVALIDATE_SECONDS, tags: ["vercel-site-traffic"] },
);

import { unstable_cache } from "next/cache";

const TOKSCALE_USER = "FALAK097";
const TOKSCALE_BASE_URL = `https://tokscale.ai/u/${TOKSCALE_USER}`;
const TOKSCALE_DATA_URL = TOKSCALE_BASE_URL;
export const TOKSCALE_PROFILE_URL = `${TOKSCALE_BASE_URL}?utm_source=falakgala.dev&utm_medium=referral&utm_campaign=stats`;

const TOP_MODELS_LIMIT = 8;
const SYNTHETIC_MODEL = "<synthetic>";
const REVALIDATE_SECONDS = 60 * 60 * 24;

const FLIGHT_PUSH_CHUNK = /self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)/gu;
const NULL_PLACEHOLDER = "\u0000";

function parseChunk(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function rebuildFlightPayload(html) {
  const chunks = [];
  let match = FLIGHT_PUSH_CHUNK.exec(html);

  while (match !== null) {
    const chunk = parseChunk(match[1]);
    if (chunk) chunks.push(chunk);
    match = FLIGHT_PUSH_CHUNK.exec(html);
  }

  return chunks.join("");
}

function unescapeOnce(value) {
  return value
    .replaceAll("\\\\", NULL_PLACEHOLDER)
    .replaceAll('\\"', '"')
    .replaceAll("\\n", "\n")
    .replaceAll("\\r", "\r")
    .replaceAll("\\t", "\t")
    .replaceAll("\\/", "/")
    .replaceAll(NULL_PLACEHOLDER, "\\");
}

function sliceBalancedObject(source) {
  let depth = 0;
  let inString = false;
  let isEscaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (isEscaped) isEscaped = false;
      else if (char === "\\") isEscaped = true;
      else if (char === '"') inString = false;
      continue;
    }

    if (char === '"') inString = true;
    else if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(0, index + 1);
    }
  }

  return null;
}

function extractInitialData(html) {
  const payload = rebuildFlightPayload(html);
  const anchor = payload.indexOf("initialData");
  if (anchor === -1) return null;

  const objectStart = payload.lastIndexOf("{", anchor);
  if (objectStart === -1) return null;

  const balanced = sliceBalancedObject(unescapeOnce(payload.slice(objectStart)));
  if (!balanced) return null;

  try {
    const parsed = JSON.parse(balanced);
    return parsed.initialData ?? null;
  } catch {
    return null;
  }
}

function buildSeries(contributions) {
  return contributions
    .map((point) => ({
      date: point.date,
      tokens: point.totals?.tokens ?? 0,
      cost: point.totals?.cost ?? 0,
    }))
    .filter((point) => Boolean(point.date))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function findBiggestDay(series) {
  let biggest = null;

  for (const point of series) {
    if (biggest === null || point.cost > biggest.cost) biggest = point;
  }

  return biggest;
}

const COST_KEY_SUFFIX = "::cost";
const OTHER_KEY = "other";
const OTHER_LABEL = "other models";
const OTHER_CLIENT_KEY = "other-clients";
const OTHER_CLIENT_LABEL = "other clients";
const CHART_MODEL_LIMIT = 5;
const CHART_CLIENT_LIMIT = 6;

function slugifyKey(name, index, used) {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/^-|-$/g, "") || `model-${index}`;
  let key = base;
  let suffix = 2;

  while (used.has(key)) {
    key = `${base}-${suffix}`;
    suffix += 1;
  }

  used.add(key);
  return key;
}

function weekStart(dateString) {
  const date = new Date(`${dateString}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - daysSinceMonday);
  return date.toISOString().slice(0, 10);
}

function collectClientNames(contributions, limit) {
  const totals = new Map();

  for (const point of contributions) {
    for (const client of point.clients ?? []) {
      const name = client?.client;
      if (!name) continue;
      let tokens = 0;
      for (const usage of Object.values(client.models ?? {})) {
        tokens += usage?.tokens ?? 0;
      }
      totals.set(name, (totals.get(name) ?? 0) + tokens);
    }
  }

  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name);
}

function buildChartData(contributions, modelKeyMap, clientNames) {
  const modelKeys = [...modelKeyMap.values(), OTHER_KEY];
  const clientKeys = [...clientNames, OTHER_CLIENT_KEY];
  const knownClients = new Set(clientNames);
  const buckets = new Map();
  const otherByWeek = new Map();

  const bucketFor = (dateString) => {
    if (!buckets.has(dateString)) {
      const bucket = {
        row: { date: dateString },
        costRow: { date: dateString },
        clientRow: { date: dateString },
        clientCostRow: { date: dateString },
      };

      for (const key of modelKeys) {
        bucket.row[key] = 0;
        bucket.costRow[key] = 0;
      }
      for (const key of clientKeys) {
        bucket.clientRow[key] = 0;
        bucket.clientCostRow[key] = 0;
      }

      buckets.set(dateString, bucket);
    }

    return buckets.get(dateString);
  };

  for (const point of contributions) {
    const week = weekStart(point.date);
    if (!week) continue;

    const bucket = bucketFor(week);

    for (const client of point.clients ?? []) {
      const clientKey = knownClients.has(client?.client) ? client.client : OTHER_CLIENT_KEY;

      for (const [name, usage] of Object.entries(client.models ?? {})) {
        if (name === SYNTHETIC_MODEL) continue;

        const tokens = usage.tokens ?? 0;
        const cost = usage.cost ?? 0;
        const modelKey = modelKeyMap.get(name);

        if (modelKey) {
          bucket.row[modelKey] += tokens;
          bucket.costRow[modelKey] += cost;
        } else {
          bucket.row[OTHER_KEY] += tokens;
          bucket.costRow[OTHER_KEY] += cost;

          // Keep every grouped model's own numbers so the tooltip can name them
          // instead of showing one anonymous "other models" line.
          let weekOthers = otherByWeek.get(week);
          if (!weekOthers) {
            weekOthers = new Map();
            otherByWeek.set(week, weekOthers);
          }
          const current = weekOthers.get(name) ?? { tokens: 0, cost: 0 };
          current.tokens += tokens;
          current.cost += cost;
          weekOthers.set(name, current);
        }

        bucket.clientRow[clientKey] += tokens;
        bucket.clientCostRow[clientKey] += cost;
      }
    }
  }

  const order = (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime();
  const entries = [...buckets.values()];

  const otherModelsByWeek = Object.fromEntries(
    [...otherByWeek.entries()].map(([date, models]) => [
      date,
      [...models.entries()]
        .map(([name, values]) => ({ name, tokens: values.tokens, cost: values.cost }))
        .sort((a, b) => b.cost - a.cost || b.tokens - a.tokens),
    ]),
  );

  return {
    rows: entries.map((entry) => entry.row).sort(order),
    costRows: entries.map((entry) => entry.costRow).sort(order),
    clientRows: entries.map((entry) => entry.clientRow).sort(order),
    clientCostRows: entries.map((entry) => entry.clientCostRow).sort(order),
    otherModelsByWeek,
  };
}

function toInsights(data) {
  const stats = data?.stats;
  if (!stats || typeof stats.totalTokens !== "number") return null;

  const rankedModels = (data.modelUsage ?? [])
    .filter((entry) => entry?.model && entry.model !== SYNTHETIC_MODEL)
    // Tokscale's own Models table is ranked by cost and its Share column is the
    // cost share, so mirror that here to stay consistent with the source.
    .sort((a, b) => (b.cost ?? 0) - (a.cost ?? 0));

  const totalModelCost = rankedModels.reduce((sum, entry) => sum + (entry.cost ?? 0), 0) || 1;
  const totalModelTokens = rankedModels.reduce((sum, entry) => sum + (entry.tokens ?? 0), 0) || 1;

  const models = rankedModels.slice(0, TOP_MODELS_LIMIT).map((entry) => ({
    name: entry.model,
    tokens: entry.tokens ?? 0,
    cost: entry.cost ?? 0,
    share: ((entry.cost ?? 0) / totalModelCost) * 100,
    tokenShare: ((entry.tokens ?? 0) / totalModelTokens) * 100,
  }));

  const series = buildSeries(data.contributions ?? []);

  const usedKeys = new Set([OTHER_KEY]);
  const chartModels = models.slice(0, CHART_MODEL_LIMIT);
  const modelKeyMap = new Map();
  const labels = { [OTHER_KEY]: OTHER_LABEL };

  chartModels.forEach((model, index) => {
    const key = slugifyKey(model.name, index, usedKeys);
    modelKeyMap.set(model.name, key);
    labels[key] = model.name;
  });

  const chartKeys = [...modelKeyMap.values(), OTHER_KEY];
  const clientNames = collectClientNames(data.contributions ?? [], CHART_CLIENT_LIMIT);
  const { rows, costRows, clientRows, clientCostRows, otherModelsByWeek } = buildChartData(
    data.contributions ?? [],
    modelKeyMap,
    clientNames,
  );

  const clientLabels = Object.fromEntries(
    clientNames.map((name) => [name, name]).concat([[OTHER_CLIENT_KEY, OTHER_CLIENT_LABEL]]),
  );

  return {
    stats: {
      totalTokens: stats.totalTokens,
      totalCost: stats.totalCost ?? 0,
      inputTokens: stats.inputTokens ?? 0,
      outputTokens: stats.outputTokens ?? 0,
      cacheReadTokens: stats.cacheReadTokens ?? 0,
      reasoningTokens: stats.reasoningTokens ?? 0,
      activeDays: stats.activeDays ?? 0,
      sessionCount: stats.sessionCount ?? 0,
    },
    models,
    favoriteModel: models[0] ?? null,
    series,
    chart: {
      keys: chartKeys,
      labels,
      rows,
      costRows,
      clientKeys: [...clientNames, OTHER_CLIENT_KEY],
      clientLabels,
      clientRows,
      clientCostRows,
      otherModelsByWeek,
    },
    biggestDay: findBiggestDay(series),
    dateRange: data.dateRange ?? null,
    updatedAt: data.updatedAt ?? null,
  };
}

export const getTokscaleInsights = unstable_cache(
  async () => {
    try {
      const response = await fetch(TOKSCALE_DATA_URL, {
        headers: {
          "User-Agent": "falakgala.dev (+https://falakgala.dev)",
          Accept: "text/html",
        },
      });

      if (!response.ok) return null;

      return toInsights(extractInitialData(await response.text()));
    } catch {
      return null;
    }
  },
  ["tokscale-insights"],
  { revalidate: REVALIDATE_SECONDS, tags: ["tokscale-insights"] },
);

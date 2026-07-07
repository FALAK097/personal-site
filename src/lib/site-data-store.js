"server-only";

import { batchD1, queryD1 } from "@/lib/cloudflare-d1";

const CACHE_KEY_MAX_LENGTH = 512;

function nowInSeconds() {
  return Math.floor(Date.now() / 1000);
}

function assertCacheKey(key) {
  if (
    typeof key !== "string" ||
    key.length === 0 ||
    key.length > CACHE_KEY_MAX_LENGTH
  ) {
    throw new Error("Invalid cache key.");
  }
}

export async function getCacheValue(key) {
  assertCacheKey(key);

  const now = nowInSeconds();
  const result = await queryD1(
    `SELECT value
     FROM kv_cache
     WHERE key = ? AND (expires_at IS NULL OR expires_at > ?)
     LIMIT 1`,
    [key, String(now)]
  );

  return result.results?.[0]?.value ?? null;
}

export async function setCacheValue(key, value, ttlSeconds) {
  assertCacheKey(key);

  const expiresAt =
    typeof ttlSeconds === "number" && ttlSeconds > 0
      ? String(nowInSeconds() + ttlSeconds)
      : null;

  if (!expiresAt) {
    await queryD1(
      `INSERT INTO kv_cache (key, value, expires_at)
       VALUES (?, ?, NULL)
       ON CONFLICT(key) DO UPDATE SET
         value = excluded.value,
         expires_at = NULL,
         updated_at = CURRENT_TIMESTAMP`,
      [key, String(value)]
    );
    return;
  }

  await queryD1(
    `INSERT INTO kv_cache (key, value, expires_at)
     VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET
       value = excluded.value,
       expires_at = excluded.expires_at,
       updated_at = CURRENT_TIMESTAMP`,
    [key, String(value), expiresAt]
  );
}

export async function trackUniqueVisitor(visitorId) {
  const results = await batchD1([
    {
      sql: "INSERT OR IGNORE INTO unique_visitors (visitor_id) VALUES (?)",
      params: [visitorId],
    },
    {
      sql: "SELECT COUNT(*) AS count FROM unique_visitors",
      params: [],
    },
  ]);

  return Number(results[1]?.results?.[0]?.count ?? 0);
}

export async function incrementRateLimit(key, windowSeconds) {
  assertCacheKey(key);

  const now = nowInSeconds();
  const expiresAt = now + windowSeconds;
  const results = await batchD1([
    {
      sql: "DELETE FROM rate_limits WHERE key = ? AND window_expires_at <= ?",
      params: [key, String(now)],
    },
    {
      sql: `INSERT OR IGNORE INTO rate_limits (key, attempts, window_expires_at)
            VALUES (?, 0, ?)`,
      params: [key, String(expiresAt)],
    },
    {
      sql: "UPDATE rate_limits SET attempts = attempts + 1 WHERE key = ?",
      params: [key],
    },
    {
      sql: "SELECT attempts FROM rate_limits WHERE key = ?",
      params: [key],
    },
  ]);

  return Number(results[3]?.results?.[0]?.attempts ?? 0);
}

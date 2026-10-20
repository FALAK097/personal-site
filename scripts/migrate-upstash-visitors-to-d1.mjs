const UPSTASH_VISITORS_KEY =
  process.env.UPSTASH_UNIQUE_VISITORS_KEY || "site:unique_visitors";
const D1_API_BASE_URL = "https://api.cloudflare.com/client/v4";
const INSERT_CHUNK_SIZE = 50;

function requiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

async function upstashCommand(command) {
  const response = await fetch(
    trimTrailingSlash(requiredEnv("UPSTASH_REDIS_REST_URL")),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${requiredEnv("UPSTASH_REDIS_REST_TOKEN")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    }
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.error) {
    throw new Error(
      payload?.error || `Upstash request failed with status ${response.status}`
    );
  }

  return payload.result;
}

async function d1Query(sql, params = []) {
  const accountId = requiredEnv("CLOUDFLARE_ACCOUNT_ID");
  const databaseId = requiredEnv("CLOUDFLARE_D1_DATABASE_ID");
  const apiToken = requiredEnv("CLOUDFLARE_D1_API_TOKEN");

  const response = await fetch(
    `${D1_API_BASE_URL}/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    }
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    const message =
      payload?.errors?.map((error) => error.message).join("; ") ||
      `Cloudflare D1 request failed with status ${response.status}`;
    throw new Error(message);
  }

  const queryResult = payload.result?.[0];

  if (!queryResult?.success) {
    throw new Error("Cloudflare D1 query failed.");
  }

  return queryResult;
}

function chunkArray(items, size) {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

async function countD1Visitors() {
  const result = await d1Query("SELECT COUNT(*) AS count FROM unique_visitors");
  return Number(result.results?.[0]?.count ?? 0);
}

async function migrateVisitors() {
  console.log(`Reading visitors from Upstash key "${UPSTASH_VISITORS_KEY}"...`);

  const visitors = await upstashCommand(["SMEMBERS", UPSTASH_VISITORS_KEY]);

  if (!Array.isArray(visitors)) {
    throw new Error("Upstash SMEMBERS did not return an array.");
  }

  const uniqueVisitors = [...new Set(visitors.filter(Boolean).map(String))];
  const beforeCount = await countD1Visitors();

  console.log(`Found ${uniqueVisitors.length} Upstash visitor IDs.`);
  console.log(`D1 currently has ${beforeCount} visitor IDs.`);

  for (const chunk of chunkArray(uniqueVisitors, INSERT_CHUNK_SIZE)) {
    const placeholders = chunk.map(() => "(?)").join(", ");
    await d1Query(
      `INSERT OR IGNORE INTO unique_visitors (visitor_id) VALUES ${placeholders}`,
      chunk
    );
  }

  const afterCount = await countD1Visitors();

  console.log(`D1 now has ${afterCount} visitor IDs.`);
  console.log(`Inserted ${Math.max(afterCount - beforeCount, 0)} new visitor IDs.`);
}

migrateVisitors().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

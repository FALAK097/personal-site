"server-only";

const D1_API_BASE_URL = "https://api.cloudflare.com/client/v4";

function getCloudflareD1Config() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_D1_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    throw new Error(
      "Cloudflare D1 is not configured. Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, and CLOUDFLARE_D1_API_TOKEN."
    );
  }

  return { accountId, databaseId, apiToken };
}

async function requestD1(body) {
  const { accountId, databaseId, apiToken } = getCloudflareD1Config();

  const response = await fetch(
    `${D1_API_BASE_URL}/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    const message =
      payload?.errors?.map((error) => error.message).join("; ") ||
      `Cloudflare D1 request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload.result;
}

export async function queryD1(sql, params = []) {
  const result = await requestD1({ sql, params });
  const queryResult = Array.isArray(result) ? result[0] : result;

  if (!queryResult?.success) {
    throw new Error("Cloudflare D1 query failed.");
  }

  return queryResult;
}

export async function batchD1(batch) {
  const result = await requestD1({ batch });

  if (!Array.isArray(result) || result.some((item) => !item?.success)) {
    throw new Error("Cloudflare D1 batch failed.");
  }

  return result;
}

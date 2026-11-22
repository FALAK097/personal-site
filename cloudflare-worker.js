// OpenNext generates ./.open-next/worker.js at build time.
// @ts-ignore
import nextWorker from "./.open-next/worker.js";

// Re-export OpenNext Durable Object classes required by wrangler.jsonc.
// @ts-ignore
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";

const HSTS_HEADER = "max-age=31536000; includeSubDomains";

function appendVaryAccept(headers) {
  const existing = headers.get("vary");
  if (!existing) {
    headers.set("Vary", "Accept");
    return;
  }
  const tokens = existing
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  if (!tokens.some((v) => v.toLowerCase() === "accept")) {
    headers.set("Vary", `${tokens.join(", ")}, Accept`);
  }
}

export default {
  async fetch(request, env, ctx) {
    const response = await nextWorker.fetch(request, env, ctx);
    const headers = new Headers(response.headers);

    const url = new URL(request.url);
    if (url.protocol === "https:") {
      headers.set("Strict-Transport-Security", HSTS_HEADER);
    }

    const contentType = (headers.get("content-type") || "").toLowerCase();
    if (
      contentType.includes("text/html") ||
      contentType.includes("text/markdown")
    ) {
      appendVaryAccept(headers);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

"use server";

import { z } from "zod";
import { batchD1, queryD1 } from "@/lib/cloudflare-d1";

// Lifetime unique visitors come from the D1 `unique_visitors` table (migrated
// from Upstash, see docs/cloudflare/upstash-to-d1-migration.md). Unlike the
// /stats Cloudflare zone analytics (capped at a 30-day window on this plan),
// this is an all-time count of real browsers — bots that never execute the
// footer's JS never get a visitorId.

const UniqueVisitorSchema = z.object({
  visitorId: z
    .string()
    .min(1, "visitorId is required")
    .max(100, "visitorId is too long"),
});

async function readLifetimeCount() {
  const result = await queryD1("SELECT COUNT(*) AS count FROM unique_visitors");
  return Number(result.results?.[0]?.count ?? 0);
}

// Records the visitor (idempotent via primary key) and returns the lifetime
// unique visitor count in one D1 round trip. A missing/invalid visitorId
// (localStorage blocked) still counts as a read-only lookup.
export async function siteVisitors(visitorId) {
  try {
    const validated =
      typeof visitorId === "string"
        ? UniqueVisitorSchema.safeParse({ visitorId })
        : null;

    if (validated?.success && process.env.NODE_ENV === "production") {
      const results = await batchD1([
        {
          sql: "INSERT OR IGNORE INTO unique_visitors (visitor_id) VALUES (?)",
          params: [validated.data.visitorId],
        },
        { sql: "SELECT COUNT(*) AS count FROM unique_visitors" },
      ]);
      return { visitors: Number(results[1]?.results?.[0]?.count ?? 0) };
    }

    // Dev never writes to the production D1 table (mirrors the dev guard in
    // cloudflare-analytics.js) — it only reads the current lifetime count.
    return { visitors: await readLifetimeCount() };
  } catch {
    // Null keeps the footer placeholder instead of flashing a wrong "0".
    return { visitors: null };
  }
}

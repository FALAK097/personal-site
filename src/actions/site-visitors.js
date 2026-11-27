"use server";

import { getSiteTraffic } from "@/lib/cloudflare-analytics";

// Footer visitor count shares the same Cloudflare zone analytics as /stats
// (getSiteTraffic is hourly-cached), so both surfaces always agree.
export async function siteVisitors() {
  try {
    const traffic = await getSiteTraffic();
    return { visitors: traffic?.totals?.visitors ?? 0 };
  } catch {
    return { visitors: 0 };
  }
}

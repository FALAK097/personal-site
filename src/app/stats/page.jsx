import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/custom/page-header";
import { TokenUsage } from "@/components/stats/token-usage";
import { SiteTraffic } from "@/components/stats/site-traffic";
import { getTokscaleInsights } from "@/lib/tokscale";
import { getSiteTraffic } from "@/lib/cloudflare-analytics";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Stats",
  description:
    "Live engineering metrics: AI token usage from Tokscale and edge visitor analytics for falakgala.dev synced from Cloudflare.",
  path: "/stats",
});

// Page refreshes hourly so site traffic stays current; Tokscale insights
// are cached for 3h with a 10s fetch timeout and stale-preservation on errors.
export const revalidate = 3600;

export default async function StatsPage() {
  const [insights, traffic] = await Promise.all([
    getTokscaleInsights().catch(() => null),
    getSiteTraffic(),
  ]);

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <div className="space-y-10">
          <PageHeader
            title="stats"
            intro="A running snapshot of my AI token usage and this site's traffic."
          />
          <TokenUsage insights={insights} />
          <div className="border-t border-border/70 pt-10">
            <SiteTraffic traffic={traffic} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

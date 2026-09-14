import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/custom/page-header";
import { TokenUsage } from "@/components/stats/token-usage";
import { SiteTraffic } from "@/components/stats/site-traffic";
import { getTokscaleInsights } from "@/lib/tokscale";
import { getSiteTraffic } from "@/lib/vercel-analytics";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Stats",
  description:
    "Metrics behind my work: AI token usage and build activity, synced from Tokscale.",
  path: "/stats",
});

// Page refreshes hourly so site traffic stays current; the Tokscale payload
// keeps its own 24h cache, so the heavier scrape is not repeated.
export const revalidate = 3600;

export default async function StatsPage() {
  const [insights, traffic] = await Promise.all([getTokscaleInsights(), getSiteTraffic()]);

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

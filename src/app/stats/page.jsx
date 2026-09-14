import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/custom/page-header";
import { TokenUsage, TokscaleLink } from "@/components/stats/token-usage";
import { getTokscaleInsights } from "@/lib/tokscale";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Stats",
  description:
    "Metrics behind my work — AI token usage and build activity, synced from Tokscale.",
  path: "/stats",
});

export const revalidate = 86400;

export default async function StatsPage() {
  const insights = await getTokscaleInsights();

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <div className="space-y-10">
          <PageHeader
            title="stats"
            intro={
              <>
                Tokens my AI coding agents burn{" "}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/fire.gif"
                  alt=""
                  className="inline-block h-5 w-auto align-[-4px]"
                  aria-hidden="true"
                />
                , tracked with <TokscaleLink />.
              </>
            }
          />
          <TokenUsage insights={insights} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

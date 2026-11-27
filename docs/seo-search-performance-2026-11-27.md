# Search performance baseline — 2026-11-27

## Executive summary

- Google Search Console reports **11 clicks, 677 impressions, 1.62% CTR, and an average position of 8.9** over the latest 28-day window.
- All **14 published articles are indexed**. URL Inspection found no canonical, robots, fetch, or coverage issues.
- The submitted sitemap contains **21 URLs**, was downloaded by Google on 2026-11-26, and has **zero errors or warnings**.
- The highest-leverage page is the Obsidian + Syncthing guide. It produced **389 impressions and 5 clicks** in the current comparison period at an average position of **8.0**. Its 1.29% CTR leaves room for a clearer title and snippet.
- The recently published Mac, terminal, and Woodpecker articles were indexed within days, but most are too new to have statistically useful query data. Their first meaningful evaluation should happen after another 2–4 weeks of impressions.
- Bing Webmaster API access was recovered from the established T3 setup. Bing currently reports **16 pages in its index**, **26 pages crawled** on the latest available day, **3 aggregate crawl errors**, and **0 impressions / 0 clicks** in the available traffic window. `GetCrawlIssues` returns no active URL-level issues, so the aggregate errors cannot currently be mapped to a live URL. The sitemap was accepted again with HTTP 200; Bing's stored feed still reports the earlier 15-URL snapshot and should refresh to the current 21 URLs after recrawling.

## Google Search Console evidence

| Area | Result | Interpretation |
| --- | ---: | --- |
| Last 28 days | 11 clicks / 677 impressions | Visibility is growing faster than clicks |
| CTR | 1.62% | Improve titles and descriptions on pages already near page one |
| Average position | 8.9 | Several pages are close enough for on-page improvements to matter |
| Indexed articles | 14 / 14 | No coverage remediation needed |
| Sitemap | 21 URLs, 0 errors, 0 warnings | Discovery pipeline is healthy |

## Bing Webmaster evidence

| Area | Result | Interpretation |
| --- | ---: | --- |
| Verified property | `https://falakgala.dev/` | API access and ownership are working |
| Latest crawl day | 26 pages crawled / 16 in index | Bing is crawling the site, but index coverage trails Google's 21-URL sitemap |
| Crawl responses | 19 successful responses / 0 4xx / 0 5xx | No HTTP failure pattern is visible |
| Crawl issues | 3 aggregate errors; 0 active URL-level issues | Monitor next week; the API does not currently expose affected URLs |
| Search performance | 0 impressions / 0 clicks in the available window | No Bing query or page ranking data exists yet |
| Sitemap | Success; stored snapshot 15 URLs | Sitemap resubmitted successfully; wait for Bing to refresh to 21 URLs |

The Bing traffic API currently returns empty query and page datasets, so there are no evidence-backed Bing keyword rankings to optimize yet. Google Search Console remains the useful ranking source for this week's content decisions.

### Page-level opportunities

| Page | Current signal | Action |
| --- | --- | --- |
| Obsidian + Syncthing | 389 impressions, 5 clicks, position 8.0 | Match the exact cross-device/free-sync intent, answer the main question immediately, and improve heading hierarchy |
| Dokploy deployment | 36 impressions, position 6.7 | Preserve the production case-study angle and link it bidirectionally with the Woodpecker CI article |
| WhatsApp setup, part 1 | 21 impressions, 1 click, position 14.8 | Refresh against current Meta flows before changing technical instructions |
| Graph RAG case study | 8 impressions, position 5.6 | Keep the differentiated 22,000-document and multilingual proof; strengthen links to portfolio work |
| Projects | 13 impressions, position 5.0 | Use a descriptive AI/SaaS/developer-project title instead of the generic “Projects” title |
| Home | 24 impressions, position 2.1 | Make the visible H1 and opening copy describe Falak's software and AI engineering work |

## Keyword and intent map

These phrases are editorial targets for titles, headings, introductions, internal links, and future updates. They are not a recommendation to repeat phrases unnaturally or rely on the obsolete meta-keywords tag.

| Article | Primary intent | Supporting phrases |
| --- | --- | --- |
| Terminal setup | developer terminal setup | Ghostty Zsh setup; modern CLI tools for macOS; Powerlevel10k setup; eza bat ripgrep fzf zoxide |
| Keep Mac awake | keep Mac awake for AI agents | macOS caffeinate command; Raycast Coffee; Amphetamine Mac; prevent Mac sleep during builds |
| Mac developer apps | best Mac apps for developers | Mac apps for AI coding; developer productivity apps; OrbStack Ghostty Raycast |
| Mac storage and battery | clean AI coding worktrees on Mac | git worktree cleanup; Mole Mac cleaner; AlDente battery limit; developer storage cleanup |
| Woodpecker CI | self-hosted GitHub Actions alternative | Woodpecker CI migration; Woodpecker Docker; self-hosted CI/CD; GitHub Actions cost |
| Mac utilities | best Mac utilities | fix macOS defaults; LinearMouse; BetterDisplay; LocalSend; AltTab |
| Obsidian + Syncthing | sync Obsidian across devices for free | Syncthing Obsidian; Obsidian Syncthing Android; Obsidian on multiple devices; Syncthing conflicts |
| Graph RAG | production Graph RAG architecture | multilingual PDF RAG; Qdrant Neo4j RAG; RAG evaluation; citation-first RAG |
| Free domain email | free custom domain email | Cloudflare Email Routing Gmail; send from custom domain in Gmail; free business email forwarding |
| Dokploy deployment | deploy Next.js and FastAPI on a VPS | Dokploy Next.js; GHCR Dokploy; zero-build deployment; Docker VPS deployment |
| WhatsApp part 1 | WhatsApp Cloud API setup | Next.js WhatsApp Cloud API; Meta webhook setup; WhatsApp test number |
| WhatsApp part 2 | WhatsApp Cloud API Next.js OAuth | Prisma WhatsApp integration; HMAC webhook verification; WhatsApp token refresh |
| Fumadocs blog | Next.js Fumadocs blog | Next.js MDX blog; Fumadocs MDX; typed content collections |
| Visitor counter | Next.js unique visitor counter | Cloudflare D1 visitor counter; Upstash Redis unique visitors; privacy-friendly analytics |

## Market and SERP findings

- **Obsidian sync:** Search demand is already visible in GSC. Competing pages lead with “free,” “every device,” and direct question answers. The article now targets that intent while keeping the honest iOS and backup caveats.
- **Mac sleep for AI agents:** A new content cluster has formed around `caffeinate`, Amphetamine, and dedicated agent-aware utilities. The existing three-option comparison is well aligned; future updates should compare automatic stop behavior and closed-lid constraints with first-party sources.
- **AI worktree storage:** Direct competition is still thin, and this site's article already appeared in the researched result set. The worktree-specific framing is more defensible than a generic Mac-cleaner list.
- **Woodpecker CI:** Most competing pages are migration diaries or install guides. The production failure modes—Docker socket, Buildx cleanup, concurrency, branch fetches, and secret parsing—are the article's strongest differentiator.
- **Graph RAG:** Many results are generic PDF RAG walkthroughs. The multilingual scale, hybrid Qdrant + Neo4j design, evaluation, guardrails, and citation UX provide a stronger expert angle.
- **Mac app lists:** This is the most crowded topic. The articles should keep their concrete problem/solution framing and original screenshots rather than expand into interchangeable “best apps” lists.
- **Dokploy:** The article already surfaced in research for the exact Next.js + FastAPI + VPS query. Bidirectional links with the Woodpecker article strengthen the deployment cluster.

## Changes made in this pass

1. Rewrote the Obsidian article title and description around the actual GSC queries.
2. Added a concise answer-first section covering free cross-device sync and the iOS caveat.
3. Corrected skipped heading levels in the Obsidian, Fumadocs, visitor-counter, and Dokploy articles.
4. Added relevant internal links between Obsidian and Mac apps, Dokploy and Woodpecker, the visitor counter and Fumadocs, and Graph RAG and projects.
5. Made the writing and projects metadata descriptive enough to communicate their topic without site context while preserving the existing homepage header and introduction.

## Weekly review checklist

1. Compare the latest complete 28 days against the preceding 28 days in Google Search Console.
2. Pull query and page data, then flag pages with at least 25 impressions and either CTR below 2% or average position from 4–15.
3. Inspect every newly published or updated URL for indexing, Google-selected canonical, crawl status, and rich-result errors.
4. Check the sitemap download timestamp, errors, and warnings.
5. Pull Bing Webmaster performance, crawl issues, index counts, URL information, and sitemap status through the exposed MCP or the established API path from the prior T3 thread. Do not stop at the current tool label inventory.
6. Research the live result set for the top three opportunities and compare title, intent, freshness, depth, original evidence, and question coverage.
7. Make only evidence-backed title, description, heading, internal-link, and copy changes. Avoid keyword stuffing and unsupported claims.
8. Run the local build, report the files changed, and leave deployment or publishing actions explicit.

## Research sources

- Google Search Console MCP: performance, page/query comparisons, sitemap status, and URL Inspection for all 14 articles.
- Firecrawl: live site map and current result research for terminal setup, Mac sleep, Mac apps, worktree storage, Woodpecker CI, Mac utilities, Obsidian sync, Graph RAG, custom email, and Dokploy.
- Google Search Central: SEO starter guidance, title links, snippets, internal links, and search-friendly language.
- Bing Webmaster API: verified-site, feed, crawl, issue, query, page, traffic, and sitemap-submission data.
- Bing Webmaster Guidelines and Keyword Research documentation: query research, original content, and anti-keyword-stuffing guidance.

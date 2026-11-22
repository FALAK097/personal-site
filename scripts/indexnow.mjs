// Submit every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam, Naver, and others).
// Google does not support IndexNow; use Google Search Console for Google.
//
//   node scripts/indexnow.mjs            # submit all sitemap URLs
//   node scripts/indexnow.mjs <url> ...  # submit specific URLs
//
// The key file is served from /public so search engines can verify host ownership.

import { readdirSync } from "node:fs";

const HOST = "falakgala.dev";
const ORIGIN = `https://${HOST}`;

const keyFile = readdirSync(new URL("../public/", import.meta.url)).find((name) =>
  /^[a-f0-9]{32}\.txt$/.test(name),
);
if (!keyFile) {
  throw new Error("No IndexNow key file (<32 hex chars>.txt) found in public/.");
}
const key = keyFile.replace(/\.txt$/, "");

async function sitemapUrls() {
  const response = await fetch(`${ORIGIN}/sitemap.xml`, {
    headers: { "User-Agent": "falakgala-indexnow/1.0" },
  });
  if (!response.ok) {
    throw new Error(`Sitemap fetch failed: ${response.status}`);
  }
  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

const argUrls = process.argv.slice(2);
const urlList = argUrls.length ? argUrls : await sitemapUrls();

if (!urlList.length) {
  throw new Error("No URLs found to submit to IndexNow.");
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key,
    keyLocation: `${ORIGIN}/${keyFile}`,
    urlList,
  }),
});

// 200 = accepted, 202 = accepted pending key validation. Anything else needs attention.
console.log(`IndexNow: submitted ${urlList.length} URLs, HTTP ${response.status}`);
if (response.status !== 200 && response.status !== 202) {
  console.error(await response.text());
  process.exit(1);
}

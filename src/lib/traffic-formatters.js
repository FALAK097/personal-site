const exactFormatter = new Intl.NumberFormat("en-US");
const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

export const CLOUDFLARE_ANALYTICS_URL =
  "https://www.cloudflare.com/application-services/products/analytics/?utm_source=falakgala.dev&utm_medium=referral";

export function formatCompact(value) {
  const num = Number(value) || 0;
  if (num < 1_000) return exactFormatter.format(num);
  return compactFormatter.format(num).toLowerCase();
}

export function formatExact(value) {
  return exactFormatter.format(Number(value) || 0);
}

export function countryFlag(code) {
  if (!code || typeof code !== "string") return null;
  const clean = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(clean)) return null;
  return String.fromCodePoint(
    ...clean.split("").map((char) => 0x1f1e6 + char.charCodeAt(0) - 65),
  );
}

export function faviconUrl(host) {
  if (!host || host === "direct" || host === "others") return null;
  return `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(host)}`;
}

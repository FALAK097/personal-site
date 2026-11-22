import { NextResponse } from "next/server";

const SCANNER_PREFIXES = [
  "/.env",
  "/.git",
  "/.aws",
  "/.vscode",
  "/wp-admin",
  "/wp-login",
  "/wp-content",
  "/wp-includes",
  "/xmlrpc.php",
  "/phpmyadmin",
  "/actuator",
  "/debug",
  "/server-status",
];

const MARKDOWN_EXCLUDED_PREFIXES = [
  "/api/",
  "/_next/",
  "/.well-known/",
];

function prefersMarkdown(acceptHeader) {
  if (!acceptHeader || !acceptHeader.includes("text/markdown")) return false;

  const entries = acceptHeader.split(",").map((part) => {
    const [rawType, ...params] = part.trim().toLowerCase().split(";");
    const qParam = params.find((p) => p.trim().startsWith("q="));
    const q = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1;
    return { type: rawType.trim(), q: Number.isFinite(q) ? q : 1 };
  });

  const md = entries.find((e) => e.type === "text/markdown");
  if (!md || md.q <= 0) return false;

  const html = entries.find((e) => e.type === "text/html");
  if (!html) return true;

  return md.q >= html.q;
}

function withSecurityAndVaryHeaders(response) {
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );
  const existingVary = response.headers.get("vary");
  if (!existingVary) {
    response.headers.set("Vary", "Accept");
  } else if (
    !existingVary
      .split(",")
      .map((v) => v.trim().toLowerCase())
      .includes("accept")
  ) {
    response.headers.set("Vary", `${existingVary}, Accept`);
  }
  return response;
}

export function middleware(request) {
  const host = (
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    ""
  )
    .split(":")[0]
    .toLowerCase();

  if (host === "www.falakgala.dev") {
    const targetUrl = new URL(
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
      "https://falakgala.dev",
    );
    return NextResponse.redirect(targetUrl, 308);
  }

  const { pathname } = request.nextUrl;
  const lowerPath = pathname.toLowerCase();

  // Drop automated vulnerability scanner probes before invoking the app router
  if (
    SCANNER_PREFIXES.some((prefix) => lowerPath.startsWith(prefix)) ||
    lowerPath.endsWith(".php")
  ) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Drop malformed Next-Action header probes from automated scanners
  const nextAction = request.headers.get("next-action");
  if (nextAction !== null && !/^[0-9a-f]{40,42}$/i.test(nextAction)) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // Serve Markdown representations when agents negotiate Accept: text/markdown
  if (
    (request.method === "GET" || request.method === "HEAD") &&
    !MARKDOWN_EXCLUDED_PREFIXES.some((prefix) => lowerPath.startsWith(prefix)) &&
    !pathname.includes(".") &&
    prefersMarkdown(request.headers.get("accept") || "")
  ) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = "/api/md";
    rewriteUrl.search = `?path=${encodeURIComponent(pathname)}`;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-markdown-path", pathname);
    return withSecurityAndVaryHeaders(
      NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } }),
    );
  }

  return withSecurityAndVaryHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

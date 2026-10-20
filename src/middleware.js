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

export function middleware(request) {
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

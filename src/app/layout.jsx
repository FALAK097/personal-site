import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { MotionProvider } from "@/components/motion-provider";

import { ScrollProgress } from "@/components/custom/scroll-progress";
import { ScrollToTop } from "@/components/scroll-to-top";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Falak Gala's Portfolio",
    template: "%s | Falak Gala's Portfolio",
  },
  description:
    "Software engineer building across product engineering, AI systems, infrastructure, and full-stack software. Writing about what I ship and how it works.",
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "Falak Gala",
    "software engineer",
    "AI engineer",
    "full-stack developer",
    "Next.js",
    "FastAPI",
    "RAG",
    "system design",
  ],
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: "Falak Gala's Portfolio",
    description:
      "Software engineer building across product engineering, AI systems, infrastructure, and full-stack software.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@FalakGala097",
    site: "@FalakGala097",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body suppressHydrationWarning>
        <ThemeProvider
          disableTransitionOnChange
          attribute="class"
          enableSystem={true}
        >
          <MotionProvider>
            {children}
            <ScrollProgress />
            <ScrollToTop />
            <Toaster />
          </MotionProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

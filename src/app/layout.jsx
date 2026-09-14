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

export const metadata = {
  metadataBase: new URL("https://falakgala.dev"),
  title: {
    default: "Falak Gala's Portfolio",
    template: "%s | Falak Gala's Portfolio",
  },
  description: "My personal space on the web",
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

import { Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { MotionProvider } from "@/components/motion-provider";

const outfit = Outfit({ subsets: ["latin"], display: "swap" });
import { ScrollProgress } from "@/components/custom/scroll-progress";
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
    <html suppressHydrationWarning lang="en" className={outfit.className}>
      <body suppressHydrationWarning>
        <ThemeProvider
          disableTransitionOnChange
          attribute="class"
          enableSystem={true}
        >
          <MotionProvider>
            <div className="min-h-screen p-4 bg-background/50">
              <div className="rounded-lg border-2 border-border min-h-[calc(100vh-2rem)]">
                {children}
              </div>
            </div>
            <ScrollProgress />
            <Toaster />
          </MotionProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

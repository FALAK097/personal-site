import { Outfit } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";

const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"]
});
import { ScrollProgress } from "@/components/custom/scroll-progress";
import { AskAIWidget } from "@/components/ai/ask-ai-widget";
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
    <ViewTransitions>
      <html suppressHydrationWarning lang="en" className={outfit.className}>
        <body suppressHydrationWarning>
          <ThemeProvider
            disableTransitionOnChange
            attribute="class"
            enableSystem={true}
          >
            <div className="min-h-screen p-4 bg-background/50">
              <div className="rounded-lg border-2 border-border min-h-[calc(100vh-2rem)]">
                {children}
              </div>
            </div>
            <ScrollProgress />
            <Toaster />
            {/* <AskAIWidget /> */}
          </ThemeProvider>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ViewTransitions>
  );
}

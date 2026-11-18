import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
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
    "Next.js portfolio",
    "Next.js",
    "UI/UX engineering",
    "design engineering",
    "TypeScript",
    "FastAPI",
    "RAG",
    "system design",
    "Cloudflare Workers",
    "Waitlyze",
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

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://falakgala.dev/#person",
      name: "Falak Gala",
      url: "https://falakgala.dev",
      image: "https://falakgala.dev/profile.png",
      email: "mailto:hi@falakgala.dev",
      jobTitle: "Software & AI Engineer",
      description:
        "Software engineer building production AI systems, SaaS products, and minimalist Next.js interfaces.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mumbai",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      worksFor: {
        "@type": "Organization",
        name: "SSingularitee Technologies",
      },
      alumniOf: [
        {
          "@type": "CollegeOrUniversity",
          name: "KC College of Engineering",
        },
        {
          "@type": "EducationalOrganization",
          name: "K.J Somaiya Polytechnic",
        },
      ],
      knowsAbout: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "UI/UX Design Engineering",
        "Python",
        "FastAPI",
        "Graph RAG",
        "AI Voice Agents",
        "PostgreSQL",
        "Cloudflare Workers",
      ],
      sameAs: [
        "https://github.com/FALAK097",
        "https://x.com/FalakGala097",
        "https://www.linkedin.com/in/falak-gala",
        "https://dev.to/falakgala",
        "https://waitlyze.com",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://falakgala.dev/#website",
      name: "Falak Gala",
      url: "https://falakgala.dev",
      description:
        "Portfolio and engineering blog of Falak Gala — product engineering, AI systems, infrastructure, and minimalist Next.js design.",
      publisher: {
        "@id": "https://falakgala.dev/#person",
      },
      author: {
        "@id": "https://falakgala.dev/#person",
      },
      inLanguage: "en-US",
    },
    {
      "@type": "ProfilePage",
      "@id": "https://falakgala.dev/#profilepage",
      url: "https://falakgala.dev",
      name: "Falak Gala — Software, AI & Next.js Product Engineer",
      isPartOf: {
        "@id": "https://falakgala.dev/#website",
      },
      mainEntity: {
        "@id": "https://falakgala.dev/#person",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
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
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "29336135db17443cb968a165382e8a84"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

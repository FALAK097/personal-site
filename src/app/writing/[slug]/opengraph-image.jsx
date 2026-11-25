import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";
import { getPostBySlug, getAllPosts } from "@/lib/blog-source";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export const alt = "Falak Gala's Writing";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Load local Geist fonts for ultra-crisp typography
const geistBlackPath = path.join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-Black.ttf");
const geistRegularPath = path.join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf");
const geistBlack = fs.readFileSync(geistBlackPath);
const geistRegular = fs.readFileSync(geistRegularPath);

// Post-specific themes and visual identities
const POST_THEMES = {
  "sync-obsidian-notes-with-syncthing": {
    badge: "Obsidian × Syncthing",
    primary: "#74D600", // Vibrant Neon Lime (from reference cover)
    secondary: "#7C3AED", // Obsidian Purple
    highlights: ["Obsidian Notes", "Syncthing"],
    subtitle: "A simple, self-hosted setup for seamless sync",
    type: "syncthing-devices",
  },
  "production-graph-rag-22000-multilingual-pdfs": {
    badge: "Graph RAG × AI Engineering",
    primary: "#8B5CF6", // Electric AI Violet
    secondary: "#06B6D4", // Cyan
    highlights: ["Graph RAG", "22000", "Multilingual PDFs"],
    subtitle: "Scaling ingestion, hybrid retrieval, citations & guardrails",
    type: "graph-rag",
  },
  "zero-build-deployments-with-dokploy": {
    badge: "VPS Deployments × Dokploy",
    primary: "#F59E0B", // DevOps Amber
    secondary: "#2563EB", // Docker Blue
    highlights: ["Production", "Nextjs", "FastAPI", "VPS"],
    subtitle: "Zero-build CI/CD pipeline with Dokploy, Docker & Traefik",
    type: "devops-vps",
  },
  "free-custom-email-domain": {
    badge: "Custom Domain × Cloudflare",
    primary: "#F97316", // Cloudflare Orange
    secondary: "#EC4899", // Rose
    highlights: ["Free", "Custom Email", "hiyourdomaincom"],
    subtitle: "Professional domain email forwarding to Gmail at zero cost",
    type: "email-routing",
  },
  "whatsapp-setup-guide-part-1": {
    badge: "WhatsApp API × Next.js · Part 1",
    primary: "#10B981", // WhatsApp Emerald Green
    secondary: "#059669", // Deep Emerald
    highlights: ["WhatsApp Cloud API", "Setup Configuration"],
    subtitle: "Meta app setup, OAuth credentials & webhook verification",
    type: "whatsapp-api",
  },
  "whatsapp-setup-guide-part-2": {
    badge: "WhatsApp API × Next.js · Part 2",
    primary: "#0D9488", // Deep Teal
    secondary: "#0284C7", // Sky Blue
    highlights: ["WhatsApp Cloud API", "Implementation"],
    subtitle: "OAuth 2.0 exchange, 60-day token refresh & signed webhooks",
    type: "whatsapp-code",
  },
  "tracking-unique-visitors": {
    badge: "Next.js × Redis & D1",
    primary: "#EF4444", // Upstash / Redis Crimson
    secondary: "#8B5CF6", // Violet
    highlights: ["Unique Visitors Counter", "Upstash Redis"],
    subtitle: "Cookie-free visitor tracking with Server Actions, Redis & D1",
    type: "redis-analytics",
  },
  "how-i-built-nextjs-blog": {
    badge: "Next.js 16 × Fumadocs",
    primary: "#6366F1", // Electric Indigo
    secondary: "#0EA5E9", // Sky Blue
    highlights: ["Portfolio Blog", "Nextjs", "Fumadocs"],
    subtitle: "From a hand-rolled MDX pipeline to a typed publishing system",
    type: "nextjs-blog",
  },
  "every-developer-should-set-up-their-terminal-like-this": {
    badge: "Ghostty × Zsh × CLI",
    primary: "#7C3AED",
    secondary: "#10B981",
    highlights: ["Terminal", "Like This"],
    subtitle: "Ghostty, Powerlevel10k, eza, bat, ripgrep, fzf, zoxide & lazygit",
    type: "ghostty-terminal",
  },
  "keep-your-mac-awake-while-ai-agents-code": {
    badge: "Amphetamine × Raycast × caffeinate",
    primary: "#9333EA",
    secondary: "#EA580C",
    highlights: ["Amphetamine", "Raycast", "caffeinate"],
    subtitle: "Keep display & system awake with Amphetamine, Raycast Coffee, or caffeinate",
    type: "keep-mac-awake",
  },
  "reclaim-mac-storage-and-battery-mole-aldente": {
    badge: "Mole × AlDente",
    primary: "#059669",
    secondary: "#EA580C",
    highlights: ["Gigabytes", "Worktrees", "Mole", "AlDente"],
    subtitle: "Purge AI worktree bloat safely and cap desk charging at 80%",
    type: "mole-aldente",
  },
  "stop-paying-for-github-actions-self-host-woodpecker-ci": {
    badge: "Woodpecker CI × Self-Hosting",
    primary: "#EA580C",
    secondary: "#0F172A",
    highlights: ["GitHub", "Actions", "Woodpecker"],
    subtitle: "Hybrid PR gates, Docker builds & Dokploy deploys on your own VPS",
    type: "woodpecker-ci",
  },
  "underrated-mac-utilities-that-fix-macos-defaults": {
    badge: "macOS Stack × Part 2",
    primary: "#0D9488",
    secondary: "#6366F1",
    highlights: ["Mac", "Utilities", "Defaults"],
    subtitle: "LinearMouse, Thock, Hand Mirror, Cap, Granola & LocalSend",
    type: "mac-apps-polish",
  },
  "mac-apps-for-developers-and-ai-workflows": {
    badge: "macOS Stack × Part 1",
    primary: "#0284C7",
    secondary: "#EA580C",
    highlights: ["Mac", "Apps", "Dev", "Workflow", "Fast"],
    subtitle: "OpenUsage, Trimmy, PortKiller, Ghostty, OrbStack & Syncthing",
    type: "mac-apps-dev",
  },
};

// Generates the halftone dot pattern matching the reference cover
function generateHalftoneDots(primaryColor) {
  const dots = [];

  // Top-left radiating cluster
  for (let x = 12; x <= 460; x += 18) {
    for (let y = 12; y <= 240; y += 18) {
      const dist = x * 0.7 + y * 0.9;
      if (dist < 380) {
        const factor = 1 - dist / 380;
        const r = Math.max(1.5, 4.8 * factor);
        const opacity = Math.max(0.25, 0.95 * factor);
        dots.push(
          <circle
            key={`tl-${x}-${y}`}
            cx={x}
            cy={y}
            r={r}
            fill={primaryColor}
            opacity={opacity}
          />
        );
      }
    }
  }

  // Top-center gentle wave cluster
  for (let x = 320; x <= 580; x += 18) {
    for (let y = 12; y <= 140; y += 18) {
      const wave = Math.sin((x - 320) / 45) * 35 + 45;
      const diff = Math.abs(y - wave);
      if (diff < 42) {
        const factor = 1 - diff / 42;
        const r = Math.max(1.4, 3.6 * factor);
        const opacity = Math.max(0.2, 0.7 * factor);
        dots.push(
          <circle
            key={`tc-${x}-${y}`}
            cx={x}
            cy={y}
            r={r}
            fill={primaryColor}
            opacity={opacity}
          />
        );
      }
    }
  }

  // Bottom-right radiating cluster
  for (let x = 740; x <= 1200; x += 18) {
    for (let y = 360; y <= 630; y += 18) {
      const dx = 1200 - x;
      const dy = 630 - y;
      const dist = Math.sqrt(dx * dx * 0.55 + dy * dy);
      if (dist < 460) {
        const factor = 1 - dist / 460;
        const r = Math.max(1.6, 5.2 * factor);
        const opacity = Math.max(0.25, 1 * factor);
        dots.push(
          <circle
            key={`br-${x}-${y}`}
            cx={x}
            cy={y}
            r={r}
            fill={primaryColor}
            opacity={opacity}
          />
        );
      }
    }
  }

  return dots;
}

// Splits title into words and highlights the target phrases
function renderTitle(title, highlights, primaryColor, fontSize) {
  const targetWords = new Set();
  highlights.forEach((phrase) => {
    phrase
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-Z0-9+]/g, "").toLowerCase())
      .filter((w) => w.length > 2 && !["with", "and", "for", "the", "how", "part"].includes(w))
      .forEach((w) => targetWords.add(w));
  });

  const words = title.split(" ");
  const elements = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const cleanWord = word.replace(/[^a-zA-Z0-9+]/g, "").toLowerCase();
    const isHighlighted = targetWords.has(cleanWord);

    elements.push(
      <span
        key={i}
        style={{
          color: isHighlighted ? primaryColor : "#09090b",
          marginRight: "0.26em",
          display: "flex",
          fontWeight: 900,
        }}
      >
        {word}
      </span>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        fontSize: fontSize,
        fontWeight: 900,
        lineHeight: 1.08,
        letterSpacing: "-0.035em",
        margin: 0,
      }}
    >
      {elements}
    </div>
  );
}

// Specialized right-hand tech illustration components
function renderIllustration(type, primary, secondary) {
  switch (type) {
    case "syncthing-devices":
      return (
        <svg width="450" height="380" viewBox="0 0 450 380" fill="none">
          {/* Obsidian Gem (Top Left) */}
          <g transform="translate(45, 30)">
            <path d="M40 0 L68 28 L56 75 L24 75 L12 28 Z" fill="#7C3AED" />
            <path d="M40 0 L68 28 L40 45 Z" fill="#9333EA" />
            <path d="M40 0 L12 28 L40 45 Z" fill="#A855F7" />
            <path d="M12 28 L40 45 L24 75 Z" fill="#6D28D9" />
            <path d="M68 28 L40 45 L56 75 Z" fill="#581C87" />
          </g>

          {/* Curved Sync Arrows (Center Top) */}
          <g transform="translate(160, 42)">
            <path
              d="M10 14 C25 2, 50 2, 65 14"
              stroke="#09090b"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M66 6 L72 16 L58 18 Z" fill="#09090b" />
            <path
              d="M65 34 C50 46, 25 46, 10 34"
              stroke="#09090b"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M9 42 L3 32 L17 30 Z" fill="#09090b" />
          </g>

          {/* Syncthing Node Ring (Top Right) */}
          <g transform="translate(265, 32)">
            <circle cx="36" cy="36" r="34" fill="#0284C7" />
            <circle cx="36" cy="36" r="28" stroke="#ffffff" strokeWidth="3" fill="none" />
            <circle cx="36" cy="18" r="6" fill="#ffffff" />
            <circle cx="21" cy="46" r="6" fill="#ffffff" />
            <circle cx="51" cy="46" r="6" fill="#ffffff" />
            <line x1="36" y1="18" x2="21" y2="46" stroke="#ffffff" strokeWidth="3" />
            <line x1="36" y1="18" x2="51" y2="46" stroke="#ffffff" strokeWidth="3" />
            <line x1="21" y1="46" x2="51" y2="46" stroke="#ffffff" strokeWidth="3" />
          </g>

          {/* Dashed Connecting Lines to Devices */}
          <line
            x1="85"
            y1="115"
            x2="95"
            y2="180"
            stroke="#71717a"
            strokeWidth="2.5"
            strokeDasharray="6 6"
          />
          <line
            x1="195"
            y1="95"
            x2="245"
            y2="180"
            stroke="#71717a"
            strokeWidth="2.5"
            strokeDasharray="6 6"
          />
          <line
            x1="300"
            y1="115"
            x2="335"
            y2="195"
            stroke="#71717a"
            strokeWidth="2.5"
            strokeDasharray="6 6"
          />

          {/* Laptop (Bottom Left) */}
          <g transform="translate(10, 180)">
            <rect x="15" y="0" width="155" height="105" rx="8" fill="#18181b" />
            <rect x="22" y="7" width="141" height="91" rx="4" fill="#f4f4f5" />
            <line x1="32" y1="30" x2="70" y2="30" stroke="#d4d4d8" strokeWidth="4" strokeLinecap="round" />
            <line x1="32" y1="42" x2="85" y2="42" stroke="#d4d4d8" strokeWidth="4" strokeLinecap="round" />
            <line x1="32" y1="54" x2="60" y2="54" stroke="#d4d4d8" strokeWidth="4" strokeLinecap="round" />
            <path d="M120 34 L132 46 L127 64 L113 64 L108 46 Z" fill="#7C3AED" />
            <path d="M0 105 L185 105 L175 113 L10 113 Z" fill="#27272a" />
            <rect x="70" y="107" width="45" height="4" rx="2" fill="#71717a" />
          </g>

          {/* Tablet (Bottom Center) */}
          <g transform="translate(205, 180)">
            <rect x="0" y="0" width="90" height="112" rx="8" fill="#18181b" />
            <rect x="5" y="5" width="80" height="102" rx="4" fill="#f4f4f5" />
            <path d="M45 35 L54 45 L50 60 L39 60 L35 45 Z" fill="#7C3AED" />
            <line x1="20" y1="72" x2="70" y2="72" stroke="#d4d4d8" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="28" y1="82" x2="62" y2="82" stroke="#d4d4d8" strokeWidth="3.5" strokeLinecap="round" />
          </g>

          {/* Smartphone (Bottom Right) */}
          <g transform="translate(310, 195)">
            <rect x="0" y="0" width="52" height="95" rx="7" fill="#18181b" />
            <rect x="4" y="4" width="44" height="87" rx="4" fill="#f4f4f5" />
            <path d="M26 32 L32 40 L30 52 L22 52 L19 40 Z" fill="#7C3AED" />
            <line x1="14" y1="62" x2="38" y2="62" stroke="#d4d4d8" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "graph-rag":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "410px",
            height: "350px",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            border: "2px solid #E4E4E7",
            padding: "24px",
            boxShadow: "0 20px 40px rgba(139, 92, 246, 0.12)",
          }}
        >
          {/* Top Row: Corpus Badge */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 14px",
                borderRadius: 9999,
                backgroundColor: "#F3E8FF",
                color: "#7C3AED",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              22,000 PDF Corpus
            </div>
            <div style={{ display: "flex", fontSize: 13, color: "#64748B", fontWeight: 600 }}>
              Hybrid Retrieval
            </div>
          </div>

          {/* Middle: Documents + Graph Flow */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
            {/* Document Stack */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "14px",
                backgroundColor: "#F8FAFC",
                borderRadius: "12px",
                border: "1.5px solid #CBD5E1",
                width: "140px",
              }}
            >
              <div style={{ display: "flex", fontSize: 11, fontWeight: 700, color: "#8B5CF6" }}>
                [1] English PDF
              </div>
              <div style={{ display: "flex", fontSize: 11, fontWeight: 700, color: "#06B6D4" }}>
                [2] Arabic PDF
              </div>
              <div style={{ display: "flex", fontSize: 11, fontWeight: 700, color: "#10B981" }}>
                [3] Spanish PDF
              </div>
            </div>

            {/* Connecting Arrow */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Knowledge Graph Cluster */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "160px",
                height: "110px",
                backgroundColor: "#FAF5FF",
                borderRadius: "14px",
                border: "2px solid #8B5CF6",
                padding: "10px",
              }}
            >
              <div style={{ display: "flex", fontSize: 16, fontWeight: 900, color: "#7C3AED" }}>
                Graph RAG Hub
              </div>
              <div style={{ display: "flex", fontSize: 11, color: "#6B7280", marginTop: "4px" }}>
                Entities • Vectors • Citations
              </div>
            </div>
          </div>

          {/* Bottom: Guardrails Shield */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "12px",
              backgroundColor: "#F0FDF4",
              border: "1.5px solid #BBF7D0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#10B981",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 13, fontWeight: 700, color: "#065F46" }}>
                NeMo Guardrails Active
              </div>
              <div style={{ display: "flex", fontSize: 11, color: "#047857" }}>
                Faithful Citations &amp; Strict Factuality
              </div>
            </div>
          </div>
        </div>
      );

    case "devops-vps":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "410px",
            height: "350px",
            backgroundColor: "#0F172A",
            borderRadius: "20px",
            border: "2px solid #1E293B",
            padding: "24px",
            boxShadow: "0 20px 40px rgba(245, 158, 11, 0.12)",
          }}
        >
          {/* Unit 1: Traefik SSL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 18px",
              backgroundColor: "#1E293B",
              borderRadius: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ display: "flex", width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10B981" }} />
              <div style={{ display: "flex", fontSize: 14, fontWeight: 700, color: "#F8FAFC" }}>
                Traefik Reverse Proxy
              </div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "4px 10px",
                borderRadius: "6px",
                backgroundColor: "#2563EB",
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              SSL :443
            </div>
          </div>

          {/* Unit 2: Dokploy Container Cluster */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "16px",
              backgroundColor: "#1E293B",
              borderRadius: "12px",
            }}
          >
            <div style={{ display: "flex", fontSize: 12, fontWeight: 700, color: "#94A3B8" }}>
              DOKPLOY CONTAINER PODS
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  padding: "10px 0",
                  backgroundColor: "#334155",
                  borderRadius: "8px",
                  border: "2px solid #F59E0B",
                  color: "#F59E0B",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Next.js
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  padding: "10px 0",
                  backgroundColor: "#334155",
                  borderRadius: "8px",
                  border: "2px solid #10B981",
                  color: "#10B981",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                FastAPI
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  padding: "10px 0",
                  backgroundColor: "#334155",
                  borderRadius: "8px",
                  border: "2px solid #38BDF8",
                  color: "#38BDF8",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Prefect
              </div>
            </div>
          </div>

          {/* Unit 3: Managed DB */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 18px",
              backgroundColor: "#1E293B",
              borderRadius: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ display: "flex", width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10B981" }} />
              <div style={{ display: "flex", fontSize: 14, fontWeight: 700, color: "#F8FAFC" }}>
                Managed Database
              </div>
            </div>
            <div style={{ display: "flex", color: "#94A3B8", fontSize: 13, fontWeight: 600 }}>
              PostgreSQL
            </div>
          </div>
        </div>
      );

    case "email-routing":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "410px",
            height: "350px",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            border: "2px solid #F97316",
            padding: "24px",
            boxShadow: "0 20px 40px rgba(249, 115, 22, 0.14)",
          }}
        >
          {/* Custom Domain Envelope */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              backgroundColor: "#FFF7ED",
              borderRadius: "14px",
              border: "1.5px solid #FDBA74",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 18, fontWeight: 900, color: "#09090b" }}>
                hi@yourdomain.com
              </div>
              <div style={{ display: "flex", fontSize: 12, color: "#EA580C", fontWeight: 600 }}>
                Catch-all custom alias
              </div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "6px 14px",
                borderRadius: 9999,
                backgroundColor: "#FEF3C7",
                color: "#D97706",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              $0/mo
            </div>
          </div>

          {/* Cloudflare Routing Hub */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 20px",
                borderRadius: 9999,
                backgroundColor: "#F97316",
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <span>Cloudflare Email Routing</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Gmail Destination Card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "16px 20px",
              backgroundColor: "#F8FAFC",
              borderRadius: "14px",
              border: "1.5px solid #E2E8F0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#EF4444",
                color: "#ffffff",
                fontSize: 18,
                fontWeight: 900,
              }}
            >
              M
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 15, fontWeight: 800, color: "#09090b" }}>
                Forwarded to Personal Gmail
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: 12, color: "#10B981", fontWeight: 700 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Instant &amp; Encrypted TLS</span>
              </div>
            </div>
          </div>
        </div>
      );

    case "whatsapp-api":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "330px",
            height: "350px",
            backgroundColor: "#18181B",
            borderRadius: "28px",
            padding: "10px",
            boxShadow: "0 20px 40px rgba(16, 185, 129, 0.16)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              backgroundColor: "#ECE5DD",
              borderRadius: "20px",
              overflow: "hidden",
              justifyContent: "space-between",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                backgroundColor: "#075E54",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  backgroundColor: "#25D366",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: 13, fontWeight: 700, color: "#ffffff" }}>
                  WhatsApp Cloud API
                </div>
                <div style={{ display: "flex", fontSize: 10, color: "#A7F3D0" }}>
                  Verified Business • Online
                </div>
              </div>
            </div>

            {/* Chat Bubbles */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "12px",
              }}
            >
              {/* Inbound bubble */}
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-start",
                  backgroundColor: "#ffffff",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  fontSize: 12,
                  color: "#111827",
                  fontWeight: 500,
                  maxWidth: "200px",
                }}
              >
                Connect OutCaller AI
              </div>

              {/* Response bubble */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: "flex-end",
                  backgroundColor: "#DCF8C6",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  maxWidth: "220px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: 12, fontWeight: 700, color: "#065F46" }}>
                  <span>API Active &amp; Verified</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#065F46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ display: "flex", fontSize: 10, color: "#047857" }}>
                  Webhook: 200 OK • Token Valid
                </div>
              </div>
            </div>

            {/* Bottom API Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 14px",
                backgroundColor: "#1F2937",
                margin: "0 10px 10px 10px",
                borderRadius: "8px",
              }}
            >
              <div style={{ display: "flex", fontSize: 11, fontWeight: 700, color: "#10B981" }}>
                POST /v20.0/messages
              </div>
              <div style={{ display: "flex", fontSize: 11, fontWeight: 700, color: "#9CA3AF" }}>
                200 OK
              </div>
            </div>
          </div>
        </div>
      );

    case "whatsapp-code":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "410px",
            height: "350px",
            backgroundColor: "#0F172A",
            borderRadius: "20px",
            border: "2px solid #1E293B",
            padding: "24px",
            boxShadow: "0 20px 40px rgba(13, 148, 136, 0.16)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                padding: "6px 14px",
                borderRadius: 9999,
                backgroundColor: "#134E4A",
                color: "#5EEAD4",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              OAUTH 2.0 + WEBHOOKS
            </div>
            <div style={{ display: "flex", color: "#38BDF8", fontSize: 12, fontWeight: 700 }}>
              Prisma + Next.js
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", borderRadius: "12px", backgroundColor: "#1E293B", border: "1.5px solid #0D9488" }}>
              <div style={{ display: "flex", fontSize: 13, fontWeight: 700, color: "#F8FAFC" }}>1. OAuth Code Exchange</div>
              <div style={{ display: "flex", fontSize: 11, color: "#5EEAD4" }}>60-day token</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", borderRadius: "12px", backgroundColor: "#1E293B", border: "1.5px solid #0284C7" }}>
              <div style={{ display: "flex", fontSize: 13, fontWeight: 700, color: "#F8FAFC" }}>2. WABA &amp; Phone ID</div>
              <div style={{ display: "flex", fontSize: 11, color: "#7DD3FC" }}>debug_token</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", borderRadius: "12px", backgroundColor: "#1E293B", border: "1.5px solid #10B981" }}>
              <div style={{ display: "flex", fontSize: 13, fontWeight: 700, color: "#F8FAFC" }}>3. Signature Check</div>
              <div style={{ display: "flex", fontSize: 11, color: "#6EE7B7" }}>HMAC-SHA256</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", fontSize: 12, color: "#94A3B8", fontWeight: 600 }}>Multi-Tenant Token Store</div>
            <div style={{ display: "flex", fontSize: 12, color: "#10B981", fontWeight: 700 }}>200 OK</div>
          </div>
        </div>
      );

    case "redis-analytics":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "410px",
            height: "350px",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            border: "2px solid #E4E4E7",
            padding: "24px",
            boxShadow: "0 20px 40px rgba(239, 68, 68, 0.14)",
          }}
        >
          {/* Top Row: Badge & Privacy */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: 9999,
                backgroundColor: "#FEE2E2",
                color: "#DC2626",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              ZERO COOKIES
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#10B981", fontSize: 12, fontWeight: 700 }}>
              <div style={{ display: "flex", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10B981" }} />
              DEDUPLICATED
            </div>
          </div>

          {/* Pipeline Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", borderRadius: "12px", backgroundColor: "#F8FAFC", border: "1.5px solid #E2E8F0" }}>
              <div style={{ display: "flex", fontSize: 13, fontWeight: 700, color: "#09090B" }}>1. Browser UUID</div>
              <div style={{ display: "flex", fontSize: 11, fontWeight: 600, color: "#64748B" }}>localStorage</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", borderRadius: "12px", backgroundColor: "#FFF7ED", border: "1.5px solid #FDBA74" }}>
              <div style={{ display: "flex", fontSize: 13, fontWeight: 700, color: "#9A3412" }}>2. Server Action</div>
              <div style={{ display: "flex", fontSize: 11, fontWeight: 700, color: "#C2410C" }}>Zod validated</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", borderRadius: "12px", backgroundColor: "#FEF2F2", border: "1.5px solid #FCA5A5" }}>
              <div style={{ display: "flex", fontSize: 13, fontWeight: 700, color: "#991B1B" }}>3. Redis Set / D1 Table</div>
              <div style={{ display: "flex", fontSize: 11, fontWeight: 700, color: "#DC2626" }}>SADD / INSERT</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", fontSize: 12, color: "#71717A", fontWeight: 600 }}>Upstash Redis → Cloudflare D1</div>
            <div style={{ display: "flex", fontSize: 12, color: "#EF4444", fontWeight: 700 }}>1 Action</div>
          </div>
        </div>
      );

    case "ghostty-terminal":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "410px",
            height: "350px",
            backgroundColor: "#171717",
            borderRadius: "20px",
            border: "2px solid #27272A",
            padding: "24px",
            boxShadow: "0 20px 40px rgba(124, 58, 237, 0.16)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ display: "flex", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#FF5F57" }} />
              <div style={{ display: "flex", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#FEBC2E" }} />
              <div style={{ display: "flex", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#28C840" }} />
            </div>
            <div style={{ display: "flex", color: "#A1A1AA", fontSize: 12, fontWeight: 600 }}>
              ghostty • ~/.zshrc • cli
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "9px", padding: "8px 0" }}>
            <div style={{ display: "flex", fontSize: 13.5, color: "#A78BFA" }}>
              theme <span style={{ color: "#34D399", marginLeft: "8px" }}>= "Catppuccin Mocha"</span>
            </div>
            <div style={{ display: "flex", fontSize: 13.5, color: "#A78BFA" }}>
              minimum-contrast <span style={{ color: "#38BDF8", marginLeft: "8px" }}>= 3</span>
            </div>
            <div style={{ display: "flex", fontSize: 13.5, color: "#34D399" }}>
              $ ll <span style={{ color: "#D4D4D8", marginLeft: "10px" }}>eza -l --git + bat</span>
            </div>
            <div style={{ display: "flex", fontSize: 13.5, color: "#34D399" }}>
              $ fzf_rg <span style={{ color: "#D4D4D8", marginLeft: "10px" }}>ripgrep + zoxide</span>
            </div>
            <div style={{ display: "flex", fontSize: 13.5, color: "#34D399" }}>
              $ lg <span style={{ color: "#D4D4D8", marginLeft: "10px" }}>lazygit + git-delta</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                padding: "6px 14px",
                borderRadius: 9999,
                backgroundColor: "#2E1065",
                color: "#DDD6FE",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Ghostty • P10k • CLI
            </div>
            <div style={{ display: "flex", color: "#A1A1AA", fontSize: 12, fontWeight: 600 }}>
              JetBrains Mono
            </div>
          </div>
        </div>
      );

    case "keep-mac-awake":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "410px",
            height: "350px",
            backgroundColor: "#18181B",
            borderRadius: "20px",
            border: "2px solid #27272A",
            padding: "24px",
            boxShadow: "0 20px 40px rgba(147, 51, 234, 0.16)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", padding: "6px 14px", borderRadius: 9999, backgroundColor: "#3B0764", color: "#E9D5FF", fontSize: 12, fontWeight: 800 }}>
              DISPLAY + CPU AWAKE
            </div>
            <div style={{ display: "flex", color: "#34D399", fontSize: 12, fontWeight: 700 }}>
              3 Clean Paths
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "12px 14px", borderRadius: "12px", backgroundColor: "#27272A" }}>
            <div style={{ display: "flex", fontSize: 12.5, color: "#A1A1AA" }}># Built-in CLI (display + idle + AC)</div>
            <div style={{ display: "flex", fontSize: 14.5, fontWeight: 700, color: "#34D399" }}>
              $ caffeinate -dis pnpm build
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: "12px", backgroundColor: "#2E1065", border: "1px solid #7E22CE" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 13, fontWeight: 700, color: "#F3E8FF" }}>Amphetamine &amp; Raycast Coffee</div>
              <div style={{ display: "flex", fontSize: 11, color: "#D8B4FE" }}>Prevent display sleep · Triggers</div>
            </div>
            <div style={{ display: "flex", fontSize: 12, fontWeight: 800, color: "#FB923C" }}>
              -d -i -s
            </div>
          </div>
        </div>
      );

    case "mole-aldente":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "410px",
            height: "350px",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            border: "2px solid #E4E4E7",
            padding: "24px",
            boxShadow: "0 20px 40px rgba(5, 150, 105, 0.12)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", padding: "6px 14px", borderRadius: 9999, backgroundColor: "#D1FAE5", color: "#065F46", fontSize: 12, fontWeight: 800 }}>
              MOLE + ALDENTE
            </div>
            <div style={{ display: "flex", fontSize: 12, color: "#059669", fontWeight: 700 }}>
              Storage &amp; Battery
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#18181B", borderRadius: "14px", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#34D399", fontWeight: 700 }}>
              <span>$ mo purge --dry-run</span>
              <span>Worktrees</span>
            </div>
            <div style={{ display: "flex", fontSize: 12, color: "#D4D4D8" }}>
              ~/.codex/worktrees · ~/.t3/worktrees
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "14px", borderRadius: "14px", backgroundColor: "#ECFDF5", border: "1.5px solid #A7F3D0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 800, color: "#065F46" }}>
              <span>AlDente Desk Cap</span>
              <span>80% Limit</span>
            </div>
            <div style={{ display: "flex", width: "100%", height: "12px", borderRadius: 9999, backgroundColor: "#D1FAE5" }}>
              <div style={{ display: "flex", width: "80%", height: "12px", borderRadius: 9999, backgroundColor: "#059669" }} />
            </div>
          </div>
        </div>
      );

    case "woodpecker-ci":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "410px",
            height: "350px",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            border: "2px solid #E4E4E7",
            padding: "24px",
            boxShadow: "0 20px 40px rgba(234, 88, 12, 0.12)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                padding: "6px 14px",
                borderRadius: 9999,
                backgroundColor: "#FFF7ED",
                color: "#C2410C",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              WOODPECKER VPS
            </div>
            <div style={{ display: "flex", color: "#15803D", fontSize: 12, fontWeight: 700 }}>
              $0 Runner Minutes
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", borderRadius: "12px", backgroundColor: "#F0FDF4", border: "1.5px solid #86EFAC" }}>
              <div style={{ display: "flex", fontSize: 13, fontWeight: 700, color: "#166534" }}>1. PR &amp; SDK Gates</div>
              <div style={{ display: "flex", fontSize: 11, color: "#15803D" }}>oxlint · OpenAPI</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", borderRadius: "12px", backgroundColor: "#FFF7ED", border: "1.5px solid #FDBA74" }}>
              <div style={{ display: "flex", fontSize: 13, fontWeight: 700, color: "#9A3412" }}>2. Sequential Buildx</div>
              <div style={{ display: "flex", fontSize: 11, color: "#C2410C" }}>host docker.sock</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", borderRadius: "12px", backgroundColor: "#EFF6FF", border: "1.5px solid #93C5FD" }}>
              <div style={{ display: "flex", fontSize: 13, fontWeight: 700, color: "#1E40AF" }}>3. Dokploy Webhook</div>
              <div style={{ display: "flex", fontSize: 11, color: "#1D4ED8" }}>Zero-Build Deploy</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", fontSize: 12, color: "#52525B", fontWeight: 600 }}>
              OIDC Publish → GitHub
            </div>
            <div style={{ display: "flex", fontSize: 12, color: "#09090B", fontWeight: 700 }}>
              8 Workflows
            </div>
          </div>
        </div>
      );

    case "mac-apps-polish":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "410px",
            height: "350px",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            border: "2px solid #E4E4E7",
            padding: "24px",
            boxShadow: "0 20px 40px rgba(13, 148, 136, 0.12)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", padding: "6px 14px", borderRadius: 9999, backgroundColor: "#CCFBF1", color: "#0F766E", fontSize: 12, fontWeight: 800 }}>
              MACOS DEFAULTS FIXED
            </div>
            <div style={{ display: "flex", fontSize: 12, color: "#64748B", fontWeight: 600 }}>
              Zero Bloat
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", borderRadius: "12px", backgroundColor: "#F0FDFA", border: "1.5px solid #99F6E4" }}>
              <div style={{ display: "flex", fontSize: 14, fontWeight: 800, color: "#09090B" }}>LinearMouse + Thock</div>
              <div style={{ display: "flex", fontSize: 12, fontWeight: 700, color: "#0F766E" }}>Input &amp; Acoustics</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", borderRadius: "12px", backgroundColor: "#F0FDFA", border: "1.5px solid #99F6E4" }}>
              <div style={{ display: "flex", fontSize: 14, fontWeight: 800, color: "#09090B" }}>Hand Mirror + Cap</div>
              <div style={{ display: "flex", fontSize: 12, fontWeight: 700, color: "#0F766E" }}>Calls &amp; 4K Video</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", borderRadius: "12px", backgroundColor: "#F0FDFA", border: "1.5px solid #99F6E4" }}>
              <div style={{ display: "flex", fontSize: 14, fontWeight: 800, color: "#09090B" }}>Granola + LocalSend</div>
              <div style={{ display: "flex", fontSize: 12, fontWeight: 700, color: "#0F766E" }}>Notes &amp; LAN Share</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", fontSize: 12, color: "#64748B", fontWeight: 600 }}>BetterDisplay • AltTab • Wallspace</div>
            <div style={{ display: "flex", fontSize: 12, color: "#0D9488", fontWeight: 700 }}>Part 2</div>
          </div>
        </div>
      );

    case "mac-apps-dev":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "410px",
            height: "350px",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            border: "2px solid #E4E4E7",
            padding: "24px",
            boxShadow: "0 20px 40px rgba(2, 132, 199, 0.12)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", padding: "6px 14px", borderRadius: 9999, backgroundColor: "#E0F2FE", color: "#0369A1", fontSize: 12, fontWeight: 800 }}>
              DEV &amp; AI MENU BAR
            </div>
            <div style={{ display: "flex", fontSize: 12, color: "#64748B", fontWeight: 600 }}>
              Apple Silicon
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", borderRadius: "12px", backgroundColor: "#F8FAFC", border: "1.5px solid #CBD5E1" }}>
              <div style={{ display: "flex", fontSize: 14, fontWeight: 800, color: "#09090B" }}>OpenUsage</div>
              <div style={{ display: "flex", fontSize: 12, fontWeight: 700, color: "#0284C7" }}>5h &amp; Weekly Quotas</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", borderRadius: "12px", backgroundColor: "#F8FAFC", border: "1.5px solid #CBD5E1" }}>
              <div style={{ display: "flex", fontSize: 14, fontWeight: 800, color: "#09090B" }}>Trimmy + PortKiller</div>
              <div style={{ display: "flex", fontSize: 12, fontWeight: 700, color: "#EA580C" }}>Paste &amp; Port Fixes</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", borderRadius: "12px", backgroundColor: "#F8FAFC", border: "1.5px solid #CBD5E1" }}>
              <div style={{ display: "flex", fontSize: 14, fontWeight: 800, color: "#09090B" }}>Ghostty + Syncthing</div>
              <div style={{ display: "flex", fontSize: 12, fontWeight: 700, color: "#059669" }}>Terminal &amp; P2P Sync</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", fontSize: 12, color: "#64748B", fontWeight: 600 }}>OrbStack • Beekeeper • Raycast</div>
            <div style={{ display: "flex", fontSize: 12, color: "#0284C7", fontWeight: 700 }}>8 Apps</div>
          </div>
        </div>
      );

    case "nextjs-blog":
    default:
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "410px",
            height: "350px",
            backgroundColor: "#0F172A",
            borderRadius: "20px",
            border: "2px solid #1E293B",
            padding: "24px",
            boxShadow: "0 20px 40px rgba(99, 102, 241, 0.14)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ display: "flex", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#EF4444" }} />
              <div style={{ display: "flex", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#F59E0B" }} />
              <div style={{ display: "flex", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#10B981" }} />
            </div>
            <div style={{ display: "flex", color: "#94A3B8", fontSize: 13, fontWeight: 600 }}>
              src/content/blog/post.mdx
            </div>
          </div>

          {/* Syntax Highlighted Lines */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "10px 0" }}>
            <div style={{ display: "flex", color: "#F43F5E", fontSize: 14, fontWeight: 700 }}>
              ---
            </div>
            <div style={{ display: "flex", color: "#38BDF8", fontSize: 14 }}>
              title: <span style={{ color: "#FDE047", marginLeft: "6px" }}>"Next.js 16 + Fumadocs"</span>
            </div>
            <div style={{ display: "flex", color: "#38BDF8", fontSize: 14 }}>
              engine: <span style={{ color: "#A7F3D0", marginLeft: "6px" }}>"Turbopack &amp; RSC"</span>
            </div>
            <div style={{ display: "flex", color: "#F43F5E", fontSize: 14, fontWeight: 700 }}>
              ---
            </div>
            <div style={{ display: "flex", color: "#6366F1", fontSize: 14, fontWeight: 700, marginTop: "4px" }}>
              &lt;Figure src="/writing/system.png" /&gt;
            </div>
          </div>

          {/* Bottom badge */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                padding: "6px 14px",
                borderRadius: 9999,
                backgroundColor: "#1E293B",
                color: "#10B981",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              &lt; 50ms Page Load
            </div>
            <div style={{ display: "flex", color: "#64748B", fontSize: 12, fontWeight: 600 }}>
              TypeScript • React 19
            </div>
          </div>
        </div>
      );
  }
}

export default async function Image({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const post = await getPostBySlug(slug).catch(() => null);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            color: "#09090b",
            fontSize: 48,
            fontWeight: 800,
          }}
        >
          Post Not Found
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: "Geist",
            data: geistBlack,
            weight: 900,
            style: "normal",
          },
        ],
      }
    );
  }

  // Retrieve customized theme or fallback
  const theme = POST_THEMES[slug] || {
    badge: (post.tags && post.tags.length > 0) ? `${post.tags[0]} × Engineering` : "Falak Gala · Writing",
    primary: "#6366F1",
    secondary: "#0EA5E9",
    highlights: post.tags || [post.title.split(" ")[0]],
    subtitle: post.description?.slice(0, 80) || "Engineering case study & walkthrough",
    type: "nextjs-blog",
  };

  // Determine title font size based on length
  const titleLength = post.title.length;
  let titleFontSize = 58;
  if (titleLength > 65) {
    titleFontSize = 46;
  } else if (titleLength > 48) {
    titleFontSize = 50;
  } else if (titleLength < 35) {
    titleFontSize = 62;
  }

  const halftoneDots = generateHalftoneDots(theme.primary);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          fontFamily: "Geist",
        }}
      >
        {/* Halftone Dot Matrix Vectors */}
        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {halftoneDots}
        </svg>

        {/* Content Container (2-Column Layout) */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Left Column: Pill, Title, Subtitle, Bar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "710px",
              height: "100%",
              padding: "54px 0 50px 64px",
            }}
          >
            {/* Top Pill Badge */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "9px 24px",
                  borderRadius: 9999,
                  border: "2px solid #09090b",
                  backgroundColor: "#ffffff",
                  color: "#09090b",
                  fontSize: 22,
                  fontWeight: 900,
                  letterSpacing: "-0.01em",
                }}
              >
                {theme.badge}
              </div>
            </div>

            {/* Middle: Big Title, Subtitle, and Accent Bar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                maxWidth: "670px",
              }}
            >
              {/* Highlighted Title */}
              {renderTitle(post.title, theme.highlights, theme.primary, titleFontSize)}

              {/* Subtitle */}
              <div
                style={{
                  fontSize: 24,
                  color: "#52525b",
                  fontWeight: 400,
                  lineHeight: 1.35,
                  maxWidth: "650px",
                }}
              >
                {theme.subtitle}
              </div>

              {/* Theme Color Accent Bar */}
              <div
                style={{
                  width: 85,
                  height: 7,
                  backgroundColor: theme.primary,
                  borderRadius: 9999,
                  marginTop: 4,
                }}
              />
            </div>

            {/* Bottom Watermark */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: 18,
                fontWeight: 600,
                color: "#71717a",
                letterSpacing: "-0.01em",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  backgroundColor: theme.primary,
                }}
              />
              <span>falakgala.dev</span>
              <span style={{ color: "#d4d4d8" }}>•</span>
              <span>Falak Gala</span>
            </div>
          </div>

          {/* Right Column: Visual Tech Illustration */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "490px",
              height: "100%",
              paddingRight: "40px",
            }}
          >
            {renderIllustration(theme.type, theme.primary, theme.secondary)}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: geistBlack,
          weight: 900,
          style: "normal",
        },
        {
          name: "Geist",
          data: geistRegular,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}

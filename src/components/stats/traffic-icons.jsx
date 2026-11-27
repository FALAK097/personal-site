"use client";

import {
  Bot,
  Compass,
  Globe,
  Laptop,
  Link2,
  Monitor,
  Shield,
  Smartphone,
  Tablet,
  Terminal,
} from "lucide-react";
import { countryFlag, faviconUrl } from "@/lib/traffic-formatters";

function ChromeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 shrink-0">
      <circle cx="12" cy="12" r="10" fill="#4285F4" opacity="0.14" />
      <path
        d="M12 2a10 10 0 0 1 8.66 5H12a5 5 0 0 0-4.33 2.5L3.34 7A10 10 0 0 1 12 2Z"
        fill="#EA4335"
      />
      <path
        d="M3.34 7l4.33 7.5A5 5 0 0 1 7 12c0-.91.24-1.76.67-2.5L3.34 7A10 10 0 0 0 12 22l4.33-7.5A5 5 0 0 1 12 17a5 5 0 0 1-4.33-2.5L3.34 7Z"
        fill="#34A853"
      />
      <path
        d="M20.66 7A10 10 0 0 1 12 22l4.33-7.5A5 5 0 0 0 12 7h8.66Z"
        fill="#FBBC05"
      />
      <circle cx="12" cy="12" r="3.8" fill="#4285F4" stroke="#ffffff" strokeWidth="1.2" />
    </svg>
  );
}

function FirefoxIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 shrink-0">
      <circle cx="12" cy="12" r="9.5" fill="#FF7139" />
      <path
        d="M17.5 7.2c-1.1-1.4-2.8-2.2-4.8-2.2-3.6 0-6.5 2.9-6.5 6.5 0 3.7 2.9 6.5 6.5 6.5 3.1 0 5.7-2.1 6.3-5-1.1.9-2.5 1.3-3.9 1-1.9-.4-3.2-2.1-3-4 .2-1.5 1.3-2.7 2.8-2.9 1-.1 1.9.2 2.6.1Z"
        fill="#FFBD4F"
      />
    </svg>
  );
}

function EdgeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 shrink-0">
      <circle cx="12" cy="12" r="9.5" fill="#0EA5E9" />
      <path
        d="M6.2 14.8c.5 2.4 2.7 4.2 5.5 4.2 2.4 0 4.4-1.2 5.3-3-1.3.5-2.8.5-4.1-.1-1.8-.8-2.7-2.7-2.1-4.5.5-1.4 1.9-2.4 3.5-2.4 1.3 0 2.5.6 3.2 1.6A7.5 7.5 0 0 0 5 12c0 1 .4 2 1.2 2.8Z"
        fill="#34D399"
      />
    </svg>
  );
}

function WindowsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 shrink-0">
      <rect x="3" y="3" width="8.2" height="8.2" rx="1.2" fill="#00A4EF" />
      <rect x="12.8" y="3" width="8.2" height="8.2" rx="1.2" fill="#00A4EF" />
      <rect x="3" y="12.8" width="8.2" height="8.2" rx="1.2" fill="#00A4EF" />
      <rect x="12.8" y="12.8" width="8.2" height="8.2" rx="1.2" fill="#00A4EF" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-3.5 shrink-0 text-foreground/85">
      <path d="M16.365 12.63c-.02-2.12 1.734-3.145 1.813-3.194-.99-1.446-2.527-1.644-3.071-1.666-1.304-.133-2.553.77-3.215.77-.664 0-1.685-.752-2.773-.732-1.424.021-2.74.83-3.473 2.104-1.484 2.573-.379 6.38 1.064 8.466.706 1.02 1.545 2.164 2.648 2.123 1.064-.043 1.466-.687 2.752-.687 1.285 0 1.647.687 2.772.665 1.146-.02 1.869-1.038 2.57-2.061.812-1.184 1.145-2.332 1.164-2.391-.026-.012-2.231-.855-2.251-3.397ZM14.26 6.39c.586-.711.982-1.698.874-2.685-.845.034-1.869.563-2.475 1.273-.542.627-1.018 1.633-.891 2.598.943.073 1.906-.476 2.492-1.186Z" />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 shrink-0">
      <path
        d="M7.2 8.2 5.6 5.5a.5.5 0 0 1 .86-.5l1.64 2.8A8.3 8.3 0 0 1 12 7c1.4 0 2.72.3 3.9.8l1.64-2.8a.5.5 0 0 1 .86.5L16.8 8.2A7.5 7.5 0 0 1 20 14.3V16H4v-1.7a7.5 7.5 0 0 1 3.2-6.1Z"
        fill="#3DDC84"
      />
      <circle cx="9" cy="12" r="0.9" fill="#ffffff" />
      <circle cx="15" cy="12" r="0.9" fill="#ffffff" />
    </svg>
  );
}

function GeoDimensionIcon({ item }) {
  const label = String(item?.label || "").toLowerCase();
  if (item?.key === "T1" || label === "tor") {
    return <Shield className="size-3.5 shrink-0 text-clay-600 dark:text-clay-400" aria-hidden="true" />;
  }
  const flag = countryFlag(item?.code || item?.key);
  if (flag) {
    return (
      <span className="inline-flex w-4 shrink-0 justify-center text-xs leading-none" aria-hidden="true">
        {flag}
      </span>
    );
  }
  return <Globe className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />;
}

function ReferrerDimensionIcon({ item }) {
  const key = String(item?.key || "").toLowerCase();
  const label = String(item?.label || "").toLowerCase();
  if (key === "direct" || label.includes("direct")) {
    return <Link2 className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />;
  }
  const fav = faviconUrl(item?.key);
  if (fav) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={fav}
        alt=""
        width={14}
        height={14}
        loading="lazy"
        className="size-3.5 shrink-0 rounded-[3px] object-contain"
      />
    );
  }
  return <Globe className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />;
}

function BrowserDimensionIcon({ label }) {
  if (label.includes("chrome")) return <ChromeIcon />;
  if (label.includes("firefox")) return <FirefoxIcon />;
  if (label.includes("edge")) return <EdgeIcon />;
  if (label.includes("safari")) {
    return <Compass className="size-3.5 shrink-0 text-[#0284c7] dark:text-[#38bdf8]" aria-hidden="true" />;
  }
  if (label.includes("curl")) {
    return <Terminal className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />;
  }
  if (label.includes("bot")) {
    return <Bot className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />;
  }
  return <Globe className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />;
}

function OsDimensionIcon({ label }) {
  if (label.includes("windows")) return <WindowsIcon />;
  if (label.includes("macos") || label.includes("mac") || label === "ios") return <AppleIcon />;
  if (label.includes("android")) return <AndroidIcon />;
  if (label.includes("linux")) {
    return <Terminal className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />;
  }
  if (label.includes("chromeos")) return <ChromeIcon />;
  return <Laptop className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />;
}

function DeviceDimensionIcon({ keyName }) {
  if (keyName === "mobile") {
    return <Smartphone className="size-3.5 shrink-0 text-amber-500" aria-hidden="true" />;
  }
  if (keyName === "tablet") {
    return <Tablet className="size-3.5 shrink-0 text-rose-500" aria-hidden="true" />;
  }
  return <Monitor className="size-3.5 shrink-0 text-[#2563eb] dark:text-clay-500" aria-hidden="true" />;
}

export function DimensionIcon({ kind, item }) {
  const key = String(item?.key || "").toLowerCase();
  const label = String(item?.label || "").toLowerCase();

  if (kind === "country" || kind === "colo") return <GeoDimensionIcon item={item} />;
  if (kind === "referrer") return <ReferrerDimensionIcon item={item} />;
  if (kind === "browser") return <BrowserDimensionIcon label={label} />;
  if (kind === "os") return <OsDimensionIcon label={label} />;
  if (kind === "device") return <DeviceDimensionIcon keyName={key} />;
  return null;
}

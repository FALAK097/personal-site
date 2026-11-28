"use client";

import { useEffect, useState } from "react";
import { siteVisitors } from "@/actions/site-visitors";
import { SocialLinks } from "@/components/social-links";
import { FooterSeascape } from "@/components/footer-seascape";

const timeFormatter = new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Kolkata",
});

const VISITOR_ID_KEY = "visitorId";

// Stable per-browser ID so the D1 lifetime count stays idempotent across
// reloads and sessions (INSERT OR IGNORE dedupes server-side too).
function getVisitorId() {
  try {
    let id = window.localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

const LAST_UPDATED = process.env.NEXT_PUBLIC_LAST_UPDATED
  ? new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(process.env.NEXT_PUBLIC_LAST_UPDATED))
  : null;

export function Footer() {
  const [visitorCount, setVisitorCount] = useState(null);
  const [mumbaiTime, setMumbaiTime] = useState("--:--");

  useEffect(() => {
    let cancelled = false;
    Promise.resolve()
      .then(() => siteVisitors(getVisitorId()))
      .then((result) => {
        if (!cancelled && typeof result?.visitors === "number") {
          setVisitorCount(result.visitors);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const updateTime = () => setMumbaiTime(timeFormatter.format(new Date()));
    updateTime();
    const timer = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <footer className="portfolio-footer">
      <div className="site-container">
        <div className="footer-details">
          <p className="footer-location">
            <span className="footer-location-dot" aria-hidden="true" />
            Mumbai, India
            <span className="footer-time">{mumbaiTime} IST</span>
          </p>
          <p className="footer-visitors">
            {visitorCount === null ? "Visitors —" : `${visitorCount.toLocaleString("en-US")} visitors`}
          </p>
          <div className="footer-socials"><SocialLinks /></div>
        </div>
        <p className="footer-signoff">
          {LAST_UPDATED ? <>Last updated · {LAST_UPDATED} · </> : null}
          <a href="/llms.txt" className="underline-offset-4 hover:underline">
            llms.txt
          </a>
        </p>
      </div>
      <FooterSeascape />
    </footer>
  );
}

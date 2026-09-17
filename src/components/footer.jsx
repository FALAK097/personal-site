"use client";

import { useEffect, useState } from "react";
import { uniqueVisitors } from "@/actions/unique-visitors";
import { SocialLinks } from "@/components/social-links";
import { FooterSeascape } from "@/components/footer-seascape";

const timeFormatter = new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Kolkata",
});

const LAST_UPDATED = process.env.NEXT_PUBLIC_LAST_UPDATED
  ? new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(process.env.NEXT_PUBLIC_LAST_UPDATED))
  : null;

function getVisitorId() {
  const key = "visitorId";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function Footer() {
  const [visitorCount, setVisitorCount] = useState(null);
  const [mumbaiTime, setMumbaiTime] = useState("--:--");

  useEffect(() => {
    // Storage can be unavailable in private or restricted browsing contexts.
    Promise.resolve()
      .then(() => uniqueVisitors(getVisitorId()))
      .then((result) => {
        if (typeof result?.uniqueVisitors === "number") {
          setVisitorCount(result.uniqueVisitors);
        }
      })
      .catch(() => undefined);
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
        {LAST_UPDATED ? <p className="footer-signoff">Last updated · {LAST_UPDATED}</p> : null}
      </div>
      <FooterSeascape />
    </footer>
  );
}

"use client";

import { useEffect, useState } from "react";
import { uniqueVisitors } from "@/actions/unique-visitors";
import { SocialLinks } from "@/components/social-links";
import { HeartIcon } from "@/components/icons";

const timeFormatter = new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Kolkata",
});

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
    uniqueVisitors(getVisitorId())
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
    <footer className="border-t border-border/70">
      <div className="site-container flex flex-col items-center gap-4 py-6 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:justify-between">
        <div className="order-3 flex items-center gap-1 sm:order-1">
          Made with <HeartIcon className="size-4 text-clay-500" /> by Falak Gala
        </div>
        <div className="order-1 flex flex-col items-center gap-3 sm:order-2 sm:ml-auto sm:flex-row sm:gap-5">
          <p>Mumbai · <span className="tabular-nums">{mumbaiTime}</span></p>
          <p className="min-w-24 text-center tabular-nums sm:text-right">
            {visitorCount === null ? "Visitors —" : `${visitorCount.toLocaleString()} visitors`}
          </p>
        </div>
        <div className="order-2 sm:order-3"><SocialLinks /></div>
      </div>
    </footer>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export function ArticleToc({ items = [], variant = "desktop" }) {
  const links = useMemo(
    () => items.filter((item) => item.url?.startsWith("#")),
    [items],
  );
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headings = links
      .map((item) => document.getElementById(item.url.slice(1)))
      .filter(Boolean);

    if (!headings.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70%", threshold: [0, 1] },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [links]);

  if (links.length < 2) return null;

  const navigation = (
    <nav aria-label="On this page">
      <ol className="space-y-1.5 text-sm">
        {links.map((item) => {
          const id = item.url.slice(1);

          return (
            <li key={item.url} style={{ paddingLeft: `${Math.max(0, item.depth - 2) * 12}px` }}>
              <a
                href={item.url}
                aria-current={activeId === id ? "location" : undefined}
                className={cn(
                  "block border-l-2 py-1 pl-3 leading-snug no-underline transition-colors",
                  activeId === id
                    ? "border-clay-500 text-clay-600 dark:text-clay-300"
                    : "border-transparent text-muted-foreground hover:border-clay-300 hover:text-foreground",
                )}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );

  if (variant === "mobile") {
    return (
      <details className="group mb-10 rounded-xl border border-border bg-muted/30 p-4 lg:hidden">
        <summary className="cursor-pointer list-none font-medium text-foreground marker:content-none">
          <span className="flex items-center justify-between">
            On this page
            <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
          </span>
        </summary>
        <div className="mt-4 border-t border-border pt-4">{navigation}</div>
      </details>
    );
  }

  return (
    <aside
      className="hidden max-h-[calc(100vh-8rem)] self-start overflow-y-auto pr-2 lg:sticky lg:top-24 lg:block"
      aria-label="Table of contents"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
        On this page
      </p>
      {navigation}
    </aside>
  );
}

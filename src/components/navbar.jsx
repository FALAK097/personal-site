"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { XIcon, MenuIcon } from "./icons";
import { InteractionToggles } from "@/components/interaction-toggles";
import { ChevronDown } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const extrasRef = useRef(null);
  const extrasTriggerRef = useRef(null);

  const links = [
    { href: "/projects", label: "projects" },
    { href: "/writing", label: "writing" },
    { href: "/about", label: "about" },
    { href: "/contact", label: "contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl">
      <div className="site-container">
        <nav className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className={cn(
              "translate-y-px text-sm font-medium tracking-tight text-foreground transition-opacity hover:opacity-70"
            )}
          >
            Falak<span className="text-clay-500">.</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-5 md:flex">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "text-sm text-muted-foreground transition-colors duration-100 hover:text-foreground",
                    (pathname === href || pathname.startsWith(`${href}/`)) && "text-foreground"
                  )}
                >
                  {label}
                </Link>
              ))}
              <div ref={extrasRef} className="relative" onPointerEnter={(event) => { if (event.pointerType === "mouse") setExtrasOpen(true); }} onPointerLeave={(event) => { if (event.pointerType === "mouse") setExtrasOpen(false); }} onFocus={(event) => { if (event.target.matches(":focus-visible")) setExtrasOpen(true); }} onBlur={(event) => { if (!extrasRef.current?.contains(event.relatedTarget)) setExtrasOpen(false); }} onKeyDown={(event) => { if (event.key === "Escape") { extrasTriggerRef.current?.focus(); setExtrasOpen(false); } }}>
                <button ref={extrasTriggerRef} type="button" aria-expanded={extrasOpen} aria-controls="extras-navigation" onClick={() => setExtrasOpen((open) => !open)} className="flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-100 hover:text-foreground focus:text-foreground">
                  extras <ChevronDown className={cn("size-3 transition-transform duration-150", extrasOpen && "rotate-180")} />
                </button>
                <div id="extras-navigation" className={cn("absolute top-full right-0 z-50 pt-3 transition-[opacity,visibility] duration-100", extrasOpen ? "visible opacity-100" : "invisible opacity-0")}>
                  <div className="w-36 rounded-lg border border-border bg-background p-1 shadow-lg">
                    <Link href="/bookmarks" className={cn("block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted hover:text-foreground", pathname === "/bookmarks" ? "font-medium text-foreground" : "text-muted-foreground")}>bookmarks</Link>
                    <Link href="/stats" className={cn("block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted hover:text-foreground", pathname === "/stats" ? "font-medium text-foreground" : "text-muted-foreground")}>stats</Link>
                  </div>
                </div>
              </div>
            </div>
            <InteractionToggles />
            <ThemeToggle />
              <button
              className="grid size-8 place-items-center rounded-md text-muted-foreground md:hidden"
              aria-label={isOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <XIcon className="size-4" />
              ) : (
                <MenuIcon className="size-4" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {isOpen && (
        <div id="mobile-navigation" className="site-container flex flex-col gap-1 pb-4 md:hidden animate-slide-down">
          {links.map(({ href, label }) => (
            <Link
              onClick={() => setIsOpen(false)}
              key={href}
              href={href}
              className={cn(
                "rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-100",
                pathname === href && "text-foreground font-semibold"
              )}
            >
              {label}
            </Link>
          ))}
          <Link onClick={() => setIsOpen(false)} href="/bookmarks" className={cn("rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors duration-100 hover:bg-muted hover:text-foreground", pathname === "/bookmarks" && "font-semibold text-foreground")}>bookmarks</Link>
          <Link onClick={() => setIsOpen(false)} href="/stats" className={cn("rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors duration-100 hover:bg-muted hover:text-foreground", pathname === "/stats" && "font-semibold text-foreground")}>stats</Link>
        </div>
      )}
    </header>
  );
}

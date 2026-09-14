"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { XIcon, MenuIcon } from "./icons";
import { InteractionToggles } from "@/components/interaction-toggles";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/projects", label: "Work" },
    { href: "/blog", label: "Writing" },
    { href: "/about", label: "About" },
    { href: "/uses", label: "Uses" },
    { href: "/hire-me", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl">
      <div className="site-container">
        <nav className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className={cn(
              "text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-70"
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
                    pathname === href && "text-foreground"
                  )}
                >
                  {label}
                </Link>
              ))}
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
        </div>
      )}
    </header>
  );
}

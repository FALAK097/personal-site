"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { XIcon, MenuIcon } from "./icons";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/projects", label: "Projects" },
    { href: "/hire-me", label: "HireMe" },
    { href: "/bookmarks", label: "Bookmarks" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <nav className="max-w-4xl flex items-center justify-between h-16 mx-auto">
          <Link
            href="/"
            className={cn(
              "text-2xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity"
            )}
          >
            Falak<span className="text-clay-500">.</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="items-center hidden gap-6 md:flex">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative text-sm text-foreground/60 hover:text-foreground transition-colors",
                    "after:absolute after:left-0 after:right-0 after:-bottom-1",
                    "after:h-[2px] after:bg-clay-500",
                    "after:scale-x-0 hover:after:scale-x-100",
                    "after:transition-transform after:duration-300",
                    pathname === href && "text-foreground after:scale-x-100"
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>
            <ThemeToggle />
              <button
              className="md:hidden text-muted-foreground cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <XIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6 mt-2" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-3 px-4 pb-4 md:hidden animate-slide-down">
          {links.map(({ href, label }) => (
            <Link
              onClick={() => setIsOpen(false)}
              key={href}
              href={href}
              className={cn(
                "text-foreground/80 text-base font-medium hover:text-foreground transition-colors",
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

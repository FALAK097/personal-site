"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 200);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      className={`group fixed right-4 bottom-4 z-40 grid size-11 place-items-center text-foreground/20 transition-[opacity,transform,color] duration-150 hover:text-foreground focus-visible:text-foreground focus-visible:outline-none ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <span className="grid size-9 place-items-center rounded-lg bg-background/70 shadow-[0_1px_8px_rgba(0,0,0,0.02)] backdrop-blur-sm transition-[background-color,box-shadow] duration-150 group-hover:bg-muted group-hover:shadow-none group-focus-visible:bg-muted group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-clay-500">
        <ArrowUp className="size-4" strokeWidth={1.75} />
      </span>
    </button>
  );
}

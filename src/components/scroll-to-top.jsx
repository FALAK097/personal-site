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
      className={`fixed right-5 bottom-5 z-40 grid size-11 place-items-center rounded-xl bg-background/70 text-foreground/20 shadow-[0_1px_8px_rgba(0,0,0,0.02)] backdrop-blur-sm transition-[opacity,transform,color,background-color,box-shadow] duration-150 hover:bg-muted hover:text-foreground hover:shadow-none focus-visible:bg-muted focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-500 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <ArrowUp className="size-5" strokeWidth={1.75} />
    </button>
  );
}

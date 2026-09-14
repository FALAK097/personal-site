"use client";

import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const progressRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const scrollHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
        progressRef.current?.style.setProperty("--scroll-progress", `${progress}`);
        frame = 0;
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateProgress);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50">
      <div
        ref={progressRef}
        className="h-full origin-left scale-x-[var(--scroll-progress)] bg-clay-500"
        style={{ "--scroll-progress": 0 }}
      />
    </div>
  );
}

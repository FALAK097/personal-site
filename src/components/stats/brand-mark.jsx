"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { brandSrc } from "@/lib/ai-brand";

export function BrandMark({ brand, size = 14, className = "" }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const src = brandSrc(brand, mounted && resolvedTheme === "dark");
  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      aria-hidden="true"
      className={`shrink-0 object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

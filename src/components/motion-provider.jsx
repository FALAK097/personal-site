"use client";

import { LazyMotion, MotionConfig } from "motion/react";

const loadFeatures = () =>
  import("@/lib/motion-features").then((module) => module.default);

export function MotionProvider({ children }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

"use client";

import { useAnimation } from "motion/react";
import * as m from "motion/react-m";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

const squareVariants = {
  normal: { scale: 1, opacity: 1 },
  animate: (i) => ({
    scale: [1, 1.2, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 0.5,
      delay: i * 0.07,
    },
  }),
};

const GridIcon = forwardRef(
  ({ onMouseEnter, onMouseLeave, className, size = 18, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start((i) => "animate"),
        stopAnimation: () => controls.start((i) => "normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e) => {
        if (!isControlledRef.current) {
          controls.start((i) => "animate");
        } else {
          onMouseEnter?.(e);
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e) => {
        if (!isControlledRef.current) {
          controls.start((i) => "normal");
        } else {
          onMouseLeave?.(e);
        }
      },
      [controls, onMouseLeave]
    );

    // 3x3 grid
    const squares = Array.from({ length: 9 });

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {squares.map((_, i) => (
            <m.rect
              key={i}
              x={2 + (i % 3) * 6}
              y={2 + Math.floor(i / 3) * 6}
              width="4"
              height="4"
              rx="1"
              fill="currentColor"
              variants={squareVariants}
              initial="normal"
              animate={controls}
              custom={i}
            />
          ))}
        </svg>
      </div>
    );
  }
);

GridIcon.displayName = "GridIcon";

export { GridIcon };

"use client";

import { useAnimation } from "motion/react";
import * as m from "motion/react-m";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

const lineVariants = {
  normal: { x: 0, opacity: 1 },
  animate: (i) => ({
    x: [0, 6, 0],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 0.5,
      delay: i * 0.08,
    },
  }),
};

const ListIcon = forwardRef(
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

    // 3 lines for the list
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
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {[0, 1, 2].map((i) => (
            <m.line
              key={i}
              x1="4"
              y1={6 + i * 5}
              x2="16"
              y2={6 + i * 5}
              stroke="currentColor"
              variants={lineVariants}
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

ListIcon.displayName = "ListIcon";

export { ListIcon };

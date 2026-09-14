"use client";

import { useAnimation } from "motion/react";
import * as m from "motion/react-m";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

const cursorVariants = {
  initial: { x: 0, y: 0 },
  hover: {
    x: [0, 0, -3, 0],
    y: [0, -4, 0, 0],
    transition: {
      duration: 1,
      bounce: 0.3,
    },
  },
};

const lineVariants = {
  initial: { opacity: 1, x: 0, y: 0 },
  spread: (custom) => ({
    opacity: [0, 1, 0, 0, 0, 0, 1],
    x: [0, custom.x, 0, 0],
    y: [0, custom.y, 0, 0],
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 10,
      mass: 0.4,
    },
  }),
};

const CursorClickIcon = forwardRef(
  ({ onMouseEnter, onMouseLeave, className, size = 18, ...props }, ref) => {
    const clickControls = useAnimation();
    const cursorControls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => {
          cursorControls.start("hover");
          clickControls.start("spread", { delay: 1.3 });
        },
        stopAnimation: () => {
          cursorControls.start("initial");
          clickControls.start("initial");
        },
      };
    });

    const handleMouseEnter = useCallback(
      (e) => {
        if (!isControlledRef.current) {
          cursorControls.start("hover");
          clickControls.start("spread", { delay: 1.3 });
        } else {
          onMouseEnter?.(e);
        }
      },
      [clickControls, cursorControls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e) => {
        if (!isControlledRef.current) {
          cursorControls.start("initial");
          clickControls.start("initial");
        } else {
          onMouseLeave?.(e);
        }
      },
      [cursorControls, clickControls, onMouseLeave]
    );

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
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <m.path
            d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"
            variants={cursorVariants}
            animate={cursorControls}
          />
          <m.path
            d="M14 4.1 12 6"
            variants={lineVariants}
            animate={clickControls}
            custom={{ x: 1, y: -1 }}
          />
          <m.path
            d="m5.1 8-2.9-.8"
            variants={lineVariants}
            animate={clickControls}
            custom={{ x: -1, y: 0 }}
          />
          <m.path
            d="m6 12-1.9 2"
            variants={lineVariants}
            animate={clickControls}
            custom={{ x: -1, y: 1 }}
          />
          <m.path
            d="M7.2 2.2 8 5.1"
            variants={lineVariants}
            animate={clickControls}
            custom={{ x: 0, y: -1 }}
          />
        </svg>
      </div>
    );
  }
);

CursorClickIcon.displayName = "CursorClickIcon";

export { CursorClickIcon };

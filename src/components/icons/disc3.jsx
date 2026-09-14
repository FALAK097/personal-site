"use client";
import { useAnimation } from "motion/react";
import * as m from "motion/react-m";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

const Disc3Icon = forwardRef(
  ({ onMouseEnter, onMouseLeave, className, size = 18, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e) => {
        if (!isControlledRef.current) {
          controls.start("animate");
        } else {
          onMouseEnter?.(e);
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e) => {
        if (!isControlledRef.current) {
          controls.start("normal");
        } else {
          onMouseLeave?.(e);
        }
      },
      [controls, onMouseLeave]
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
          <m.g
            variants={{
              normal: { rotate: 0 },
              animate: {
                rotate: 180,
                transition: { duration: 0.5, ease: "easeInOut" },
              },
            }}
            style={{ originX: "12px", originY: "12px" }}
            animate={controls}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M6 12c0-1.7.7-3.2 1.8-4.2" />
            <circle cx="12" cy="12" r="2" />
            <path d="M18 12c0 1.7-.7 3.2-1.8 4.2" />
          </m.g>
        </svg>
      </div>
    );
  }
);
Disc3Icon.displayName = "Disc3Icon";
export { Disc3Icon };

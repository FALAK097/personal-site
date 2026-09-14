"use client";

import { useAnimation } from "motion/react";
import * as m from "motion/react-m";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

const sendVariants = {
  initial: {
    x: 0,
    y: 0,
    rotate: 0,
  },
  hover: {
    x: [0, 2, 0],
    y: [0, -1, 0],
    rotate: [0, -5, 0],
    transition: {
      duration: 1,
      bounce: 0.3,
    },
  },
};

const trailVariants = {
  initial: {
    opacity: 0,
    pathLength: 0,
  },
  animate: {
    opacity: [0, 1, 0],
    pathLength: [0, 1, 0],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
    },
  },
};

const SendIcon = forwardRef(
  ({ onMouseEnter, onMouseLeave, className, size = 18, ...props }, ref) => {
    const trailControls = useAnimation();
    const sendControls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => {
          sendControls.start("hover");
          trailControls.start("animate");
        },
        stopAnimation: () => {
          sendControls.start("initial");
          trailControls.start("initial");
        },
      };
    });

    const handleMouseEnter = useCallback(
      (e) => {
        if (!isControlledRef.current) {
          sendControls.start("hover");
          trailControls.start("animate");
        } else {
          onMouseEnter?.(e);
        }
      },
      [onMouseEnter, sendControls, trailControls]
    );

    const handleMouseLeave = useCallback(
      (e) => {
        if (!isControlledRef.current) {
          sendControls.start("initial");
          trailControls.start("initial");
        } else {
          onMouseLeave?.(e);
        }
      },
      [sendControls, trailControls, onMouseLeave]
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
            d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2"
            variants={sendVariants}
            animate={sendControls}
          />
          <m.path
            d="M22 2L2 9"
            variants={trailVariants}
            animate={trailControls}
            strokeDasharray="1"
            style={{ opacity: 0 }}
          />
        </svg>
      </div>
    );
  }
);

SendIcon.displayName = "SendIcon";

export { SendIcon };

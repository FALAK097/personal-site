"use client";
import { useAnimation } from "motion/react";
import * as m from "motion/react-m";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

const BookmarkIcon = forwardRef(
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
            [controls, onMouseEnter],
        );

        const handleMouseLeave = useCallback(
            (e) => {
                if (!isControlledRef.current) {
                    controls.start("normal");
                } else {
                    onMouseLeave?.(e);
                }
            },
            [controls, onMouseLeave],
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
                        d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"
                        variants={{
                            normal: { y: 0, scale: 1 },
                            animate: {
                                y: [0, -2, 0],
                                scale: [1, 1.05, 1],
                                transition: { duration: 0.4 },
                            },
                        }}
                        animate={controls}
                    />
                </svg>
            </div>
        );
    },
);
BookmarkIcon.displayName = "BookmarkIcon";
export { BookmarkIcon };

"use client";
import { useAnimation } from "motion/react";
import * as m from "motion/react-m";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

const MusicIcon = forwardRef(
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
                    <m.path
                        d="M9 18V5l12-2v13"
                        variants={{
                            normal: { pathLength: 1 },
                            animate: {
                                pathLength: [1, 0.8, 1],
                                transition: { duration: 0.5 },
                            },
                        }}
                        animate={controls}
                    />
                    <m.circle
                        cx="6"
                        cy="18"
                        r="3"
                        variants={{
                            normal: { y: 0 },
                            animate: {
                                y: [0, -3, 0],
                                transition: { duration: 0.4, repeat: 1 },
                            },
                        }}
                        animate={controls}
                    />
                    <m.circle
                        cx="18"
                        cy="16"
                        r="3"
                        variants={{
                            normal: { y: 0 },
                            animate: {
                                y: [0, -3, 0],
                                transition: { duration: 0.4, delay: 0.1, repeat: 1 },
                            },
                        }}
                        animate={controls}
                    />
                </svg>
            </div>
        );
    }
);
MusicIcon.displayName = "MusicIcon";
export { MusicIcon };

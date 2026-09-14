"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import Image from "next/image";

const Confetti = () => {
  const pieces = Array.from({ length: 18 });
  return (
    <div className="absolute right-14 top-2.5 z-20">
      {pieces.map((_, i) => (
        <m.div
          key={i}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          animate={{
            opacity: 0,
            x: 60 * Math.cos((i / pieces.length) * 2 * Math.PI),
            y: -60 * Math.sin((i / pieces.length) * 2 * Math.PI) - 20,
            rotate: 360,
            scale: 1.2,
          }}
          transition={{ duration: 1.2, delay: 0.1 }}
          className="absolute w-2.5 h-2.5 rounded bg-[hsl(var(--hue),80%,60%)]"
          style={{
            background: `hsl(${i * 20}, 80%, 60%)`,
          }}
        />
      ))}
    </div>
  );
};

export const FootballGoalAnimation = () => {
  const [step, setStep] = useState("ready");
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const [goalX, setGoalX] = useState(0);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function updateGoalX() {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setGoalX(width - 100 - 32);
      }
    }
    updateGoalX();
    window.addEventListener("resize", updateGoalX);
    return () => window.removeEventListener("resize", updateGoalX);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      const active = document.activeElement;
      const isTyping =
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.isContentEditable);

      if (!isTyping && step === "ready" && e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        handleShoot();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [step]);

  const handleShoot = () => {
    if (step === "ready") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setStep("shooting");
      setTimeout(() => setStep("goal"), 900);
      setTimeout(() => setStep("returning"), 2000);
      setTimeout(() => setStep("ready"), 3200);
    }
  };

  const ballStart = { x: 0, y: 0 };
  const ballVariants = {
    ready: ballStart,
    shooting: { x: goalX, y: 0 },
    goal: { x: goalX, y: 0 },
    returning: ballStart,
  };

  const showGoalPost = ["shooting", "goal", "returning"].includes(step);

  return (
    <m.div
      ref={containerRef}
      className="relative w-screen max-w-full min-h-0 h-[100px] mb-0 mt-2 overflow-visible flex items-center"
      initial={{ opacity: 0, y: 32 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <audio
        ref={audioRef}
        src="/football/soccer-ball-kick.mp3"
        preload="auto"
      />
      <m.div
        className={[
          "absolute left-4 top-1/2 z-10",
          step === "ready" ? "cursor-pointer group" : "cursor-default",
          "-translate-y-1/2",
        ].join(" ")}
        initial="ready"
        animate={step}
        variants={ballVariants}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 14,
          duration: 0.9,
        }}
        onClick={handleShoot}
      >
        {step === "ready" && (
          <div className="hidden sm:block absolute bottom-[110%] left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-95 group-focus:opacity-95 pointer-events-none transition-opacity duration-200">
            Press <kbd className="px-1 font-semibold">Shift + Enter</kbd> to shoot!
          </div>
        )}
        <Image
          src="/football/football.svg"
          alt="Football"
          width={40}
          height={40}
        />
      </m.div>
      <AnimatePresence>{step === "goal" && <Confetti />}</AnimatePresence>
      <AnimatePresence>
        {step === "goal" && (
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute right-[100px] top-[70%] -translate-y-1/2 text-[22px] font-semibold text-clay-600 z-30"
          >
            Hala Madrid 🤍💜
          </m.div>
        )}
      </AnimatePresence>
      {showGoalPost && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-5 pointer-events-none">
          <Image
            src="/football/goal-post.svg"
            alt="Goal Post"
            width={100}
            height={60}
          />
        </div>
      )}
    </m.div>
  );
};

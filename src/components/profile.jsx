"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "./ui/button";
import { ArrowRightIcon } from "./icons/arrow-right";
import { AtSignIcon } from "./icons/at-sign";
import { SquigglyUnderline } from "./custom/squiggly-underline";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function Profile() {
  return (
    <section className="space-y-6 sm:space-y-7">
      <div className="space-y-2">
        <h1 className="text-lg font-medium tracking-[-0.02em] sm:text-xl">Hey I&apos;m Falak</h1>
        <RotatingRole />
      </div>
      <div className="max-w-[62ch] space-y-3 text-base leading-7 text-muted-foreground">
        <p>Whipping up clever solutions and wrestling with tricky challenges because who doesn&apos;t love a good tech puzzle?</p>
        <p>This is my quirky web nook for spilling my <SquigglyUnderline href="/writing" className="font-medium text-clay-500">learnings</SquigglyUnderline> and <SquigglyUnderline href="/projects" className="font-medium text-clay-500">projects</SquigglyUnderline>.</p>
        <p>Outside work, I&apos;m usually watching <InterestPreview label="football" kind="madrid" />, playing <InterestPreview label="Valorant" kind="raze" />, or at the <InterestPreview label="gym" kind="gym" />.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                variant="outline"
                className="hover:border-clay-400 hover:bg-transparent"
                asChild
              >
                <Link href="/contact">
                  <span className="me-1.5 size-5 rounded-full bg-gradient-to-br from-clay-300 via-clay-500 to-slate-600 shadow-[0_0_10px_rgba(92,190,255,0.5)]" />
                  Available for work
                </Link>
              </Button>
              <div className="group relative">
                <Button
                  variant="outline"
                  className="hover:border-clay-400 hover:bg-transparent"
                  asChild
                >
                  <a href="mailto:hi@falakgala.dev">
                    <AtSignIcon
                      className="-ms-1 text-clay-500"
                      size={16}
                      aria-hidden="true"
                    />
                    Let&apos;s Talk
                    <ArrowRightIcon
                      className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                      size={16}
                      aria-hidden="true"
                    />
                  </a>
                </Button>
              </div>
      </div>
    </section>
  );
}

const interestAssets = {
  madrid: { src: "/realmadrid.svg.webp", alt: "Real Madrid crest" },
  raze: { src: "/raze.png", alt: "Raze from Valorant" },
};

function InterestPreview({ label, kind }) {
  useEffect(() => {
    const asset = interestAssets[kind];
    if (!asset) return;
    const img = new window.Image();
    img.src = asset.src;
  }, [kind]);

  return (
    <TooltipProvider delayDuration={80}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0} className="cursor-pointer font-medium text-foreground decoration-clay-400/70 decoration-1 underline underline-offset-4 outline-none transition-colors duration-100 hover:text-clay-600 focus-visible:text-clay-600">{label}</span>
        </TooltipTrigger>
        <TooltipContent sideOffset={8} className="flex size-20 items-center justify-center rounded-none border-0 bg-transparent p-0 text-foreground shadow-none">
          {kind === "madrid" ? <img src="/realmadrid.svg.webp" alt="Real Madrid crest" className="size-full object-contain" /> : null}
          {kind === "raze" ? <img src="/raze.png" alt="Raze from Valorant" className="size-full object-contain" /> : null}
          {kind === "gym" ? <GymIcon className="size-14 text-clay-500" /> : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function GymIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M8.31885 12.1982L12.1989 8.31823M15.3029 11.4222L11.4229 15.3023" />
      <path d="M7.14342 19.3312L8.3807 20.5684C9.28489 21.4726 9.73699 21.9247 10.2891 21.9892C10.4123 22.0036 10.5368 22.0036 10.6601 21.9892C11.2121 21.9247 11.6642 21.4726 12.5684 20.5684C13.4726 19.6642 13.9247 19.2121 13.9892 18.6601C14.0036 18.5368 14.0036 18.4123 13.9892 18.2891C13.9247 17.737 13.4726 17.2849 12.5684 16.3807L7.6193 11.4316C6.71511 10.5274 6.26301 10.0753 5.71092 10.0108C5.58768 9.9964 5.46318 9.9964 5.33994 10.0108C4.78785 10.0753 4.33575 10.5274 3.43156 11.4316C2.52737 12.3358 2.07528 12.7879 2.0108 13.3399C1.9964 13.4632 1.9964 13.5877 2.0108 13.7109C2.07528 14.263 2.52737 14.7151 3.43157 15.6193L4.05021 16.2379" />
      <path d="M16.8566 4.66885L15.6193 3.43156C14.7151 2.52737 14.263 2.07528 13.7109 2.0108C13.5877 1.9964 13.4632 1.9964 13.3399 2.0108C12.7879 2.07528 12.3358 2.52737 11.4316 3.43156C10.5274 4.33575 10.0753 4.78785 10.0108 5.33994C9.9964 5.46318 9.9964 5.58768 10.0108 5.71092C10.0753 6.26301 10.5274 6.71511 11.4316 7.6193L16.3807 12.5684C17.2849 13.4726 17.737 13.9247 18.2891 13.9892C18.4123 14.0036 18.5368 14.0036 18.6601 13.9892C19.2121 13.9247 19.6642 13.4726 20.5684 12.5684C21.4726 11.6642 21.9247 11.2121 21.9892 10.6601C22.0036 10.5368 22.0036 10.4123 21.9892 10.2891C21.9247 9.73699 21.4726 9.28489 20.5684 8.3807L19.9498 7.76206" />
      <path d="M18.0188 2.49805L21.1228 5.60206" />
      <path d="M2.49756 18.0186L5.60157 21.1226" />
    </svg>
  );
}

const roles = ["AI Engineer", "Frontend Engineer", "Software Engineer"];

const ROLE_HOLD_MS = 2400;
const ROLE_EXIT_MS = 230;

function RotatingRole() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [phase, setPhase] = useState("visible");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timeoutId;
    let rafId;

    const wait = (ms) => new Promise((resolve) => { timeoutId = window.setTimeout(resolve, ms); });
    const nextFrame = () => new Promise((resolve) => { rafId = window.requestAnimationFrame(resolve); });

    (async () => {
      await wait(ROLE_HOLD_MS);
      while (true) {
        setPhase("exit");
        await wait(ROLE_EXIT_MS);
        setRoleIndex((index) => (index + 1) % roles.length);
        setPhase("enter");
        await nextFrame();
        await nextFrame();
        setPhase("visible");
        await wait(ROLE_HOLD_MS);
      }
    })();

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const role = roles[roleIndex];

  return (
    <>
      <span className="sr-only">AI Engineer, Frontend Engineer, and Software Engineer</span>
      <span className="t-think text-lg font-semibold sm:text-xl" aria-hidden="true">
        <span className="t-think-sizer">Software Engineer</span>
        <span className={`t-think-text${phase === "exit" ? " is-exit" : ""}${phase === "enter" ? " is-enter-start" : ""}`} data-text={role}>{role}</span>
      </span>
    </>
  );
}

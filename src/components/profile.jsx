"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "./ui/button";
import { ArrowRightIcon } from "./icons/arrow-right";
import { AtSignIcon } from "./icons/at-sign";
import { SquigglyUnderline } from "./custom/squiggly-underline";

export function Profile() {
  return (
    <section className="space-y-6 pt-5 sm:space-y-7 sm:pt-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium tracking-[-0.035em] sm:text-3xl">Hey I&apos;m Falak</h1>
        <RotatingRole />
      </div>
      <div className="max-w-[62ch] space-y-3 text-base leading-7 text-muted-foreground">
        <p>Whipping up clever solutions and wrestling with tricky challenges because who doesn&apos;t love a good tech puzzle?</p>
        <p>This is my quirky web nook for spilling my <SquigglyUnderline href="/writing" className="font-medium text-clay-500">learnings</SquigglyUnderline> and <SquigglyUnderline href="/projects" className="font-medium text-clay-500">projects</SquigglyUnderline>.</p>
        <p>Outside work, I&apos;m usually watching football, playing Valorant, or at the gym.</p>
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

const roles = ["AI Engineer", "Frontend Engineer", "Software Engineer"];

function RotatingRole() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [phase, setPhase] = useState("visible");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let swapTimer;
    let enterTimer;
    const holdTimer = window.setTimeout(() => {
      setPhase("exit");
      swapTimer = window.setTimeout(() => {
        setRoleIndex((index) => (index + 1) % roles.length);
        setPhase("enter");
        enterTimer = window.setTimeout(() => setPhase("visible"), 20);
      }, 200);
    }, 2000);

    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(swapTimer);
      window.clearTimeout(enterTimer);
    };
  }, [roleIndex]);

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

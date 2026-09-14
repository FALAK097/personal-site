import Link from "next/link";

import { Button } from "./ui/button";
import { ArrowRightIcon } from "./icons/arrow-right";
import { AtSignIcon } from "./icons/at-sign";
import { SquigglyUnderline } from "./custom/squiggly-underline";

export function Profile() {
  return (
    <div className="mx-auto mt-8 mb-16 flex max-w-4xl flex-col items-center justify-center gap-8 px-4 md:mt-16 md:mb-24">
      <div className="flex w-full flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
        <div className="flex flex-1 flex-col items-center space-y-5 text-center md:items-start md:text-left">
          <div className="relative flex w-full flex-col items-center space-y-1 md:items-start">
            <h1 className="flex flex-wrap justify-center text-xl tracking-tight text-foreground md:justify-start">
              Hey, I&apos;m Falak
            </h1>
            <p className="mt-2 flex h-8 items-center justify-center text-lg font-medium text-clay-500 md:justify-start">
              Software Engineer
            </p>
          </div>

          <div className="w-full space-y-4">
            <p className="text-base leading-relaxed text-foreground/80 md:text-left md:text-lg">
              Whipping up clever solutions and wrestling with tricky challenges
              because who doesn&apos;t love a good tech puzzle?
            </p>
            <p className="text-base leading-relaxed text-foreground/70">
              This is my quirky web nook for spilling my{" "}
              <SquigglyUnderline
                className="font-medium text-clay-500 transition-colors hover:text-clay-400"
                href="/blog"
              >
                learnings
              </SquigglyUnderline>{" "}
              and{" "}
              <SquigglyUnderline
                className="font-medium text-clay-500 transition-colors hover:text-clay-400"
                href="/projects"
              >
                projects
              </SquigglyUnderline>
              .
            </p>
            <p className="flex flex-wrap items-center justify-center gap-1 text-sm text-foreground/60 md:justify-start md:text-base">
              Outside work, I love watching football.
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-3 pt-2 md:items-start">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Button
                variant="outline"
                className="hover:border-clay-400 hover:bg-transparent"
                asChild
              >
                <Link href="/hire-me">
                  <span className="me-2 h-4 w-4 rounded-full bg-gradient-to-br from-clay-300 via-clay-500 to-clay-700 shadow-[0_0_8px_oklch(0.769_0.131_240.517_/_0.5)] sm:h-5 sm:w-5" />
                  Available for Hire
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
                <div className="absolute top-full left-1/2 z-10 mt-2 hidden -translate-x-1/2 rounded-lg bg-background px-2 py-1 text-xs text-clay-500 shadow-lg group-hover:block sm:text-sm">
                  hi@falakgala.dev
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

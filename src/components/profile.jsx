import Link from "next/link";

import { Button } from "./ui/button";
import { ArrowRightIcon } from "./icons/arrow-right";
import { AtSignIcon } from "./icons/at-sign";

export function Profile() {
  return (
    <section className="space-y-7 pt-6 sm:pt-10">
      <div className="space-y-5">
        <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Frontend-focused software engineer in Mumbai</p>
            <h1 className="max-w-[18ch] text-3xl font-semibold leading-[1.12] tracking-[-0.04em] text-foreground sm:text-4xl">
              I build fast, thoughtful products that feel good to use.
            </h1>
          </div>
          <div className="max-w-[62ch] space-y-3 text-base leading-7 text-muted-foreground">
            <p>
              I&apos;m Falak Gala. I turn complex workflows into clear interfaces and ship production software across frontend, backend, AI, and infrastructure.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                variant="outline"
                className="hover:border-clay-400 hover:bg-transparent"
                asChild
              >
                <Link href="/hire-me">
                  <span className="me-1.5 size-2 rounded-full bg-clay-500" />
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
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

export function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <p className="font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">error</p>
        <h1 className="page-heading mt-2">something went wrong</h1>
        <p className="page-intro">
          This page hit an unexpected error. Reloading usually clears it. If it keeps happening,
          email me at{" "}
          <a
            href="mailto:hi@falakgala.dev"
            className="font-medium text-clay-500 transition-colors hover:text-clay-600"
          >
            hi@falakgala.dev
          </a>
          .
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button variant="outline" className="hover:border-clay-400 hover:bg-transparent" onClick={reset}>
            try again
          </Button>
          <Button variant="outline" className="hover:border-clay-400 hover:bg-transparent" asChild>
            <Link href="/">go home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

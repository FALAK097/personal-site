import Link from "next/link";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

export function PageNotFound() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <p className="font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">404</p>
        <h1 className="page-heading mt-2">page not found</h1>
        <p className="page-intro">
          That URL doesn&apos;t exist here. It may have moved, or the link was mistyped.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button variant="outline" className="hover:border-clay-400 hover:bg-transparent" asChild>
            <Link href="/">go home</Link>
          </Button>
          <Button variant="outline" className="hover:border-clay-400 hover:bg-transparent" asChild>
            <Link href="/writing">read the writing</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

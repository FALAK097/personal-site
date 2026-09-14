import { ArrowUpRight, CalendarDays, FileText, Mail } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export const metadata = {
  title: "Contact",
  description: "Work with Falak Gala across product engineering, AI systems, infrastructure, and full-stack software.",
};

const capabilities = [
  "Frontend and backend systems, from polished interfaces to scalable APIs",
  "AI agents, model integrations, evaluation, and self-hosted AI infrastructure",
  "Cloud infrastructure, deployment pipelines, observability, and performance",
  "System design, technical documentation, and clear collaboration with clients and developers",
];

export default function ContactPage() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <div className="space-y-16">
          <header className="space-y-6">
            <div>
              <h1 className="page-heading">Contact</h1>
              <p className="page-intro">I help teams turn complex product ideas into clear, scalable, production ready systems across product, AI, and infrastructure.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ContactLink href="mailto:hi@falakgala.dev" icon={Mail}>Email me</ContactLink>
              <ContactLink href="https://cal.com/falak" icon={CalendarDays} external>Book a call</ContactLink>
              <ContactLink href="/resume.pdf" icon={FileText} external>View resume</ContactLink>
            </div>
          </header>

          <section className="space-y-5">
            <div><h2 className="section-heading">What I can help with</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">I can own a focused interface, build an end-to-end system, or work across product and engineering boundaries to get complex software shipped.</p></div>
            <ul className="divide-y divide-border/70">{capabilities.map((capability) => <li key={capability} className="flex gap-3 py-3 text-sm leading-6 text-muted-foreground"><span className="text-clay-500">•</span>{capability}</li>)}</ul>
          </section>

          <section className="space-y-6">
            <div><h2 className="section-heading">Tell me about the work</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Share the problem, timeline, and what success looks like. I usually reply within two working days.</p></div>
            <ContactForm />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ContactLink({ href, icon: Icon, external = false, children }) {
  return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="group inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium transition-colors duration-100 hover:border-clay-500/60 hover:text-clay-600"><Icon className="size-3.5" />{children}{external ? <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform duration-150 group-hover:rotate-45" /> : null}</a>;
}

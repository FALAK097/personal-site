import { ArrowUpRight, CalendarDays, FileText, Mail } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { PageHeader } from "@/components/custom/page-header";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Contact",
  description: "Work with Falak Gala across product engineering, AI systems, infrastructure, and full-stack software.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <div className="space-y-16">
          <PageHeader
            title="contact"
            intro="I help teams turn complex product ideas into clear, scalable, production ready systems across product, AI, and infrastructure."
          >
            <div className="flex flex-wrap gap-2 pt-3">
              <ContactLink href="mailto:hi@falakgala.dev" icon={Mail} tooltip="hi@falakgala.dev">Email me</ContactLink>
              <ContactLink href="https://cal.com/falak" icon={CalendarDays} tooltip="cal.com/falak" external>Book a call</ContactLink>
              <ContactLink href="/resume.pdf" icon={FileText} external>View resume</ContactLink>
            </div>
          </PageHeader>

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

function ContactLink({ href, icon: Icon, external = false, tooltip, children }) {
  const link = <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="group inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium transition-colors duration-100 hover:border-clay-500/60 hover:text-clay-600"><Icon className="size-3.5" />{children}{external ? <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform duration-150 group-hover:rotate-45" /> : null}</a>;

  if (!tooltip) return link;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent sideOffset={8}>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

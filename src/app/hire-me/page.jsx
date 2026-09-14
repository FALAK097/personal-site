import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { CalendarDaysIcon, TrendingUpIcon, CheckCheckIcon } from "@/components/icons";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Hire Me",
  description:
    "Interested in working together? Let's discuss how I can help with your next project. Available for full-time and freelance opportunities.",
};

export default function HireMePage() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="page-heading">Let&apos;s work together</h1>
            <p className="page-intro">
              I&apos;m always interested in hearing about new opportunities.
              Feel free to reach out if you&apos;d like to work together or
              simply discuss ideas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="hover:bg-transparent hover:border-clay-400"
              >
                <a href="/resume.pdf" rel="noopener noreferrer" target="_blank">
                  View Resume
                  <TrendingUpIcon className="ml-2 h-5 w-5" />
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="hover:bg-transparent hover:border-clay-400"
              >
                <a
                  href="https://cal.com/falak"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Schedule a Call
                  <CalendarDaysIcon className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
            <ContactForm />

            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium mb-3">What I Can Do For You</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCheckIcon className="w-4 h-4 text-clay-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Full-Stack Web App Development (React, Next.js, Node, Python)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCheckIcon className="w-4 h-4 text-clay-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Mobile App Development (React Native, Expo)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCheckIcon className="w-4 h-4 text-clay-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      AI Integrations & LLM Wrappers
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCheckIcon className="w-4 h-4 text-clay-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Frontend Design
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium mb-3">Location</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-clay-500 flex-shrink-0" />
                  <p className="text-muted-foreground">Mumbai, India (Remote)</p>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium mb-3">Availability</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-clay-500 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Open to full-time opportunities
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-clay-500 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Available for freelance projects
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

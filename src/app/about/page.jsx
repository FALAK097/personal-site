import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AboutContent } from "@/components/about/about-content";

export const metadata = {
  title: "About Me",
  description:
    "Learn more about me, my background, skills, and what drives me as a developer.",
};

export default function AboutPage() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <div className="space-y-10">
          <div><h1 className="page-heading">About</h1><p className="page-intro">How I became a developer, what I care about, and the experience I bring to a product team.</p></div>
          <AboutContent />
        </div>
      </main>
      <Footer />
    </div>
  );
}

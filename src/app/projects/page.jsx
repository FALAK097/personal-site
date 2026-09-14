import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ProjectList } from "@/components/project-list";
import { projects } from "@/lib/project-data";

export const metadata = {
  title: "Projects",
  description:
    "Explore my portfolio of projects, including web applications, saas products and personal experiments.",
};

export default function ProjectsPage() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <div className="space-y-10">
          <div>
            <h1 className="page-heading">Projects</h1>
            <p className="page-intro">
              Production products, independent tools, and experiments I&apos;ve designed and shipped.
            </p>
          </div>
          <ProjectList projects={projects} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

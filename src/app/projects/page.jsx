import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PageHeader } from "@/components/custom/page-header";
import { ProjectList } from "@/components/project-list";
import { projects } from "@/lib/project-data";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Projects",
  description:
    "Explore my portfolio of projects, including web applications, saas products and personal experiments.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">
        <div className="space-y-10">
          <PageHeader
            title="Projects"
            intro="Production products, independent tools, and experiments I&apos;ve designed and shipped."
          />
          <ProjectList projects={projects} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

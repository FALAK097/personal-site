import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PageHeader } from "@/components/custom/page-header";
import { ProjectList } from "@/components/project-list";
import { projects } from "@/lib/project-data";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Projects",
  description:
    "Production SaaS products, AI systems, desktop apps, and Next.js engineering projects built by Falak Gala — including OutCallerAI, Waitlyze, Glyph, and DMS.",
  path: "/projects",
});

export default function ProjectsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects — Falak Gala",
    url: "https://falakgala.dev/projects",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareApplication",
          name: project.title,
          description: project.description,
          applicationCategory: "DeveloperApplication",
          ...(project.deployedUrl ? { url: project.deployedUrl } : {}),
          ...(project.githubUrl ? { sameAs: project.githubUrl } : {}),
          author: {
            "@id": "https://falakgala.dev/#person",
          },
          keywords: project.tags.join(", "),
        },
      })),
    },
  };

  return (
    <div className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="page-main">
        <div className="space-y-10">
          <PageHeader
            title="projects"
            intro="Production products, independent tools, and experiments I&apos;ve designed and shipped."
          />
          <ProjectList projects={projects} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

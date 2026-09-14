import Image from "next/image";
import Link from "next/link";
import { SkillsLogo } from "./custom/skills-logo";

export function RecentProjects({ projects }) {
  const getLink = (project) =>
    project.deployedUrl || project.githubUrl || "/projects";

  // Bento layout configuration - balanced grid
  const bentoConfig = [
    { colSpan: "md:col-span-7", rowSpan: "", size: "large" },
    { colSpan: "md:col-span-5", rowSpan: "", size: "medium" },
    { colSpan: "md:col-span-5", rowSpan: "", size: "medium" },
    { colSpan: "md:col-span-7", rowSpan: "", size: "medium" },
    { colSpan: "md:col-span-6", rowSpan: "", size: "medium" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-light">
          I love building products
        </h2>
        <Link
          href="/projects"
          className="text-sm text-muted-foreground hover:text-clay-400 transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {projects.slice(0, 4).map((project, index) => {
          const href = getLink(project);
          const config = bentoConfig[index] || bentoConfig[3];

          return (
            <article
              key={project.id}
              className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card hover:border-border hover:shadow-xl transition-all duration-500 ${config.colSpan}`}
            >
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="absolute inset-0 z-10"
                aria-label={`Open ${project.title}`}
              />

              <div className="relative h-full flex flex-col">
                {/* Project Image */}
                <div className="relative overflow-hidden h-32 md:h-40 border-b border-border/50 bg-muted/20">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                  />

                </div>

                {/* Content */}
                <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-base md:text-lg">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-xs md:text-sm line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Stack Icons */}
                  <div className="flex flex-wrap gap-2 mt-3 relative z-20">
                    {project.tags.slice(0, 4).map((tag, tagIndex) => (
                      <div
                        key={tag}
                        className="pointer-events-auto"
                      >
                        <SkillsLogo skill={tag} index={tagIndex} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

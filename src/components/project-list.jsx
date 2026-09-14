"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { SkillsLogo } from "@/components/custom/skills-logo";
import { cn } from "@/lib/utils";
import { ViewToggle, useViewPreference } from "@/components/view-toggle";

export function ProjectList({ projects, compact = false }) {
  const [view, setView, viewReady] = useViewPreference();
  const shown = compact ? projects.slice(0, 4) : projects;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        {compact ? <h2 className="section-heading">Things I&apos;ve built</h2> : <span />}
        <ViewToggle value={view} onChange={setView} />
      </div>
      <div className={cn("transition-opacity duration-100", !viewReady && "opacity-0", view === "grid" && "grid gap-x-5 gap-y-8 sm:grid-cols-2")}>
        {shown.map((project, index) => (
          <article key={project.id} className={cn("group", view === "list" && "flat-row")}>
            {view === "grid" ? (
              <div className="space-y-3">
                <a href={project.deployedUrl || project.githubUrl} target="_blank" rel="noreferrer" className="relative block aspect-[16/10] overflow-hidden rounded-lg bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-500">
                  <Image src={project.imageUrl} alt={`${project.title} product preview`} fill priority={index < 2} sizes="(max-width: 640px) 100vw, 320px" className="object-cover object-top transition-transform duration-200 group-hover:scale-[1.015]" />
                </a>
                <ProjectCopy project={project} />
              </div>
            ) : <div className="relative"><ProjectCopy project={project} /><div className="pointer-events-none absolute top-1/2 left-[calc(100%+2rem)] hidden w-64 -translate-y-1/2 overflow-hidden rounded-lg border border-border bg-background opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 lg:block"><div className="relative aspect-[16/10]"><Image src={project.imageUrl} alt="" fill sizes="256px" className="object-cover object-top" /></div></div></div>}
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectCopy({ project }) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-medium tracking-tight">{project.title}</h2>
          <p className="mt-1 max-w-[58ch] text-sm leading-6 text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {project.githubUrl ? <ProjectLink href={project.githubUrl} label={`${project.title} on GitHub`}><GithubIcon /></ProjectLink> : null}
          {project.deployedUrl ? <ProjectLink href={project.deployedUrl} label={`Open ${project.title}`}><ArrowUpRight /></ProjectLink> : null}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-1" aria-label={`${project.title} technology stack`}>
        {project.tags.slice(0, 7).map((tag, index) => <SkillsLogo key={tag} skill={tag} index={index} />)}
      </div>
    </div>
  );
}

function ProjectLink({ href, label, children }) {
  return <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors duration-100 hover:bg-muted hover:text-foreground [&_svg]:size-3.5 [&_svg]:stroke-[1.75]">{children}</a>;
}

"use client";

import Image from "next/image";
import * as m from "motion/react-m";

import { Button } from "@/components/ui/button";
import { GithubIcon, LinkIcon } from "@/components/icons";
import { SkillsLogo } from "./custom/skills-logo";

export const ProjectList = ({ projects }) => {
  return (
    <div className="space-y-16">
      {projects.map((project, projectIndex) => {
        const isEven = projectIndex % 2 === 0;
        return (
          <m.div
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: projectIndex * 0.2,
              ease: "easeOut",
            }}
          >
            <div
              className={`flex flex-col-reverse lg:flex-row ${
                !isEven ? "lg:flex-row-reverse" : ""
              } gap-10 items-center`}
            >
              <m.div
                className="flex-1 space-y-6"
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  delay: projectIndex * 0.2 + 0.1,
                }}
              >
                <div>
                  <h2
                    id={`project-title-${project.id}`}
                    className="text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-300"
                  >
                    {project.title}
                  </h2>
                  <m.p
                    className="text-base text-muted-foreground leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: projectIndex * 0.2 + 0.2,
                    }}
                  >
                    {project.description}
                  </m.p>
                </div>

                <div className="space-y-3">
                  <m.h3
                    className="text-sm font-light text-muted-foreground tracking-wider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: projectIndex * 0.2 + 0.3,
                    }}
                  >
                    Tech Stack
                  </m.h3>
                  <m.div
                    className="flex flex-wrap gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: projectIndex * 0.2 + 0.4,
                    }}
                  >
                    {project.tags.map((tag, index) => (
                      <SkillsLogo key={tag} skill={tag} index={index} />
                    ))}
                  </m.div>
                </div>

                <m.div
                  className="flex flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: projectIndex * 0.2 + 0.5,
                  }}
                >
                  {project.githubUrl && (
                    <m.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        asChild
                        variant="outline"
                        className="hover:border-primary hover:text-primary transition-all duration-300"
                      >
                        <a
                          href={project.githubUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                          aria-label={`View ${project.title} on GitHub`}
                        >
                          <GithubIcon className="h-4 w-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                    </m.div>
                  )}
                  {project.deployedUrl && (
                    <m.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        asChild
                        variant="outline"
                        className="hover:bg-transparent hover:border-clay-500 transition-all duration-300"
                      >
                        <a
                          href={project.deployedUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                          aria-label={`View live demo of ${project.title}`}
                        >
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                    </m.div>
                  )}
                </m.div>
              </m.div>

              <m.div
                className="flex-shrink-0 w-full lg:w-96"
                initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  delay: projectIndex * 0.2 + 0.3,
                }}
              >
                <div className="group relative aspect-video overflow-hidden rounded-xl shadow-2xl border border-muted-foreground/20 hover:shadow-3xl transition-all duration-500">
                  <Image
                    fill
                    alt={project.title}
                    className="object-cover"
                    src={project.imageUrl}
                    sizes="(max-width: 1024px) 100vw, 384px"
                    priority={projectIndex === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </m.div>
            </div>

            {projectIndex < projects.length - 1 && (
              <m.div
                className="mt-16 h-px bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.8,
                  delay: projectIndex * 0.2 + 0.6,
                }}
              />
            )}
          </m.div>
        );
      })}
    </div>
  );
};

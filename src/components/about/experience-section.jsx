import { forwardRef } from "react";
import * as m from "motion/react-m";
import { Badge } from "@/components/ui/badge";
import { SkillsLogo } from "@/components/custom/skills-logo";
import { FormattedText } from "@/components/custom/formatted-text";
import { experiences } from "@/lib/about-data";

export const ExperienceSection = forwardRef((props, ref) => {
  return (
    <m.section
      ref={ref}
      id="experience"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <h2 className="text-lg font-medium">Experience</h2>

      <div className="space-y-12 border-l border-border/50 pl-6 relative ml-2">
        {experiences.map((job, index) => (
          <m.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="relative"
          >
            <span className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-clay-500 shadow-sm" />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
              <div className="flex-1">
                <h3 className="text-md font-medium">{job.title}</h3>
                <p className="text-muted-foreground text-md">{job.company}</p>
              </div>
              <Badge
                variant="secondary"
                className="self-start w-fit px-3 py-1 bg-clay-500/10 text-clay-600 border-clay-200 dark:border-clay-800 dark:text-clay-400"
              >
                {job.duration}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex flex-wrap gap-3">
                  {job.technologies.map((tech, techIndex) => (
                    <SkillsLogo key={tech} skill={tech} index={techIndex} />
                  ))}
                </div>
              </div>

              <div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {job.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-clay-500/50 flex-shrink-0" />
                      <FormattedText text={achievement} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </m.div>
        ))}
      </div>
    </m.section>
  );
});

import { forwardRef } from "react";
import * as m from "motion/react-m";
import { Badge } from "@/components/ui/badge";
import { education } from "@/lib/about-data";

export const EducationSection = forwardRef((props, ref) => {
  return (
    <m.section
      ref={ref}
      id="education"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <h2 className="text-lg font-medium">Education</h2>

      <div className="space-y-8 border-l border-border/50 pl-6 relative ml-2">
        {education.map((ed, index) => (
          <m.div
            key={`${ed.institution}-${ed.degree}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="relative space-y-3"
          >
            <span className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-clay-500 shadow-sm" />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div className="flex-1">
                <h3 className="text-md font-medium">{ed.degree}</h3>
                <p className="text-muted-foreground text-sm">
                  {ed.institution}
                </p>
              </div>
              <div className="flex flex-row items-center justify-between sm:flex-col sm:gap-1">
                <Badge
                  variant="outline"
                  className="w-fit px-3 py-1 bg-clay-500/10 text-clay-600 border-clay-200 dark:border-clay-800 dark:text-clay-400"
                >
                  {ed.duration}
                </Badge>
                <span className="text-sm font-light">{ed.grade}</span>
              </div>
            </div>
          </m.div>
        ))}
      </div>
    </m.section>
  );
});

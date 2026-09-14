import { forwardRef } from "react";
import * as m from "motion/react-m";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkillsLogo } from "../custom/skills-logo";
import { skillCategories } from "@/lib/about-data";

export const SkillsSection = forwardRef((props, ref) => {
  return (
    <m.section
      ref={ref}
      id="skills"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <h2 className="text-lg font-medium">Skills</h2>

      <Tabs defaultValue="Frontend" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 h-auto p-1.5 bg-muted/50 rounded-xl">
          {Object.keys(skillCategories).map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="text-sm py-2.5 px-2 sm:py-2 sm:px-1 rounded-lg data-[state=active]:bg-clay-500/20 data-[state=active]:text-black data-[state=active]:border-clay-500 data-[state=active]:shadow-sm dark:data-[state=active]:bg-clay-500/20 dark:data-[state=active]:text-white dark:data-[state=active]:border-clay-500 dark:data-[state=active]:shadow-sm transition-all duration-200"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(skillCategories).map(([category, skills]) => (
          <TabsContent key={category} value={category} className="mt-6">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4"
            >
              {skills.map((skill, index) => (
                <div
                  key={skill}
                  className="flex flex-col items-center space-y-3 p-4 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                >
                  <SkillsLogo skill={skill} index={index} />
                  <span className="text-xs text-center text-muted-foreground">
                    {skill}
                  </span>
                </div>
              ))}
            </m.div>
          </TabsContent>
        ))}
      </Tabs>
    </m.section>
  );
});

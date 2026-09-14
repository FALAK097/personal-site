import { SkillsLogo } from "@/components/custom/skills-logo";
import { FormattedText } from "@/components/custom/formatted-text";
import { education, experiences, skillCategories } from "@/lib/about-data";

export function AboutContent() {
  return (
    <div className="space-y-16 sm:space-y-20">
      <section className="max-w-[62ch] space-y-4 text-base leading-7 text-muted-foreground">
        <p>I started programming in 2016 and found my direction in frontend engineering: turning complicated systems into interfaces people can understand immediately.</p>
        <p>Today I build production software across Next.js, React, TypeScript, Python, AI systems, and infrastructure. I care most about the part users feel—clarity, speed, accessibility, and the small interaction details that make a product trustworthy.</p>
        <p>At SSingularitee Technologies, I lead product development for AI-powered workflows, including multilingual voice automation, healthcare operations, and real-time analytics.</p>
      </section>
      <section className="space-y-5" id="experience">
        <h2 className="section-heading">Experience</h2>
        <div>{experiences.map((job) => <article key={`${job.company}-${job.title}`} className="flat-row space-y-4"><div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"><div><h3 className="font-medium">{job.title}</h3><p className="text-sm text-muted-foreground">{job.company}</p></div><time className="shrink-0 font-mono text-xs text-muted-foreground">{job.duration}</time></div><ul className="space-y-2 text-sm leading-6 text-muted-foreground">{job.achievements.slice(0, 3).map((achievement) => <li key={achievement} className="pl-4 before:-ml-4 before:mr-2 before:text-clay-500 before:content-['—']"><FormattedText text={achievement} /></li>)}</ul></article>)}</div>
      </section>
      <section className="space-y-6" id="skills">
        <div><h2 className="section-heading">Working stack</h2><p className="mt-1 text-sm text-muted-foreground">Tools I use to take products from interface to production.</p></div>
        <div className="space-y-6">{Object.entries(skillCategories).map(([category, skills]) => <div key={category} className="grid gap-3 sm:grid-cols-[8rem_1fr]"><h3 className="text-sm font-medium text-muted-foreground">{category}</h3><div className="flex flex-wrap gap-2">{skills.map((skill, index) => <div key={skill} className="flex items-center gap-2"><SkillsLogo skill={skill} index={index} /><span className="sr-only">{skill}</span></div>)}</div></div>)}</div>
      </section>
      <section className="space-y-5" id="education"><h2 className="section-heading">Education</h2><div>{education.map((item) => <div key={item.degree} className="flat-row flex flex-col gap-1 sm:flex-row sm:justify-between"><div><h3 className="text-sm font-medium">{item.degree}</h3><p className="text-sm text-muted-foreground">{item.institution}</p></div><p className="font-mono text-xs text-muted-foreground">{item.duration} · {item.grade}</p></div>)}</div></section>
    </div>
  );
}

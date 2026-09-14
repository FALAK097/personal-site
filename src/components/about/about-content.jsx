import { SkillsLogo } from "@/components/custom/skills-logo";
import { FormattedText } from "@/components/custom/formatted-text";
import { education, experiences, skillCategories } from "@/lib/about-data";

export function AboutContent() {
  return (
    <div className="space-y-16 sm:space-y-20">
      <section className="max-w-[62ch] space-y-4 text-base leading-7 text-muted-foreground">
        <p>My journey into programming began in <Highlight>2016</Highlight>. I was 14, learning <Highlight>Java and C++</Highlight> by memorising small programs for exams. I did not understand much of the theory yet, but seeing a program run successfully gave me a reason to keep exploring.</p>
        <p>That curiosity led me to a <Highlight>Diploma in Computer Engineering</Highlight>, where computers, networks, and software started to make sense as connected systems. In 2022, I built my first websites with HTML, CSS, JavaScript, and SCSS, then published them by dragging the files into GitHub. It was a scrappy beginning, but it made building for the web feel real.</p>
        <p>I joined a startup as an intern in <Highlight>2023</Highlight> and experienced how production software is designed, reviewed, and shipped. Alongside college, I spent the following year strengthening my fundamentals, learning modern web development, and building projects that pushed me beyond tutorials.</p>
        <p>Today I work across <Highlight>frontend, backend, AI engineering, infrastructure, and system design</Highlight>. I care most about clarity, speed, accessibility, and the small interaction details that make a product trustworthy. I still approach every new build with the curiosity that started with my first <Highlight>Hello World</Highlight>.</p>
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

function Highlight({ children }) {
  return <strong className="font-medium text-foreground decoration-clay-400/60 decoration-2 underline-offset-4">{children}</strong>;
}

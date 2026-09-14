import { forwardRef } from "react";
import * as m from "motion/react-m";
import { FormattedText } from "@/components/custom/formatted-text";

export const BioSection = forwardRef((props, ref) => {
  return (
    <m.section
      ref={ref}
      id="bio"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-6 text-lg leading-relaxed text-muted-foreground/90 font-light"
    >
      <div className="space-y-6">
        <p>
          <FormattedText
            text={
              "My journey into coding began back in `2016`, when I was a `14-year-old` introduced to Java and C++. Like most students at the time, I didn't really understand what I was doing, I would memorize programs like `Hello World`, `Fibonacci series`, and `Palindrome checkers` just to get through exams. But every time a program ran successfully, it sparked a sense of excitement and curiosity in me. That early spark led me to pursue a Diploma in Computer Engineering, where I finally began to understand how computers and networks actually worked."
            }
          />
        </p>
        <p>
          <FormattedText
            text={
              "In `July 2022`, I took my first real step into web development by building two educational websites using `HTML`, `CSS`, `JavaScript`, and `SCSS`. I even hosted them by dragging and dropping files directly into GitHub looking back, it’s funny how scrappy that process was, but it marked a turning point in my learning."
            }
          />
        </p>
        <p>
          <FormattedText
            text={
              "Soon after, I landed an internship at a startup in `January 2023`, where I worked for `7 months`. It was my first exposure to real world software development, and I learned a lot just by observing how actual systems were built and shipped (more on that in the `experience section`). After the internship, I spent the next year alongside college diving deep into self-learning exploring modern tech stacks, improving my fundamentals, and building projects that helped me grow as a developer."
            }
          />
        </p>
        <p>
          <FormattedText
            text={
              "In `July 2024`, I rejoined the same startup, this time as a `Software Engineer`, leading teams and building production grade AI products. Despite the progress and experience, I still approach coding with the same enthusiasm I had when I first got curious about `Hello World`. I continue to code almost every day, and building beautiful, meaningful user interfaces has become one of the most fulfilling parts of my journey."
            }
          />
        </p>
      </div>
    </m.section>
  );
});

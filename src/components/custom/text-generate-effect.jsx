"use client";

import * as m from "motion/react-m";
import { useEffect, useState } from "react";

export const TextGenerateEffect = ({ words, className, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const wordsArray = words.split(" ");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  const renderWords = () => {
    return (
      <m.div className={className}>
        {wordsArray.map((word, idx) => {
          return (
            <m.span
              key={word + idx}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={isVisible ? { opacity: 1, filter: "blur(0px)" } : {}}
              transition={{
                duration: 0.3,
                delay: idx * 0.1,
                ease: "easeOut",
              }}
              className="inline-block mr-1"
            >
              {word}
            </m.span>
          );
        })}
      </m.div>
    );
  };

  return renderWords();
};

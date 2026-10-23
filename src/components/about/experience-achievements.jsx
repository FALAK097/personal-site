"use client";

import { useState } from "react";
import { FormattedText } from "@/components/custom/formatted-text";

export function ExperienceAchievements({ achievements }) {
  const [expanded, setExpanded] = useState(false);
  const isTruncated = achievements.length > 3;
  const shown = expanded ? achievements : achievements.slice(0, 3);

  return (
    <div className="space-y-2">
      <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
        {shown.map((achievement) => (
          <li key={achievement} className="pl-4 before:-ml-4 before:mr-2 before:text-clay-500 before:content-['—']">
            <FormattedText text={achievement} />
          </li>
        ))}
      </ul>
      {isTruncated ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((open) => !open)}
          className="text-sm text-clay-700 transition-colors duration-100 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay-500 dark:text-clay-400"
        >
          {expanded ? "Show fewer" : `Show ${achievements.length - shown.length} more`}
        </button>
      ) : null}
    </div>
  );
}

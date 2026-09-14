"use client";

import { LayoutGrid, TextAlignJustify } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const views = [
  { value: "list", label: "List", Icon: TextAlignJustify },
  { value: "grid", label: "Showcase", Icon: LayoutGrid },
];

export function useViewPreference() {
  const [value, setValue] = useState("list");
  useEffect(() => {
    const saved = localStorage.getItem("portfolio-collection-view");
    if (saved === "list" || saved === "grid") setValue(saved);
  }, []);
  const update = (next) => { setValue(next); localStorage.setItem("portfolio-collection-view", next); };
  return [value, update];
}

export function ViewToggle({ value, onChange }) {
  return (
    <TooltipProvider delayDuration={250}>
      <div className="flex h-8 items-center rounded-md border border-border/80 bg-muted/40 p-0.5" role="group" aria-label="Change view">
        {views.map(({ value: option, label, Icon }) => (
          <Tooltip key={option}>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={label}
                aria-pressed={value === option}
                onClick={() => onChange(option)}
                className={cn(
                  "grid size-7 place-items-center rounded-[5px] text-muted-foreground transition-[background-color,color,box-shadow] duration-100",
                  value === option && "bg-background text-foreground shadow-sm"
                )}
              >
                <Icon className="size-3.5" strokeWidth={1.75} />
              </button>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

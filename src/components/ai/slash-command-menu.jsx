"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  AtSignIcon,
  CircleHelpIcon,
  FilePenLineIcon,
  ShipIcon,
  UserIcon,
  CommandIcon,
  HashIcon,
} from "../icons";

const commandIcons = {
  "/about": <UserIcon className="h-4 w-4" />,
  "/contact": <AtSignIcon className="h-4 w-4" />,
  "/projects": <ShipIcon className="h-4 w-4" />,
  "/writing": <FilePenLineIcon className="h-4 w-4" />,
  "/help": <CircleHelpIcon className="h-4 w-4" />,
};

export function SlashCommandMenu({
  commands,
  selectedIndex,
  onSelect,
  className,
}) {
  const selectedRef = useRef(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  if (commands.length === 0) return null;

  return (
    <div
      className={cn(
        "absolute bottom-full left-0 right-0 mb-2 border border-clay-200 dark:border-clay-700 rounded-lg shadow-xl backdrop-blur-sm max-h-60 overflow-auto z-[60] animate-in slide-in-from-bottom-2 fade-in-0 duration-200",
        className
      )}
    >
      <div className="p-2">
        <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground border-b border-clay-100 dark:border-clay-800 mb-2">
          <CommandIcon className="h-3 w-3" />
          <span>Quick Commands</span>
        </div>
        {commands.map((cmd, index) => (
          <button
            key={cmd.command}
            ref={index === selectedIndex ? selectedRef : null}
            type="button"
            onClick={() => onSelect(cmd)}
            className={cn(
              "flex items-center gap-3 w-full text-left px-3 py-2 rounded-md transition-all duration-150 text-sm",
              index === selectedIndex
                ? "bg-gradient-to-r from-clay-100 to-violet-100 dark:from-clay-900 dark:to-violet-900 text-clay-700 dark:text-clay-300"
                : "hover:bg-clay-50 dark:hover:bg-clay-950 text-gray-700 dark:text-gray-300"
            )}
          >
            <div className="flex items-center justify-center w-6 h-6 rounded bg-clay-100 dark:bg-clay-800 text-clay-600 dark:text-clay-400">
              {commandIcons[cmd.command] || <HashIcon className="h-3 w-3" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{cmd.command}</div>
              <div className="text-xs text-muted-foreground truncate">
                {cmd.description || cmd.question}
              </div>
            </div>
            {index === selectedIndex && (
              <div className="text-xs text-clay-600 dark:text-clay-400 font-medium">
                ↵
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

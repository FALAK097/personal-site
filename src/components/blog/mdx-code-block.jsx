"use client";

import { useState } from "react";
import { CheckCheckIcon, CopyIcon } from "../icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const MdxCodeBlock = ({ children, ...props }) => {
  const [copied, setCopied] = useState(false);

  const extractText = (child) => {
    if (typeof child === "string") return child;
    if (Array.isArray(child)) return child.map(extractText).join("");
    if (child?.props?.children) return extractText(child.props.children);
    return "";
  };

  const code = extractText(children);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="relative my-8 overflow-hidden rounded-xl border border-border bg-[#f6f8fa] shadow-sm dark:border-white/10 dark:bg-[#1e1e2e]">
      <pre
        {...props}
        className="overflow-x-auto !px-6 !py-5 !pr-14 text-sm leading-7"
      >
        {children}
      </pre>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 transition-opacity cursor-pointer"
              aria-label="Copy code"
            >
              {copied ? (
                <CheckCheckIcon className="w-4 h-4 text-clay-500" />
              ) : (
                <CopyIcon className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={8}>
            Copy
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

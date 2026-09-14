"use client";

import React from "react";
import * as m from "motion/react-m";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const skillLogos = {
  JavaScript: { logo: "/skills/javascript.svg", name: "JavaScript" },
  TypeScript: { logo: "/skills/typescript.svg", name: "TypeScript" },
  Electron: {logo: "/skills/electron.svg", name: "Electron"},
  Python: { logo: "/skills/python.svg", name: "Python" },
  "React.js": { logo: "/skills/react.svg", name: "React.js" },
  "Node.js": { logo: "/skills/nodejs.svg", name: "Node.js" },
  "Express.js": {
    logo: {
      light: "/skills/expressjs.svg",
      dark: "/skills/expressjs-light.svg",
    },
    name: "Express.js",
  },
  "Next.js": {
    logo: {
      light: "/skills/nextjs.svg",
      dark: "/skills/nextjs-light.svg",
    },
    name: "Next.js",
  },
  "React Native": { logo: "/skills/react-native.svg", name: "React Native" },
  Expo: { logo: "/skills/expo.svg", name: "Expo" },
  Swift: { logo: "/skills/swift.svg", name: "Swift" },
  Shadcn: {
    logo: {
      light: "/skills/shadcn-light.svg",
      dark: "/skills/shadcn.svg",
    },
    name: "Shadcn",
  },
  Motion: { logo: "/skills/motion.svg", name: "Motion" },
  Tailwind: { logo: "/skills/tailwindcss.svg", name: "Tailwind" },
  Sass: { logo: "/skills/sass.svg", name: "Sass" },
  Bootstrap: { logo: "/skills/bootstrap.svg", name: "Bootstrap" },
  "Chart.js": { logo: "/skills/chartjs.svg", name: "Chart.js" },
  Authjs: { logo: "/skills/authjs.svg", name: "Authjs" },
  BetterAuth: { logo: "/skills/better-auth.svg", name: "BetterAuth" },
  Clerk: {
    logo: {
      light: "/skills/clerk-light.svg",
      dark: "/skills/clerk.svg",
    },
    name: "Clerk",
  },
  Prisma: { logo: "/skills/prisma.svg", name: "Prisma" },
  Drizzle: { logo: "/skills/drizzle.svg", name: "Drizzle" },
  Stripe: { logo: "/skills/stripe.jpeg", name: "Stripe" },
  Gemini: { logo: "/skills/gemini.svg", name: "Gemini" },
  OpenAI: {
    logo: {
      light: "/skills/openai.svg",
      dark: "/skills/openai-light.svg",
    },
    name: "OpenAI",
  },
  FastAPI: { logo: "/skills/fastapi.svg", name: "FastAPI" },
  Laravel: { logo: "/skills/laravel.svg", name: "Laravel" },
  MySQL: { logo: "/skills/mysql.svg", name: "MySQL" },
  Redis: { logo: "/skills/redis.svg", name: "Redis" },
  MongoDB: { logo: "/skills/mongodb.svg", name: "MongoDB" },
  PostgreSQL: { logo: "/skills/postgresql.svg", name: "PostgreSQL" },
  Supabase: { logo: "/skills/supabase.svg", name: "Supabase" },
  Neon: { logo: "/skills/neon.svg", name: "Neon" },
  Upstash: { logo: "/skills/upstash.svg", name: "Upstash" },
  Docker: { logo: "/skills/docker.svg", name: "Docker" },
  DigitalOcean: { logo: "/skills/digitalocean.svg", name: "DigitalOcean" },
  Render: { logo: "/skills/render.jpg", name: "Render" },
  Vercel: {
    logo: {
      light: "/skills/vercel-light.svg",
      dark: "/skills/vercel.svg",
    },
    name: "Vercel",
  },
  "GitHub API": {
    logo: {
      light: "/skills/github-light.svg",
      dark: "/skills/github.svg",
    },
    name: "GitHub API",
  },
  Git: { logo: "/skills/git.svg", name: "Git" },
  Warp: { logo: "/skills/warp.svg", name: "Warp" },
  VsCode: { logo: "/skills/vscode.svg", name: "Vs Code" },
  Pnpm: {
    logo: {
      light: "/skills/pnpm-light.svg",
      dark: "/skills/pnpm.svg",
    },
    name: "Pnpm",
  },
  Postman: { logo: "/skills/postman.svg", name: "Postman" },
  Posthog: { logo: "/skills/posthog.svg", name: "Posthog" },
  Ghostty: { logo: "/skills/ghostty.svg", name: "Ghostty" },
};

export const SkillsLogo = ({ skill, index }) => {
  const { theme } = useTheme();
  const skillData = skillLogos[skill];

  if (!skillData) return null;

  const logoSrc =
    typeof skillData.logo === "object" && !React.isValidElement(skillData.logo)
      ? theme === "dark"
        ? skillData.logo.dark
        : skillData.logo.light
      : typeof skillData.logo === "string"
      ? skillData.logo
      : null;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <m.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.12, delay: Math.min(index, 4) * 0.02 }}
            whileHover={{
              scale: 1.06,
              y: -1,
              transition: { duration: 0.1 },
            }}
            className="relative"
          >
            <div className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background transition-colors duration-100 hover:border-clay-500/60">
              {React.isValidElement(skillData.logo) ? (
                <div className="w-6 h-6">{skillData.logo}</div>
              ) : (
                <span className="relative block size-[18px]">
                  <Image src={logoSrc} alt={skillData.name} fill sizes="18px" className="object-contain" />
                </span>
              )}
            </div>
          </m.div>
        </TooltipTrigger>
        <TooltipContent>
          <span>{skillData.name}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

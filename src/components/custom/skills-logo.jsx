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
  Motion: { logo: "/skills/m.svg", name: "Motion" },
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
            transition={{
              duration: 0.3,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            whileHover={{
              scale: 1.2,
              y: -5,
              transition: { duration: 0.2 },
            }}
            className="relative"
          >
            <div className="w-10 h-10 rounded-lg shadow-md flex items-center justify-center border transition-all duration-200 hover:shadow-lg">
              {React.isValidElement(skillData.logo) ? (
                <div className="w-6 h-6">{skillData.logo}</div>
              ) : (
                <Image
                  src={logoSrc}
                  alt={skillData.name}
                  width={24}
                  height={24}
                  className="object-contain"
                />
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

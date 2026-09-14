import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectList } from "@/components/project-list";

export function RecentProjects({ projects }) {
  return (
    <div className="space-y-5">
      <ProjectList projects={projects} compact />
      <Link href="/projects" className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-100 hover:text-foreground">
        All projects
        <ArrowUpRight className="size-3.5 transition-transform duration-150 group-hover:rotate-45" />
      </Link>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Plus, FolderGit2 } from "lucide-react";
import { useAppData } from "@/hooks/useAppData";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const { state } = useAppData();
  if (!state) return null;

  const projects = [...state.projects].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Projects</h1>
          <p className="mt-1 text-sm text-text-muted">
            Ship something, get an AI review, and turn it into XP.
          </p>
        </div>
        <Link href="/projects/new" className={buttonVariants({ size: "default" })}>
          <Plus className="size-4" /> Submit project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-strong p-12 text-center">
          <FolderGit2 className="mx-auto size-8 text-text-faint" />
          <p className="mt-3 font-medium text-text">No projects yet</p>
          <p className="mt-1 text-sm text-text-muted">
            Submit your first project to get scored and start earning project XP.
          </p>
          <Link href="/projects/new" className={cn(buttonVariants(), "mt-4")}>
            <Plus className="size-4" /> Submit your first project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

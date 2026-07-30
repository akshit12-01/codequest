import Link from "next/link";
import { FolderGit2, Loader2, CircleAlert, CheckCircle2, GitFork } from "lucide-react";
import type { Project } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkillBadge } from "@/components/common/SkillBadge";
import { formatRelativeTime } from "@/lib/utils";
import { normalizeSkillName } from "@/config/skills";

function formatRepoLabel(url: string): string {
  try {
    const u = new URL(url);
    return u.pathname.replace(/^\//, "") || u.hostname;
  } catch {
    return url || "no repository linked";
  }
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`} className="block h-full">
      <Card className="animate-rise-in h-full p-5 transition-colors hover:border-primary/40">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <FolderGit2 className="size-4 shrink-0 text-text-faint" />
            <h3 className="truncate font-semibold text-text">{project.name}</h3>
          </div>
          {project.status === "reviewed" && project.review && (
            <Badge variant="success" className="shrink-0">
              <CheckCircle2 className="size-3" />
              {project.review.overallScore}/100
            </Badge>
          )}
          {project.status === "pending" && (
            <Badge variant="muted" className="shrink-0">
              <Loader2 className="size-3 animate-spin" />
              Reviewing
            </Badge>
          )}
          {project.status === "failed" && (
            <Badge variant="danger" className="shrink-0">
              <CircleAlert className="size-3" />
              Failed
            </Badge>
          )}
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-text-muted">{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {project.skillsUsed.slice(0, 5).map((s) => (
            <SkillBadge key={s} skillId={normalizeSkillName(s)} size="sm" />
          ))}
          {project.skillsUsed.length > 5 && (
            <span className="text-xs text-text-faint">+{project.skillsUsed.length - 5} more</span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-text-faint">
          <span className="flex min-w-0 items-center gap-1">
            <GitFork className="size-3 shrink-0" />
            <span className="truncate">{formatRepoLabel(project.githubUrl)}</span>
          </span>
          <span className="shrink-0">{formatRelativeTime(project.createdAt)}</span>
        </div>
      </Card>
    </Link>
  );
}

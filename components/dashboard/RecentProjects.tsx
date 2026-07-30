import Link from "next/link";
import { FolderGit2, Loader2, CircleAlert } from "lucide-react";
import type { AppState } from "@/types";
import { getRecentProjects } from "@/lib/statsEngine";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RecentProjects({ state }: { state: AppState }) {
  const projects = getRecentProjects(state, 4);

  return (
    <Card className="animate-rise-in">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Recent projects</CardTitle>
        <Link href="/projects" className="text-xs text-primary-soft hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-1">
        {projects.length === 0 ? (
          <p className="text-sm text-text-muted">
            Submit your first project to get an AI review.
          </p>
        ) : (
          projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="-mx-2 flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-surface-2"
            >
              <FolderGit2 className="size-4 shrink-0 text-text-faint" />
              <span className="min-w-0 flex-1 truncate text-sm text-text">{project.name}</span>
              {project.status === "reviewed" && project.review && (
                <Badge variant="success">{project.review.overallScore}/100</Badge>
              )}
              {project.status === "pending" && (
                <Badge variant="muted">
                  <Loader2 className="size-3 animate-spin" /> Reviewing
                </Badge>
              )}
              {project.status === "failed" && (
                <Badge variant="danger">
                  <CircleAlert className="size-3" /> Failed
                </Badge>
              )}
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}

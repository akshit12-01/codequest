import Link from "next/link";
import { GitFork, ThumbsUp, ThumbsDown, Lightbulb, ArrowRight, Bot, Cpu } from "lucide-react";
import type { Project, ProjectReview } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkillBadge } from "@/components/common/SkillBadge";
import { ScoreBar } from "./ScoreBar";
import { Progress } from "@/components/ui/progress";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatRelativeTime } from "@/lib/utils";
import { normalizeSkillName } from "@/config/skills";

export function ReviewReport({ project, review }: { project: Project; review: ProjectReview }) {
  const scoreColor =
    review.overallScore >= 80
      ? "text-success"
      : review.overallScore >= 60
      ? "text-warning"
      : "text-danger";

  return (
    <div className="space-y-6">
      <div className="panel-cut glass animate-rise-in relative overflow-hidden border border-border-strong p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="muted">{review.difficulty}</Badge>
              <Badge variant={review.reviewedBy === "gemini" ? "default" : "muted"}>
                <Bot className="size-3" />
                {review.reviewedBy === "gemini" ? "Gemini review" : "Offline preview review"}
              </Badge>
            </div>
            <h2 className="mt-2 text-sm font-medium text-text-muted">Overall score</h2>
            <p className={cn("font-mono text-5xl font-bold", scoreColor)}>
              {review.overallScore}
              <span className="text-xl text-text-faint">/100</span>
            </p>
          </div>
          <div className="rounded-lg border border-warning/30 bg-warning/10 px-5 py-3 text-center">
            <p className="font-mono text-2xl font-bold text-warning">+{review.xpAwarded}</p>
            <p className="text-[11px] uppercase tracking-wide text-text-muted">XP awarded</p>
          </div>
        </div>
        <p className="relative mt-4 max-w-2xl text-sm leading-relaxed text-text-muted">
          {review.summary}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Score breakdown</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <ScoreBar label="Architecture" value={review.architecture} />
              <ScoreBar label="Security" value={review.security} />
              <ScoreBar label="Performance" value={review.performance} />
              <ScoreBar label="Scalability" value={review.scalability} />
              <ScoreBar label="Code quality" value={review.codeQuality} />
              <ScoreBar label="Documentation" value={review.documentation} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skill ratings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {review.skills.map((s) => (
                <div key={s.name} className="rounded-lg border border-border bg-surface-2 p-3">
                  <div className="flex items-center justify-between">
                    <SkillBadge skillId={normalizeSkillName(s.name)} />
                    <span className="font-mono text-xs text-success">+{s.xpAwarded} XP</span>
                  </div>
                  <Progress value={s.score} className="mt-2 h-1.5" />
                  <p className="mt-2 text-xs text-text-muted">{s.feedback}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ThumbsUp className="size-4 text-success" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-text-muted">
                  {review.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-success">+</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ThumbsDown className="size-4 text-danger" />
                  Weaknesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-text-muted">
                  {review.weaknesses.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-danger">–</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="size-4 text-warning" />
                Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-text-muted">
                {review.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-warning">→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-soft hover:underline"
              >
                <GitFork className="size-4" /> View repository
              </a>
              <p className="text-text-muted">{project.description}</p>
              <p className="text-xs text-text-faint">
                Submitted {formatRelativeTime(project.createdAt)}
              </p>
              <p className="text-xs text-text-faint">
                Reviewed {formatRelativeTime(review.reviewedAt)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/25 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Cpu className="size-4 text-primary-soft" />
                Next recommended project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-muted">{review.nextProject}</p>
              <Link
                href="/projects/new"
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "mt-3")}
              >
                Submit next project <ArrowRight className="size-3.5" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

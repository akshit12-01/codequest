"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpenCheck,
} from "lucide-react";
import { useAppData } from "@/hooks/useAppData";
import { useActions } from "@/hooks/useActions";
import {
  getTopicById,
  isTopicUnlocked,
  isTopicComplete,
  getAdjacentTopics,
  getUnlocksFor,
} from "@/lib/roadmapEngine";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SkillBadge } from "@/components/common/SkillBadge";
import { ResourceList } from "@/components/topic/ResourceList";
import { PrerequisiteList } from "@/components/topic/PrerequisiteList";
import { NoteEditor } from "@/components/topic/NoteEditor";
import { cn } from "@/lib/utils";

export default function TopicDetailPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const { state } = useAppData();
  const { completeTopic } = useActions();

  const topic = getTopicById(topicId);

  if (!state) return null;
  if (!topic) notFound();

  const complete = isTopicComplete(state, topic.id);
  const unlocked = isTopicUnlocked(state, topic);
  const { prev, next } = getAdjacentTopics(topic.id);
  const unlocks = getUnlocksFor(topic.id);
  const note = state.notes[topic.id];

  return (
    <div className="space-y-6">
      <Link
        href="/roadmap"
        className="inline-flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-text"
      >
        <ChevronLeft className="size-3.5" /> Back to roadmap
      </Link>

      <div className="animate-rise-in rounded-xl border border-border-strong bg-surface p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="muted">Tier {topic.tier}</Badge>
              <Badge variant="muted">{topic.difficulty}</Badge>
              {complete && (
                <Badge variant="success">
                  <CheckCircle2 className="size-3" /> Completed
                </Badge>
              )}
              {!complete && !unlocked && (
                <Badge variant="danger">
                  <Lock className="size-3" /> Locked
                </Badge>
              )}
            </div>
            <h1 className="mt-2 text-2xl font-bold text-text sm:text-3xl">{topic.name}</h1>
            <p className="mt-2 max-w-2xl text-sm text-text-muted">{topic.description}</p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="flex items-center gap-3 text-sm text-text-muted">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {topic.estimatedHours}h
              </span>
              <span className="flex items-center gap-1 text-warning">
                <Zap className="size-3.5" />+{topic.xpReward} XP
              </span>
            </div>
            {complete ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-success/30 bg-success/10 px-4 py-2 text-sm font-medium text-success">
                <CheckCircle2 className="size-4" /> Completed
              </span>
            ) : unlocked ? (
              <Button onClick={() => completeTopic(topic)}>
                <CheckCircle2 className="size-4" /> Mark Complete
              </Button>
            ) : (
              <Button disabled title="Complete the prerequisites first">
                <Lock className="size-4" /> Locked
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {topic.skillIds.map((id) => (
            <SkillBadge key={id} skillId={id} level={state.skills[id]?.level} />
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Theory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topic.theory.split("\n\n").map((para, i) => (
                <p key={i} className="text-sm leading-relaxed text-text-muted">
                  {para}
                </p>
              ))}
            </CardContent>
          </Card>

          {topic.relatedProjectHint && (
            <Card className="border-primary/25 bg-primary/5">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div className="flex items-start gap-3">
                  <BookOpenCheck className="mt-0.5 size-5 shrink-0 text-primary-soft" />
                  <div>
                    <p className="text-sm font-medium text-text">Related project</p>
                    <p className="mt-0.5 text-sm text-text-muted">{topic.relatedProjectHint}</p>
                  </div>
                </div>
                <Link
                  href={`/projects/new?skills=${topic.skillIds.join(",")}`}
                  className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "shrink-0")}
                >
                  Submit a project <ArrowRight className="size-3.5" />
                </Link>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResourceList resources={topic.resources} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your notes</CardTitle>
            </CardHeader>
            <CardContent>
              <NoteEditor key={topic.id} topicId={topic.id} note={note} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skill progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topic.skillIds.map((id) => {
                const skill = state.skills[id];
                return (
                  <div key={id}>
                    <div className="flex items-center justify-between">
                      <SkillBadge skillId={id} level={skill?.level ?? 1} size="sm" />
                      <span className="font-mono text-xs text-text-muted">
                        {skill?.completionPercent ?? 0}%
                      </span>
                    </div>
                    <Progress value={skill?.completionPercent ?? 0} className="mt-1.5 h-1.5" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Prerequisites</CardTitle>
            </CardHeader>
            <CardContent>
              <PrerequisiteList prerequisites={topic.prerequisites} state={state} />
            </CardContent>
          </Card>

          {unlocks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Unlocks next</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {unlocks.map((t) => (
                    <li key={t.id}>
                      <Link
                        href={`/roadmap/${t.id}`}
                        className="text-sm text-text-muted transition-colors hover:text-primary-soft"
                      >
                        {t.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        {prev ? (
          <Link
            href={`/roadmap/${prev.id}`}
            className="flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text"
          >
            <ChevronLeft className="size-4" /> {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/roadmap/${next.id}`}
            className="flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text"
          >
            {next.name} <ChevronRight className="size-4" />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

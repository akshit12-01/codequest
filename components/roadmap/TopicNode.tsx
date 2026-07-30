import Link from "next/link";
import { Lock, CheckCircle2, PlayCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppState, RoadmapTopic } from "@/types";
import { isTopicComplete, isTopicUnlocked, getTopicById } from "@/lib/roadmapEngine";
import { Badge } from "@/components/ui/badge";
import { SkillBadge } from "@/components/common/SkillBadge";

export function TopicNode({ topic, state }: { topic: RoadmapTopic; state: AppState }) {
  const complete = isTopicComplete(state, topic.id);
  const unlocked = isTopicUnlocked(state, topic);
  const status = complete ? "complete" : unlocked ? "unlocked" : "locked";

  const card = (
    <div
      className={cn(
        "group relative flex h-full flex-col rounded-lg border p-4 transition-all",
        status === "complete" && "border-success/30 bg-success/5",
        status === "unlocked" &&
          "border-primary/25 bg-surface-2 hover:-translate-y-0.5 hover:border-primary/50",
        status === "locked" && "border-border bg-surface-2/40 opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-text">{topic.name}</h4>
        {status === "complete" && (
          <CheckCircle2 className="size-4 shrink-0 text-success" />
        )}
        {status === "unlocked" && (
          <PlayCircle className="size-4 shrink-0 text-primary-soft" />
        )}
        {status === "locked" && <Lock className="size-4 shrink-0 text-text-faint" />}
      </div>
      <p className="mt-1 line-clamp-2 flex-1 text-xs text-text-muted">{topic.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge variant="muted">{topic.difficulty}</Badge>
        <Badge variant="muted">
          <Clock className="size-3" />
          {topic.estimatedHours}h
        </Badge>
        <Badge>+{topic.xpReward} XP</Badge>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {topic.skillIds.map((id) => (
          <SkillBadge key={id} skillId={id} size="sm" />
        ))}
      </div>
      {status === "locked" && (
        <p className="mt-2 text-[11px] text-text-faint">
          Requires: {topic.prerequisites.map((id) => getTopicById(id)?.name ?? id).join(", ")}
        </p>
      )}
    </div>
  );

  if (status === "locked") {
    return (
      <div className="cursor-not-allowed" title="Complete the prerequisites to unlock this topic">
        {card}
      </div>
    );
  }

  return (
    <Link href={`/roadmap/${topic.id}`} className="block h-full">
      {card}
    </Link>
  );
}

import Link from "next/link";
import { ArrowRight, Compass, CornerDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RoadmapTopic } from "@/types";

export function ContinueQuestCard({
  topic,
  upcomingTopic,
}: {
  topic: RoadmapTopic | undefined;
  upcomingTopic?: RoadmapTopic;
}) {
  if (!topic) {
    return (
      <Card className="p-6 text-center">
        <Compass className="mx-auto size-6 text-success" />
        <p className="mt-2 font-semibold text-text">Roadmap complete!</p>
        <p className="mt-1 text-sm text-text-muted">
          You&rsquo;ve finished every topic on the Backend track. Ship a project or revisit
          your notes.
        </p>
      </Card>
    );
  }

  return (
    <Card className="animate-rise-in overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-primary-soft">
          <Compass className="size-3.5" />
          Current mission
        </div>
        <h3 className="mt-2 text-lg font-semibold text-text">{topic.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-text-muted">{topic.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="muted">{topic.difficulty}</Badge>
          <Badge variant="muted">{topic.estimatedHours}h</Badge>
          <Badge>+{topic.xpReward} XP</Badge>
        </div>

        <Link
          href={`/roadmap/${topic.id}`}
          className={cn(buttonVariants({ size: "default" }), "mt-4 w-full sm:w-auto")}
        >
          Continue quest <ArrowRight className="size-4" />
        </Link>

        {upcomingTopic && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-text-faint">
            <CornerDownRight className="size-3.5" />
            Up next: {upcomingTopic.name}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

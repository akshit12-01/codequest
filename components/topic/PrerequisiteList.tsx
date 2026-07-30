import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import type { AppState } from "@/types";
import { getTopicById, isTopicComplete } from "@/lib/roadmapEngine";

export function PrerequisiteList({
  prerequisites,
  state,
}: {
  prerequisites: string[];
  state: AppState;
}) {
  if (prerequisites.length === 0) {
    return <p className="text-sm text-text-muted">No prerequisites — start anytime.</p>;
  }
  return (
    <ul className="space-y-1.5">
      {prerequisites.map((id) => {
        const topic = getTopicById(id);
        const done = isTopicComplete(state, id);
        return (
          <li key={id}>
            <Link
              href={`/roadmap/${id}`}
              className="flex items-center gap-2 text-sm transition-colors hover:text-primary-soft"
            >
              {done ? (
                <CheckCircle2 className="size-4 shrink-0 text-success" />
              ) : (
                <Circle className="size-4 shrink-0 text-text-faint" />
              )}
              <span className={done ? "text-text-muted line-through" : "text-text"}>
                {topic?.name ?? id}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

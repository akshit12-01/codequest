"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppState, RoadmapTopic } from "@/types";
import { isTopicComplete } from "@/lib/roadmapEngine";
import { TopicNode } from "./TopicNode";

export function RoadmapTierSection({
  tier,
  topics,
  state,
  defaultOpen = true,
}: {
  tier: number;
  topics: RoadmapTopic[];
  state: AppState;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const completedCount = topics.filter((t) => isTopicComplete(state, t.id)).length;

  return (
    <div className="animate-rise-in rounded-xl border border-border bg-surface">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs text-text-faint">TIER {tier}</span>
          <span className="text-sm font-medium text-text">
            {completedCount}/{topics.length} complete
          </span>
        </div>
        <ChevronDown
          className={cn("size-4 text-text-muted transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="grid gap-3 border-t border-border p-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <TopicNode key={topic.id} topic={topic} state={state} />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useAppData } from "@/hooks/useAppData";
import { ROADMAP_TRACKS } from "@/config/roadmaps/backend";
import { isTopicUnlocked, isTopicComplete, getTrackProgress } from "@/lib/roadmapEngine";
import { RoadmapTierSection } from "@/components/roadmap/RoadmapTierSection";
import {
  RoadmapFilters,
  type StatusFilter,
  type DifficultyFilter,
} from "@/components/roadmap/RoadmapFilters";
import { Progress } from "@/components/ui/progress";
import type { AppState, RoadmapTopic } from "@/types";

function statusOf(state: AppState, topic: RoadmapTopic): StatusFilter {
  if (isTopicComplete(state, topic.id)) return "complete";
  return isTopicUnlocked(state, topic) ? "unlocked" : "locked";
}

export default function RoadmapPage() {
  const { state } = useAppData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");

  const track = ROADMAP_TRACKS[0];

  const filteredTopics = useMemo(() => {
    if (!state) return [];
    const q = query.trim().toLowerCase();
    return track.topics.filter((t) => {
      if (
        q &&
        !t.name.toLowerCase().includes(q) &&
        !t.description.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (difficulty !== "all" && t.difficulty !== difficulty) return false;
      if (status !== "all" && statusOf(state, t) !== status) return false;
      return true;
    });
  }, [track, query, difficulty, status, state]);

  const tiers = useMemo(() => {
    const map = new Map<number, RoadmapTopic[]>();
    for (const t of filteredTopics) {
      const arr = map.get(t.tier) ?? [];
      arr.push(t);
      map.set(t.tier, arr);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [filteredTopics]);

  if (!state) return null;

  const progress = getTrackProgress(state, track.id);
  const isFiltering = query.trim() !== "" || status !== "all" || difficulty !== "all";

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text">{track.name}</h1>
            <p className="mt-1 text-sm text-text-muted">{track.description}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-lg font-semibold text-primary-soft">{progress}%</p>
            <p className="text-xs text-text-muted">complete</p>
          </div>
        </div>
        <Progress value={progress} className="mt-3 h-2.5" />
      </div>

      <RoadmapFilters
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={setStatus}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
      />

      {tiers.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface p-8 text-center text-sm text-text-muted">
          No topics match your filters.
        </p>
      ) : (
        <div className="space-y-4">
          {tiers.map(([tier, topics]) => (
            <RoadmapTierSection
              key={tier}
              tier={tier}
              topics={topics}
              state={state}
              defaultOpen={isFiltering || tier <= 2}
            />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export type StatusFilter = "all" | "locked" | "unlocked" | "complete";
export type DifficultyFilter = "all" | "Beginner" | "Intermediate" | "Advanced" | "Expert";

export function RoadmapFilters({
  query,
  onQueryChange,
  status,
  onStatusChange,
  difficulty,
  onDifficultyChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  status: StatusFilter;
  onStatusChange: (v: StatusFilter) => void;
  difficulty: DifficultyFilter;
  onDifficultyChange: (v: DifficultyFilter) => void;
}) {
  const selectClass =
    "h-10 rounded-lg border border-border-strong bg-surface-2 px-3 text-sm text-text outline-none focus-visible:border-primary-soft";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-faint" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search topics…"
          className="pl-9"
        />
      </div>
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
        className={selectClass}
        aria-label="Filter by status"
      >
        <option value="all">All statuses</option>
        <option value="unlocked">Unlocked</option>
        <option value="complete">Completed</option>
        <option value="locked">Locked</option>
      </select>
      <select
        value={difficulty}
        onChange={(e) => onDifficultyChange(e.target.value as DifficultyFilter)}
        className={selectClass}
        aria-label="Filter by difficulty"
      >
        <option value="all">All difficulties</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
        <option value="Expert">Expert</option>
      </select>
    </div>
  );
}

"use client";

import { useAppData } from "@/hooks/useAppData";
import { getNextAvailableTopic, getUpcomingTopics } from "@/lib/roadmapEngine";
import { computeDashboardStats } from "@/lib/statsEngine";
import { HeroPanel } from "@/components/dashboard/HeroPanel";
import { ContinueQuestCard } from "@/components/dashboard/ContinueQuestCard";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { SkillOverview } from "@/components/dashboard/SkillOverview";
import { RecentNotes } from "@/components/dashboard/RecentNotes";
import { RecentProjects } from "@/components/dashboard/RecentProjects";

export default function DashboardPage() {
  const { state } = useAppData();
  if (!state) return null;

  const nextTopic = getNextAvailableTopic(state);
  const upcoming = getUpcomingTopics(state, 2)[1];
  const stats = computeDashboardStats(state);

  return (
    <div className="space-y-6">
      <HeroPanel state={state} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ContinueQuestCard topic={nextTopic} upcomingTopic={upcoming} />
          <StatsGrid stats={stats} />
          <div className="grid gap-6 sm:grid-cols-2">
            <RecentNotes state={state} />
            <RecentProjects state={state} />
          </div>
        </div>
        <div className="space-y-6">
          <SkillOverview state={state} />
        </div>
      </div>
    </div>
  );
}

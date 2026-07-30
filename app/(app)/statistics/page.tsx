"use client";

import { BookOpen, FolderGit2, Trophy, Map, Star, Flame } from "lucide-react";
import { useAppData } from "@/hooks/useAppData";
import { computeDashboardStats, getXPHistory, type DashboardStats } from "@/lib/statsEngine";
import { getLevelProgress } from "@/lib/xpEngine";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { XPHistoryChart } from "@/components/statistics/XPHistoryChart";
import { SkillTable } from "@/components/statistics/SkillTable";
import type { AppState } from "@/types";

function buildSummary(state: AppState, stats: DashboardStats): string {
  const parts: string[] = [];
  parts.push(
    `${state.username} is level ${state.level} with ${state.totalXP.toLocaleString()} total XP, having completed ${stats.topicsCompleted} of ${stats.totalTopics} backend roadmap topics (${stats.roadmapProgressPercent}%).`
  );

  if (stats.projectsSubmitted > 0) {
    parts.push(
      `${stats.projectsSubmitted} project${stats.projectsSubmitted === 1 ? "" : "s"} submitted, ${stats.projectsReviewed} reviewed` +
        (stats.avgProjectRating !== null
          ? ` at an average rating of ${stats.avgProjectRating}/100.`
          : ".")
    );
  } else {
    parts.push("No projects submitted yet — that's the fastest way to earn a big XP boost.");
  }

  if (stats.bestSkill) {
    parts.push(
      `Strongest skill so far: ${stats.bestSkill.name} (level ${stats.bestSkill.level}).` +
        (stats.weakestSkill
          ? ` Most room to grow: ${stats.weakestSkill.name} (level ${stats.weakestSkill.level}).`
          : "")
    );
  }

  if (state.streak.current > 0) {
    parts.push(`Currently on a ${state.streak.current}-day streak (best: ${state.streak.best}).`);
  }

  return parts.join(" ");
}

export default function StatisticsPage() {
  const { state } = useAppData();
  if (!state) return null;

  const stats = computeDashboardStats(state);
  const history = getXPHistory(state, 14);
  const progress = getLevelProgress(state.totalXP);
  const summary = buildSummary(state, stats);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Statistics</h1>
        <p className="mt-1 text-sm text-text-muted">Your learning journey, by the numbers.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={Star} label="Total XP" value={state.totalXP.toLocaleString()} accent="primary" />
        <StatCard
          icon={Trophy}
          label="Level"
          value={String(state.level)}
          sublabel={`${Math.round(progress.percent)}% to next`}
          accent="success"
        />
        <StatCard
          icon={BookOpen}
          label="Topics"
          value={`${stats.topicsCompleted}/${stats.totalTopics}`}
          accent="info"
        />
        <StatCard
          icon={FolderGit2}
          label="Projects"
          value={String(stats.projectsSubmitted)}
          sublabel={`${stats.projectsReviewed} reviewed`}
          accent="primary"
        />
        <StatCard icon={Map} label="Roadmap" value={`${stats.roadmapProgressPercent}%`} accent="warning" />
        <StatCard
          icon={Flame}
          label="Streak"
          value={String(state.streak.current)}
          sublabel={`best ${state.streak.best}`}
          accent="warning"
        />
      </div>

      <Card className="animate-rise-in">
        <CardHeader>
          <CardTitle className="text-base">XP — last 14 days</CardTitle>
        </CardHeader>
        <CardContent>
          <XPHistoryChart history={history} />
        </CardContent>
      </Card>

      <Card className="animate-rise-in">
        <CardHeader>
          <CardTitle className="text-base">Learning summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-text-muted">{summary}</p>
        </CardContent>
      </Card>

      <Card className="animate-rise-in">
        <CardHeader>
          <CardTitle className="text-base">Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <SkillTable state={state} />
        </CardContent>
      </Card>
    </div>
  );
}
